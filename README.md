# Parlay Tools - AI Sports Analytics

A full-stack web application for AI-powered sports analytics and betting insights, built with FastAPI backend and Next.js 14 frontend.

## Features

- **Match Simulator**: Predict match outcomes using Monte Carlo Poisson simulation
- **Value Picks**: Find betting opportunities with positive expected value
- **AI-Powered**: Ready for machine learning model integration
- **Modern Stack**: FastAPI + Next.js 14 + TypeScript + Tailwind CSS

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd parlay-tools-demo

# Start development environment
make dev
```

This will start:
- Backend API at http://localhost:8000
- Frontend at http://localhost:3000
- API Documentation at http://localhost:8000/docs

### Option 2: Local Development

```bash
# Install dependencies
make install-backend
make install-frontend

# Start backend (in one terminal)
make run-backend

# Start frontend (in another terminal)
make run-frontend
```

## Project Structure

```
parlay-tools-demo/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── ml/
│   │   │   └── model.py         # ML model stubs
│   │   └── tests/               # Backend tests
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/                     # Next.js 14 app directory
│   │   ├── simulator/           # Match simulator page
│   │   ├── picks/               # Value picks page
│   │   └── api/                 # API proxy routes
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── Makefile
└── README.md
```

## API Endpoints

### Backend (FastAPI)

- `GET /health` - Health check
- `POST /predict` - Match outcome prediction
- `POST /picks` - Value picks analysis

### Frontend (Next.js)

- `/` - Home page
- `/simulator` - Match simulator
- `/picks` - Value picks finder
- `/api/predict` - Proxy to backend
- `/api/picks` - Proxy to backend

## Machine Learning Integration

The application is designed to easily integrate real machine learning models:

### Current Implementation
- Dummy coefficients in `backend/app/ml/model.py`
- Poisson simulation using numpy/scipy
- Monte Carlo simulation with 10,000 draws

### To Add Real ML Model

1. **Replace dummy data** in `backend/app/ml/model.py`:
   ```python
   def train_poisson_model(df: pd.DataFrame) -> Dict[str, Any]:
       # TODO: Implement actual Poisson regression
       # Use scikit-learn or statsmodels
       pass
   ```

2. **Add real training data**:
   - Historical match results
   - Team statistics
   - Player performance data

3. **Implement model training**:
   - Poisson regression for goal prediction
   - Feature engineering
   - Model validation

## Development Commands

```bash
# Development
make dev              # Start with hot reload
make demo             # Build and start containers
make build            # Build containers only
make clean            # Stop and remove containers

# Testing
make test             # Run backend tests

# Local development (without Docker)
make install-backend  # Install Python dependencies
make install-frontend # Install Node.js dependencies
make run-backend      # Run backend locally
make run-frontend     # Run frontend locally
```

## Deployment

### Backend (Render)
- Configuration in `render.yaml`
- Deploy to Render.com
- Environment variables: `PYTHONPATH=/opt/render/project/src`

### Frontend (Vercel)
- Deploy to Vercel
- Environment variable: `NEXT_PUBLIC_API_BASE=<backend-url>`
- Already configured for https://parlay-demo.vercel.app

## Sample API Response

### POST /predict
```json
{
  "lambda_home": 1.8,
  "lambda_away": 1.2,
  "probabilities": {
    "home_win": 0.4567,
    "away_win": 0.2345,
    "draw": 0.3088,
    "over_2_5": 0.6234,
    "under_2_5": 0.3766
  }
}
```

### POST /picks
```json
{
  "value_picks": [
    {
      "team": "Arsenal",
      "market": "win",
      "odds": 2.1,
      "expected_value": 0.15,
      "probability": 0.476
    }
  ]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
