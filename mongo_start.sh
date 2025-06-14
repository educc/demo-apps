#!/bin/bash

# MongoDB Docker container startup script
# This script starts a MongoDB 8 container for the TODO app

CONTAINER_NAME="todo-mongo"
MONGO_PORT="27017"
MONGO_VERSION="8"

echo "Starting MongoDB $MONGO_VERSION container..."

# Check if container already exists and is running
if docker ps | grep -q $CONTAINER_NAME; then
    echo "MongoDB container '$CONTAINER_NAME' is already running!"
    exit 0
fi

# Check if container exists but is stopped
if docker ps -a | grep -q $CONTAINER_NAME; then
    echo "Starting existing MongoDB container '$CONTAINER_NAME'..."
    docker start $CONTAINER_NAME
else
    echo "Creating and starting new MongoDB container '$CONTAINER_NAME'..."
    docker run -d \
        --name $CONTAINER_NAME \
        -p $MONGO_PORT:27017 \
        -v todo_mongo_data:/data/db \
        mongo:$MONGO_VERSION
fi

# Wait a moment for the container to start
sleep 3

# Check if container is running
if docker ps | grep -q $CONTAINER_NAME; then
    echo "✅ MongoDB container '$CONTAINER_NAME' is running successfully!"
    echo "📍 Connection string: mongodb://localhost:$MONGO_PORT"
    echo "🗂️  Database will be: todoapp"
    echo ""
    echo "To stop the container, run: docker stop $CONTAINER_NAME"
    echo "To remove the container, run: docker rm $CONTAINER_NAME"
    echo "To remove the data volume, run: docker volume rm todo_mongo_data"
else
    echo "❌ Failed to start MongoDB container"
    exit 1
fi
