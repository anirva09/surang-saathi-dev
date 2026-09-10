#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo
echo "============================================================"
echo "  Surang Saathi - Local SIH Demo Setup"
echo "============================================================"
echo

if ! command -v docker >/dev/null 2>&1; then
  echo "[ERROR] Docker was not found. Install/start Docker and retry."
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "[ERROR] Docker daemon is not running."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[ERROR] npm was not found. Install Node.js 20+ and retry."
  exit 1
fi

if [[ ! -f .env ]]; then
  echo "[1/7] Creating root .env..."
  cp .env.example .env
else
  echo "[1/7] Root .env already exists."
fi

echo "[2/7] Building and starting Docker services..."
docker compose up -d --build

echo "[3/7] Ensuring the API is started after PostgreSQL initialization..."
docker compose start api >/dev/null 2>&1 || true

echo "[4/7] Waiting for FastAPI..."
api_ready=0
for _ in $(seq 1 30); do
  if curl -fsS http://localhost:8000/health >/dev/null 2>&1; then
    api_ready=1
    break
  fi

  # A fresh PostGIS volume briefly restarts PostgreSQL during initialization.
  # Retry the API in case it exited during that window.
  docker compose start api >/dev/null 2>&1 || true
  sleep 2
done

if [[ "$api_ready" -ne 1 ]]; then
  echo "[ERROR] FastAPI did not become healthy within 60 seconds."
  docker compose ps
  echo
  echo "Inspect with: docker compose logs api --tail=200"
  exit 1
fi

echo "[5/7] Loading deterministic SIH demonstration data..."
docker compose exec -T api python -m app.seed.run

if [[ ! -f apps/web/.env.local ]]; then
  echo "[6/7] Creating apps/web/.env.local..."
  cp apps/web/.env.example apps/web/.env.local
else
  echo "[6/7] apps/web/.env.local already exists."
fi

echo "[7/7] Installing frontend dependencies..."
npm ci

echo
echo "Checking backend readiness..."
curl -fsS http://localhost:8000/ready
echo

echo
echo "============================================================"
echo "  Setup complete"
echo "============================================================"
echo
echo "Backend:      http://localhost:8000"
echo "API docs:     http://localhost:8000/docs"
echo "MinIO:        http://localhost:9001"
echo
echo "Start the web application with:"
echo
echo "  npm run dev"
echo
echo "Then open:"
echo
echo "  http://localhost:3000"
echo
