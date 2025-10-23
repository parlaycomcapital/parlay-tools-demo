import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_predict_endpoint():
    response = client.post(
        "/predict",
        json={
            "home_team": "Arsenal",
            "away_team": "Chelsea",
            "sims": 1000
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "lambda_home" in data
    assert "lambda_away" in data
    assert "probabilities" in data
    assert data["lambda_home"] > 0
    assert data["lambda_away"] > 0

def test_picks_endpoint():
    response = client.post(
        "/picks",
        json={
            "candidates": [
                {"team": "home", "odds": 2.0, "market": "win"},
                {"team": "away", "odds": 3.0, "market": "win"}
            ],
            "threshold": 0.1
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "value_picks" in data
    assert isinstance(data["value_picks"], list)
