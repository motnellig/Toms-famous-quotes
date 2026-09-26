/**
 * Timeless Quotes — Vanilla JavaScript Application
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements - Hero
  const heroQuoteCard = document.getElementById("hero-quote-card");
  const heroQuoteText = document.getElementById("hero-quote-text");
  const heroQuoteAuthor = document.getElementById("hero-quote-author");
  const heroCategory = document.getElementById("hero-category");
  const randomBtn = document.getElementById("random-btn");
  const copyBtn = document.getElementById("copy-btn");
  const copyToast = document.getElementById("copy-toast");
  const filterThisAuthorBtn = document.getElementById("filter-this-author-btn");

  // DOM Elements - Controls & Filters
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("clear-search-btn");
  const categoryPillsContainer = document.getElementById("category-pills");
  const authorSelect = document.getElementById("author-select");
  const resetAllBtn = document.getElementById("reset-all-btn");
  const resultsCount = document.getElementById("results-count");
  const totalCountBadge = document.getElementById("total-count-badge");

  // DOM Elements - Results Grid
  const quotesGrid = document.getElementById("quotes-grid");
  const noResults = document.getElementById("no-results");

  // State
  let currentHeroQuote = null;
  let activeCategory = "all";
  let activeAuthor = "";
  let searchQuery = "";
  let debounceTimeout = null;

  // Initialize
  init();

  async function init() {
    await Promise.all([
      loadCategories(),
      loadAuthors(),
      loadRandomQuote(),
      searchQuotes()
    ]);

    setupEventListeners();
  }

  // Event Listeners Setup
  function setupEventListeners() {
    // Random quote button
    randomBtn.addEventListener("click", () => {
      // Pick random from current category/author filters if set, otherwise from all
      const cat = activeCategory !== "all" ? activeCategory : "";
      loadRandomQuote(cat, activeAuthor);
    });

    // Copy to clipboard
    copyBtn.addEventListener("click", copyHeroQuote);

    // "More by this author" button
    filterThisAuthorBtn.addEventListener("click", () => {
      if (currentHeroQuote && currentHeroQuote.author) {
        setAuthorFilter(currentHeroQuote.author);
        document.querySelector(".controls-section").scrollIntoView({ behavior: "smooth" });
      }
    });

    // Search input (debounced)
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      clearSearchBtn.style.display = searchQuery ? "block" : "none";

      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        searchQuotes();
      }, 250);
    });

    // Clear search button
    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = "";
      searchQuery = "";
      clearSearchBtn.style.display = "none";
      searchQuotes();
      searchInput.focus();
    });

    // Author dropdown change
    authorSelect.addEventListener("change", (e) => {
      activeAuthor = e.target.value;
      searchQuotes();
    });

    // Reset all filters button
    resetAllBtn.addEventListener("click", resetFilters);

    // Any "Clear All Filters" trigger in empty states
    document.querySelectorAll(".reset-trigger-btn").forEach((btn) => {
      btn.addEventListener("click", resetFilters);
    });
  }

  // Fetch and display a random quote with smooth animation
  async function loadRandomQuote(category = "", author = "") {
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (author) params.append("author", author);

      const url = `/api/quote/random${params.toString() ? "?" + params.toString() : ""}`;
      const res = await fetch(url);

      if (!res.ok) {
        // Fallback to purely random if filtered random yielded 404
        if (category || author) {
          return loadRandomQuote("", "");
        }
        throw new Error("Failed to fetch random quote");
      }

      const quote = await res.json();
      displayHeroQuote(quote);
    } catch (err) {
      console.error("Error loading random quote:", err);
      heroQuoteText.textContent = "Could not load quote. Please refresh.";
    }
  }

  // Update hero card DOM with smooth transition
  function displayHeroQuote(quote) {
    currentHeroQuote = quote;

    heroQuoteText.classList.add("fade-out");
    heroQuoteAuthor.classList.add("fade-out");

    setTimeout(() => {
      heroQuoteText.textContent = `"${quote.quote}"`;
      heroQuoteAuthor.textContent = `— ${quote.author}`;
      heroCategory.textContent = quote.category;

      heroQuoteText.classList.remove("fade-out");
      heroQuoteAuthor.classList.remove("fade-out");
    }, 200);
  }

  // Copy current hero quote to clipboard
  async function copyHeroQuote() {
    if (!currentHeroQuote) return;
    const textToCopy = `"${currentHeroQuote.quote}" — ${currentHeroQuote.author} (${currentHeroQuote.category})`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      // Show toast
      copyToast.classList.add("show");
      setTimeout(() => {
        copyToast.classList.remove("show");
      }, 1600);
    } catch (err) {
      console.error("Failed to copy quote:", err);
    }
  }

  // Load and render category filter pills
  async function loadCategories() {
    try {
      const res = await fetch("/api/categories");
      const categories = await res.json();

      let total = 0;
      categories.forEach((cat) => (total += cat.count));
      totalCountBadge.textContent = total;

      categories.forEach((cat) => {
        const btn = document.createElement("button");
        btn.className = "pill-btn";
        btn.dataset.category = cat.name;
        btn.innerHTML = `
          <span>${cat.name}</span>
          <span class="pill-count">${cat.count}</span>
        `;

        btn.addEventListener("click", () => {
          setCategoryFilter(cat.name);
        });

        categoryPillsContainer.appendChild(btn);
      });

      // Hook up the 'All' pill
      const allPill = categoryPillsContainer.querySelector('[data-category="all"]');
      allPill.addEventListener("click", () => {
        setCategoryFilter("all");
      });
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  }

  // Load and populate authors dropdown
  async function loadAuthors() {
    try {
      const res = await fetch("/api/authors");
      const authors = await res.json();

      authors.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.name;
        option.textContent = `${item.name} (${item.count})`;
        authorSelect.appendChild(option);
      });
    } catch (err) {
      console.error("Error loading authors:", err);
    }
  }

  // Set category filter and update UI
  function setCategoryFilter(category) {
    activeCategory = category;

    // Update pill styles
    const pills = categoryPillsContainer.querySelectorAll(".pill-btn");
    pills.forEach((p) => {
      if (p.dataset.category.toLowerCase() === category.toLowerCase()) {
        p.classList.add("active");
      } else {
        p.classList.remove("active");
      }
    });

    searchQuotes();
  }

  // Set author filter programmatically
  function setAuthorFilter(authorName) {
    activeAuthor = authorName;
    authorSelect.value = authorName;
    searchQuotes();
  }

  // Fetch quotes matching current filters
  async function searchQuotes() {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (activeCategory && activeCategory !== "all") params.append("category", activeCategory);
      if (activeAuthor) params.append("author", activeAuthor);

      const res = await fetch(`/api/quotes?${params.toString()}`);
      const data = await res.json();

      resultsCount.textContent = `${data.total} quote${data.total === 1 ? "" : "s"}`;
      renderQuotesGrid(data.quotes);
    } catch (err) {
      console.error("Error searching quotes:", err);
    }
  }

  // Render quotes cards in the grid
  function renderQuotesGrid(quotes) {
    quotesGrid.innerHTML = "";

    if (!quotes || quotes.length === 0) {
      noResults.style.display = "block";
      quotesGrid.style.display = "none";
      return;
    }

    noResults.style.display = "none";
    quotesGrid.style.display = "grid";

    quotes.forEach((q) => {
      const card = document.createElement("article");
      card.className = "quote-grid-card";
      card.title = "Click to feature this quote";

      card.innerHTML = `
        <p class="grid-card-text">&ldquo;${escapeHtml(q.quote)}&rdquo;</p>
        <div class="grid-card-footer">
          <span class="grid-card-author">— ${escapeHtml(q.author)}</span>
          <span class="grid-card-category">${escapeHtml(q.category)}</span>
        </div>
      `;

      // Clicking any grid card promotes it to the hero card
      card.addEventListener("click", () => {
        displayHeroQuote(q);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      quotesGrid.appendChild(card);
    });
  }

  // Reset all filters to default state
  function resetFilters() {
    searchInput.value = "";
    searchQuery = "";
    clearSearchBtn.style.display = "none";
    authorSelect.value = "";
    activeAuthor = "";
    setCategoryFilter("all");
  }

  // Helper to prevent XSS in text rendering
  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
