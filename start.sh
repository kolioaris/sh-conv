#!/bin/bash
echo "Starting sh-conv..."

BACKEND_PORT=${BACKEND_PORT:-8000}
FRONTEND_PORT=${PORT:-3000}

echo "Frontend: http://0.0.0.0:$FRONTEND_PORT"
echo "Backend:  http://0.0.0.0:$BACKEND_PORT"

echo "Running backend..."
cd /app/backend
uvicorn main:app --host 0.0.0.0 --port $BACKEND_PORT &

echo "Running frontend..."
cd /app/frontend
PORT=$FRONTEND_PORT bun server.js &

wait
