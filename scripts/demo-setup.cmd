@echo off
setlocal EnableExtensions EnableDelayedExpansion

cd /d "%~dp0.."

echo.
echo ============================================================
echo   Surang Saathi - Local SIH Demo Setup
echo ============================================================
echo.

where docker >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Docker CLI was not found.
    echo Install and start Docker Desktop, then run this script again.
    exit /b 1
)

docker info >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Docker Desktop is not running or the Linux engine is unavailable.
    echo Start Docker Desktop and wait until it is ready.
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo [ERROR] npm was not found.
    echo Install Node.js 20 or newer, then run this script again.
    exit /b 1
)

if not exist ".env" (
    if not exist ".env.example" (
        echo [ERROR] .env.example was not found in the repository root.
        exit /b 1
    )
    echo [1/7] Creating root .env...
    copy /Y ".env.example" ".env" >nul
) else (
    echo [1/7] Root .env already exists.
)

echo [2/7] Building and starting Docker services...
docker compose up -d --build
if errorlevel 1 (
    echo [ERROR] docker compose up failed.
    exit /b 1
)

echo [3/7] Ensuring the API is started after PostgreSQL initialization...
docker compose start api >nul 2>nul

echo [4/7] Waiting for FastAPI...
set API_READY=0
for /L %%I in (1,1,30) do (
    curl -fsS "http://localhost:8000/health" >nul 2>nul
    if not errorlevel 1 (
        set API_READY=1
        goto :api_ready
    )

    rem A fresh PostGIS volume briefly restarts PostgreSQL during initialization.
    rem If the API exited in that window, retry starting it.
    docker compose start api >nul 2>nul
    timeout /t 2 /nobreak >nul
)

:api_ready
if "%API_READY%"=="0" (
    echo [ERROR] FastAPI did not become healthy within 60 seconds.
    echo.
    docker compose ps
    echo.
    echo Inspect the API logs with:
    echo   docker compose logs api --tail=200
    exit /b 1
)

echo [5/7] Loading deterministic SIH demonstration data...
docker compose exec -T api python -m app.seed.run
if errorlevel 1 (
    echo [ERROR] Demo seed failed.
    exit /b 1
)

if not exist "apps\web\.env.local" (
    if not exist "apps\web\.env.example" (
        echo [ERROR] apps\web\.env.example was not found.
        exit /b 1
    )
    echo [6/7] Creating apps\web\.env.local...
    copy /Y "apps\web\.env.example" "apps\web\.env.local" >nul
) else (
    echo [6/7] apps\web\.env.local already exists.
)

echo [7/7] Installing frontend dependencies...
call npm ci
if errorlevel 1 (
    echo [ERROR] npm ci failed.
    exit /b 1
)

echo.
echo Checking backend readiness...
curl -fsS "http://localhost:8000/ready"
if errorlevel 1 (
    echo.
    echo [ERROR] Backend readiness check failed.
    exit /b 1
)

echo.
echo.
echo ============================================================
echo   Setup complete
echo ============================================================
echo.
echo Backend:      http://localhost:8000
echo API docs:     http://localhost:8000/docs
echo MinIO:        http://localhost:9001
echo.
echo Start the web application with:
echo.
echo   npm run dev
echo.
echo Then open:
echo.
echo   http://localhost:3000
echo.
exit /b 0
