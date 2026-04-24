#!/bin/bash

echo "Starting EventBridge..."

cleanup() {
  echo "Stopping containers..."
  docker-compose stop
  exit 0
}

trap cleanup SIGINT

# This handles create OR start automatically
docker-compose up -d

echo "Waiting for Postgres..."

RETRIES=10
until docker-compose exec -T postgres pg_isready -U user > /dev/null 2>&1
do
  echo "Postgres not ready yet..."
  sleep 2
  RETRIES=$((RETRIES-1))

  if [ $RETRIES -le 0 ]; then
    echo "Postgres failed to start"
    exit 1
  fi
done

echo "Running migrations..."
docker-compose exec -T api npx sequelize-cli db:migrate

echo "System is ready. Press Ctrl+C to stop."

docker-compose logs -f