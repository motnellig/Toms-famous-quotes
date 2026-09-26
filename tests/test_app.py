import json
import sys
from pathlib import Path
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app import app, load_quotes


@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_quotes_data_integrity():
    """Verify that exactly 100 well-formed quotes exist in data/quotes.json."""
    quotes = load_quotes()
    assert len(quotes) == 100, f"Expected 100 quotes, found {len(quotes)}"

    seen_ids = set()
    for q in quotes:
        assert "id" in q and isinstance(q["id"], int)
        assert q["id"] not in seen_ids, f"Duplicate quote id {q['id']}"
        seen_ids.add(q["id"])

        assert "quote" in q and len(q["quote"].strip()) > 0
        assert "author" in q and len(q["author"].strip()) > 0
        assert "category" in q and len(q["category"].strip()) > 0


def test_index_page(client):
    """Verify home page loads successfully with HTML content."""
    res = client.get("/")
    assert res.status_code == 200
    assert b"Timeless Quotes" in res.data
    assert b"New Random Quote" in res.data


def test_get_random_quote(client):
    """Verify random quote endpoint returns valid quote object."""
    res = client.get("/api/quote/random")
    assert res.status_code == 200
    data = res.get_json()
    assert "quote" in data
    assert "author" in data
    assert "category" in data


def test_get_random_quote_filtered_by_category(client):
    """Verify random quote filtered by category."""
    res = client.get("/api/quote/random?category=Science")
    assert res.status_code == 200
    data = res.get_json()
    assert data["category"] == "Science"


def test_get_random_quote_filtered_by_author(client):
    """Verify random quote filtered by author."""
    res = client.get("/api/quote/random?author=Einstein")
    assert res.status_code == 200
    data = res.get_json()
    assert "Einstein" in data["author"]


def test_get_random_quote_not_found(client):
    """Verify 404 when no quotes match criteria."""
    res = client.get("/api/quote/random?category=NonExistentCategoryXYZ")
    assert res.status_code == 404
    data = res.get_json()
    assert "error" in data


def test_get_all_quotes(client):
    """Verify all 100 quotes are returned when no filters applied."""
    res = client.get("/api/quotes")
    assert res.status_code == 200
    data = res.get_json()
    assert data["total"] == 100
    assert len(data["quotes"]) == 100


def test_search_quotes_by_query(client):
    """Verify search by keyword across quote text."""
    res = client.get("/api/quotes?q=imagination")
    assert res.status_code == 200
    data = res.get_json()
    assert data["total"] > 0
    for q in data["quotes"]:
        assert "imagination" in q["quote"].lower() or "imagination" in q["author"].lower()


def test_filter_quotes_by_category(client):
    """Verify category filtering."""
    res = client.get("/api/quotes?category=Philosophy")
    assert res.status_code == 200
    data = res.get_json()
    assert data["total"] > 0
    for q in data["quotes"]:
        assert q["category"].lower() == "philosophy"


def test_filter_quotes_by_author(client):
    """Verify author filtering."""
    res = client.get("/api/quotes?author=Shakespeare")
    assert res.status_code == 200
    data = res.get_json()
    assert data["total"] > 0
    for q in data["quotes"]:
        assert "shakespeare" in q["author"].lower()


def test_get_categories_list(client):
    """Verify categories endpoint returns sorted list of categories with counts."""
    res = client.get("/api/categories")
    assert res.status_code == 200
    categories = res.get_json()
    assert len(categories) > 0
    total_count = sum(c["count"] for c in categories)
    assert total_count == 100
    cat_names = [c["name"] for c in categories]
    assert "Philosophy" in cat_names
    assert "Science" in cat_names


def test_get_authors_list(client):
    """Verify authors endpoint returns list of authors with counts."""
    res = client.get("/api/authors")
    assert res.status_code == 200
    authors = res.get_json()
    assert len(authors) > 0
    total_count = sum(a["count"] for a in authors)
    assert total_count == 100
    author_names = [a["name"] for a in authors]
    assert "Albert Einstein" in author_names
    assert "Oscar Wilde" in author_names
