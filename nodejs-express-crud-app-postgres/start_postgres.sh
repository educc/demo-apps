#!/bin/bash

# Start PostgreSQL 14 using Docker
echo "Starting PostgreSQL 14 container..."

# Stop and remove existing container if it exists
docker stop postgres-dev 2>/dev/null || true
docker rm postgres-dev 2>/dev/null || true

# Run PostgreSQL 14 container
docker run -d \
  --name postgres-dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=myapp \
  -p 5432:5432 \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:14

echo "PostgreSQL 14 container started!"
echo "Connection details:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: myapp"
echo "  Username: postgres"
echo "  Password: postgres"
echo ""
echo "To connect: psql -h localhost -U postgres -d myapp"