.PHONY: dev demo build clean test

# Development commands
dev:
	@echo "Starting development environment..."
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:3000"
	@echo "API Docs: http://localhost:8000/docs"
	@echo ""
	@echo "Starting services with hot reload..."
	docker-compose up --build

# Demo commands
demo:
	@echo "Building and starting demo containers..."
	docker-compose -f docker-compose.yml up --build -d
	@echo ""
	@echo "Demo is running at:"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8000"
	@echo "API Docs: http://localhost:8000/docs"

# Build commands
build:
	@echo "Building containers..."
	docker-compose build

# Clean commands
clean:
	@echo "Stopping and removing containers..."
	docker-compose down -v
	docker system prune -f

# Test commands
test:
	@echo "Running backend tests..."
	cd backend && python -m pytest tests/ -v

# Install dependencies locally (for development without Docker)
install-backend:
	cd backend && pip install -r requirements.txt

install-frontend:
	cd frontend && npm install

# Run locally without Docker
run-backend:
	cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

run-frontend:
	cd frontend && npm run dev

# Help
help:
	@echo "Available commands:"
	@echo "  dev          - Start development environment with hot reload"
	@echo "  demo         - Build and start demo containers"
	@echo "  build        - Build containers"
	@echo "  clean        - Stop and remove containers"
	@echo "  test         - Run backend tests"
	@echo "  install-backend  - Install backend dependencies"
	@echo "  install-frontend - Install frontend dependencies"
	@echo "  run-backend  - Run backend locally"
	@echo "  run-frontend - Run frontend locally"
	@echo "  help         - Show this help message"
