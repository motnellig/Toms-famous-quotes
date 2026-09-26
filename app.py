import json
import random
from pathlib import Path
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "quotes.json"


def load_quotes():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/quote/random", methods=["GET"])
def get_random_quote():
    quotes = load_quotes()
    category = request.args.get("category", "").strip()
    author = request.args.get("author", "").strip()

    if category:
        quotes = [q for q in quotes if q["category"].lower() == category.lower()]
    if author:
        quotes = [q for q in quotes if author.lower() in q["author"].lower()]

    if not quotes:
        return jsonify({"error": "No quotes found matching criteria"}), 404

    return jsonify(random.choice(quotes))


@app.route("/api/quotes", methods=["GET"])
def get_quotes():
    quotes = load_quotes()
    query = request.args.get("q", "").strip().lower()
    category = request.args.get("category", "").strip().lower()
    author = request.args.get("author", "").strip().lower()

    filtered = quotes

    if category and category != "all":
        filtered = [q for q in filtered if q["category"].lower() == category]

    if author:
        filtered = [q for q in filtered if author in q["author"].lower()]

    if query:
        filtered = [
            q for q in filtered
            if query in q["quote"].lower() or query in q["author"].lower()
        ]

    return jsonify({
        "total": len(filtered),
        "quotes": filtered
    })


@app.route("/api/categories", methods=["GET"])
def get_categories():
    quotes = load_quotes()
    counts = {}
    for q in quotes:
        cat = q["category"]
        counts[cat] = counts.get(cat, 0) + 1

    categories = [
        {"name": cat, "count": count}
        for cat, count in sorted(counts.items())
    ]
    return jsonify(categories)


@app.route("/api/authors", methods=["GET"])
def get_authors():
    quotes = load_quotes()
    counts = {}
    for q in quotes:
        author = q["author"]
        counts[author] = counts.get(author, 0) + 1

    authors = [
        {"name": author, "count": count}
        for author, count in sorted(counts.items())
    ]
    return jsonify(authors)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
