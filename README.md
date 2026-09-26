# Timeless Quotes 📜

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Flask 3.0+](https://img.shields.io/badge/Flask-3.0%2B-lightgrey.svg)](https://flask.palletsprojects.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20ES6%2B-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tests Passing](https://img.shields.io/badge/Tests-12%2F12%20Passed-brightgreen.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A clean, responsive web application built with **Python Flask**, **plain Vanilla JavaScript**, and modern semantic **HTML5/CSS3** to explore, search, and discover 100 timeless quotes from history's greatest philosophers, scientists, writers, and leaders.

---

## ✨ Main Features

* **100 Curated Well-Known Quotes**: Across 8 distinct categories (*Philosophy, Science, Literature, Wisdom, Leadership, Inspiration, Humor, Art*).
* **Random Quote Generator**: One-click dynamic quote generator with smooth CSS fade transitions.
* **Instant Search & Filtering**:
  * **Debounced Text Search (250ms)**: Real-time search across both quote text and author names without spamming the server.
  * **Dynamic Category Pills**: Interactive filter pills showing real-time quote counts per category.
  * **Dedicated Author Dropdown**: Filter and select quotes by specific historical figures.
* **Interactive UI Actions**:
  * **Copy to Clipboard**: One-click copy with an animated toast notification.
  * **More by this Author**: Promotes the current hero author directly into the active filter.
  * **Click-to-Feature**: Click any card in the search grid to showcase it in the top hero card.
* **Zero External JS/CSS Frameworks**: Pure vanilla ES6+ and modern CSS variables—no React, Vue, jQuery, Tailwind, or CDN dependencies.
* **Fully Tested**: 12 automated unit and integration tests using `pytest` covering all API endpoints and dataset integrity.

---

## 🏛️ Architecture Overview

The project is structured into a clean separation of concerns between backend REST API and lightweight frontend client:

```
├── app.py                  # Flask application & REST API routes
├── requirements.txt        # Python dependencies (Flask, Pytest)
├── .gitignore              # Ignored files (venv, caches, etc.)
├── data/
│   └── quotes.json         # 100 curated quotes with author & category
├── static/
│   ├── css/
│   │   └── style.css       # Responsive styling with dark/light mode
│   └── js/
│       └── app.js          # Client state, event listeners & Fetch API
├── templates/
│   └── index.html          # Semantic HTML5 layout
└── tests/
    └── test_app.py         # Automated pytest suite (12 tests)
```

### 1. Server-Side (Python Flask)
* **`app.py`**: Serves the single-page application and handles stateless JSON REST endpoints.
* **`data/quotes.json`**: Acts as the local data source containing 100 verified quotes with `id`, `quote`, `author`, and `category`.

### 2. Client-Side (Vanilla JS, HTML5, CSS3)
* **`templates/index.html`**: Semantic layout containing the Hero card, filter control bar, and results grid container.
* **`static/js/app.js`**: Pure vanilla JavaScript managing local state (`currentHeroQuote`, `activeCategory`, `activeAuthor`, `searchQuery`), asynchronous `fetch()` requests, DOM updates, and input debouncing.
* **`static/css/style.css`**: CSS custom properties, responsive flexbox and grid layouts, and smooth transition states.

---

## 🔌 REST API Reference

All API responses are formatted as JSON.

| Method | Endpoint | Query Parameters | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | — | Serves the web interface (`index.html`) |
| `GET` | `/api/quote/random` | `category`, `author` | Returns a single random quote matching optional criteria |
| `GET` | `/api/quotes` | `q`, `category`, `author` | Returns a list of matching quotes and the total count |
| `GET` | `/api/categories` | — | Returns all categories with their respective quote counts |
| `GET` | `/api/authors` | — | Returns all unique authors and their quote counts |

### Example API Requests & Responses

#### Get a Random Science Quote:
```bash
curl "http://127.0.0.1:5000/api/quote/random?category=Science"
```
```json
{
  "id": 16,
  "quote": "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
  "author": "Albert Einstein",
  "category": "Science"
}
```

#### Search Quotes by Author or Keyword:
```bash
curl "http://127.0.0.1:5000/api/quotes?author=Einstein"
```
```json
{
  "total": 2,
  "quotes": [
    {
      "id": 16,
      "quote": "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
      "author": "Albert Einstein",
      "category": "Science"
    },
    {
      "id": 27,
      "quote": "Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world.",
      "author": "Albert Einstein",
      "category": "Science"
    }
  ]
}
```

---

## 🚀 Quickstart Guide

### Prerequisites
* Python 3.10 or higher
* `git`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/motnellig/Toms-famous-quotes.git
   cd Toms-famous-quotes
   ```

2. **Create a virtual environment**:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the Flask development server**:
   ```bash
   python app.py
   ```

5. **Open in your browser**:
   Visit **`http://127.0.0.1:5000`**

---

## 🧪 Running Automated Tests

The test suite validates data integrity, routing, query filtering, and 404 handling.

Run tests using `pytest`:
```bash
pytest -v tests/test_app.py
```

### Test Coverage:
* `test_quotes_data_integrity`: Verifies exactly 100 non-empty, unique ID quotes exist.
* `test_index_page`: Confirms homepage loads with HTTP 200 and required elements.
* `test_get_random_quote`: Tests random quote structure and fields.
* `test_get_random_quote_filtered_by_category`: Tests category-filtered random picks.
* `test_get_random_quote_filtered_by_author`: Tests author-filtered random picks.
* `test_get_random_quote_not_found`: Verifies 404 response for non-existent criteria.
* `test_get_all_quotes`: Validates retrieving all 100 quotes without filters.
* `test_search_quotes_by_query`: Verifies substring matching across text and author.
* `test_filter_quotes_by_category`: Validates category filtering.
* `test_filter_quotes_by_author`: Validates author filtering.
* `test_get_categories_list`: Verifies categories and counts sum to 100.
* `test_get_authors_list`: Verifies unique authors and counts sum to 100.

---

## 📚 Dataset Categories & Sample Authors

The dataset contains 100 quotes across 8 categories:

* **Philosophy (15)**: Socrates, Aristotle, Plato, Marcus Aurelius, Seneca, Nietzsche, Camus, Lao Tzu, Descartes, Kant, Kierkegaard.
* **Science (15)**: Albert Einstein, Marie Curie, Isaac Newton, Richard Feynman, Carl Sagan, Stephen Hawking, Galileo Galilei, Nikola Tesla, Charles Darwin, Ada Lovelace.
* **Literature (15)**: William Shakespeare, Leo Tolstoy, Charles Dickens, F. Scott Fitzgerald, J.R.R. Tolkien, George Orwell, Ernest Hemingway, Harper Lee, Jane Austen.
* **Wisdom (15)**: Theodore Roosevelt, Robert Frost, Benjamin Franklin, Ralph Waldo Emerson, Henry David Thoreau, Eleanor Roosevelt, Buddha, Rumi, Lao Tzu.
* **Leadership (12)**: Nelson Mandela, Winston Churchill, Abraham Lincoln, Martin Luther King Jr., Mahatma Gandhi, John F. Kennedy, Sun Tzu, Franklin D. Roosevelt.
* **Inspiration (10)**: Steve Jobs, Helen Keller, Walt Disney, Maya Angelou, Wayne Gretzky, William James, Arthur Ashe, Mark Twain.
* **Humor (9)**: Oscar Wilde, Groucho Marx, Steve Martin, Mark Twain, Dalai Lama.
* **Art (9)**: Pablo Picasso, Leonardo da Vinci, Vincent van Gogh, Henri Matisse, Thomas Merton, Salvador Dali, Frida Kahlo, Claude Monet.

---

## 📄 License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it for personal or educational purposes.
