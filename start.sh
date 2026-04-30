#!/bin/bash

echo "🚀 Starting EventBridge (LOCAL)"

echo "📦 Running migrations..."
npm run migrate

echo "🟢 Starting backend..."
npm run dev &
BACKEND_PID=$!

echo "🟡 Starting worker..."
npm run start_worker &
WORKER_PID=$!

echo "⏳ Waiting for backend..."

until curl -s http://localhost:3000 > /dev/null; do
  sleep 2
done

echo "📊 Running setup..."
npm run setup

echo "🎨 Starting frontend..."
cd event-dashboard && npm run dev &

echo "✅ All services started"

wait