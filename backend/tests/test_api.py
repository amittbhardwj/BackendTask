import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)

def test_generate_survey():
    response = client.post(
        "/api/surveys/generate",
        json={"description": "Create a customer satisfaction survey"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "title" in data
    assert "questions" in data
    assert isinstance(data["questions"], list)

def test_invalid_description():
    response = client.post(
        "/api/surveys/generate",
        json={"description": ""}
    )
    assert response.status_code == 422

def test_rate_limiting():
    # Make multiple requests to test rate limiting
    for _ in range(settings.RATE_LIMIT + 1):
        response = client.post(
            "/api/surveys/generate",
            json={"description": "Test rate limiting"}
        )
    assert response.status_code == 429  # Too Many Requests