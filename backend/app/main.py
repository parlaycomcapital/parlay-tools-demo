from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np
from scipy import stats
import uvicorn

from .ml.model import train_poisson_model, predict_goals

app = FastAPI(title="Parlay Tools API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://parlay-demo.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class PredictionRequest(BaseModel):
    home_team: str
    away_team: str
    sims: int = 10000

class PredictionResponse(BaseModel):
    lambda_home: float
    lambda_away: float
    probabilities: Dict[str, float]

class PickCandidate(BaseModel):
    team: str
    odds: float
    market: str

class PicksRequest(BaseModel):
    candidates: List[PickCandidate]
    threshold: float = 0.1

class ValuePick(BaseModel):
    team: str
    market: str
    odds: float
    expected_value: float
    probability: float

class PicksResponse(BaseModel):
    value_picks: List[ValuePick]

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "parlay-tools-api"}

@app.post("/predict", response_model=PredictionResponse)
async def predict_match(prediction_request: PredictionRequest):
    """
    Predict match outcome using Poisson simulation
    """
    try:
        # Get predicted goal rates
        lambda_home, lambda_away = predict_goals(
            prediction_request.home_team, 
            prediction_request.away_team
        )
        
        # Monte Carlo simulation
        home_goals = np.random.poisson(lambda_home, prediction_request.sims)
        away_goals = np.random.poisson(lambda_away, prediction_request.sims)
        
        # Calculate probabilities
        home_wins = np.sum(home_goals > away_goals) / prediction_request.sims
        away_wins = np.sum(away_goals > home_goals) / prediction_request.sims
        draws = np.sum(home_goals == away_goals) / prediction_request.sims
        
        over_2_5 = np.sum((home_goals + away_goals) > 2.5) / prediction_request.sims
        under_2_5 = 1 - over_2_5
        
        return PredictionResponse(
            lambda_home=lambda_home,
            lambda_away=lambda_away,
            probabilities={
                "home_win": round(home_wins, 4),
                "away_win": round(away_wins, 4),
                "draw": round(draws, 4),
                "over_2_5": round(over_2_5, 4),
                "under_2_5": round(under_2_5, 4)
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/picks", response_model=PicksResponse)
async def find_value_picks(picks_request: PicksRequest):
    """
    Find value picks based on expected value threshold
    """
    try:
        value_picks = []
        
        for candidate in picks_request.candidates:
            # Get predicted probabilities for the team
            if candidate.market == "win":
                # For win markets, we need to determine if it's home or away
                # This is simplified - in real implementation, you'd parse team names
                lambda_home, lambda_away = predict_goals("home", "away")
                
                # Simplified: assume first candidate is home team
                if candidate.team == "home":
                    probability = lambda_home / (lambda_home + lambda_away)
                else:
                    probability = lambda_away / (lambda_home + lambda_away)
            else:
                # For other markets, use simplified probabilities
                probability = 0.5  # Placeholder
            
            # Calculate expected value
            implied_probability = 1 / candidate.odds
            expected_value = (probability * candidate.odds) - 1
            
            if expected_value > picks_request.threshold:
                value_picks.append(ValuePick(
                    team=candidate.team,
                    market=candidate.market,
                    odds=candidate.odds,
                    expected_value=round(expected_value, 4),
                    probability=round(probability, 4)
                ))
        
        return PicksResponse(value_picks=value_picks)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
