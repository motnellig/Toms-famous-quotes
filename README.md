# Timeless Quotes 📜

A clean, responsive web application built with **Python Flask**, **plain Vanilla JavaScript**, and modern semantic **HTML5/CSS3** to explore, search, and discover 100 timeless quotes from history's greatest philosophers, scientists, writers, and leaders.

---

## ✨ Features

- **100 Curated Well-Known Quotes**: Across 8 categories including Philosophy, Science, Literature, Wisdom, Leadership, Inspiration, Humor, and Art.
- **Random Quote Generator**: One-click dynamic quote generator with smooth fade transitions.
- **Search & Filter**:
  - Live full-text search across quotes and authors.
  - Category filter pills with real-time quote counts.
  - Dedicated author dropdown filter.
- **Copy to Clipboard**: Quick copy button with visual feedback.
- **Pure Vanilla Stack**: Zero frontend frameworks or external CDN dependencies.
- **Fully Tested**: Automated test suite with 100% endpoint and data coverage using `pytest`.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/motnellig/Toms-famous-quotes.git
   cd Toms-famous-quotes
   ```

2. **Create a virtual environment & install dependencies**:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```

4. **Open your browser**:
   Navigate to `http://127.0.0.1:5000`

---

## 🧪 Running Tests

```bash
pytest -v tests/test_app.py
```

---

## 📁 Project Structure

```
├── app.py                  # Flask server & REST API
├── requirements.txt        # Python dependencies
├── .gitignore              # Git ignore rules
├── data/
│   └── quotes.json         # 100 curated quotes dataset
├── static/
│   ├── css/
│   │   └── style.css       # Clean, modern responsive stylesheet
│   └── js/
│       └── app.js          # Pure vanilla JavaScript client
├── templates/
│   └── index.html          # Semantic HTML5 template
└── tests/
    └── test_app.py         # Automated pytest suite
```
