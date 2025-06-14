# Node.js TODO App

A simple Node.js TODO application with MongoDB storage using minimal dependencies.

## Features

- Create, read, update, and delete todos
- Mark todos as completed/uncompleted
- Simple web interface included
- MongoDB storage
- Environment variable configuration
- RESTful API

## Prerequisites

- Node.js (v14 or higher)
- MongoDB server running locally or connection string to remote MongoDB

## Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
4. Edit `.env` file with your MongoDB configuration:
   ```
   MONGO_URI=mongodb://localhost:27017
   DB_NAME=todoapp
   PORT=3000
   ```

## Running the Application

1. Make sure MongoDB is running
2. Start the application:
   ```bash
   npm start
   ```

3. Open your browser and go to `http://localhost:3000`

## API Endpoints

- `GET /todos` - Get all todos
- `POST /todos` - Create a new todo
  ```json
  {
    "text": "Buy groceries"
  }
  ```
- `PUT /todos/:id` - Update a todo
  ```json
  {
    "text": "Buy groceries and cook dinner",
    "completed": true
  }
  ```
- `DELETE /todos/:id` - Delete a todo

## Environment Variables

- `MONGO_URI` - MongoDB connection string (default: mongodb://localhost:27017)
- `DB_NAME` - Database name (default: todoapp)
- `PORT` - Server port (default: 3000)

## Dependencies

This app uses minimal dependencies:
- `mongodb` - Official MongoDB driver for Node.js

The application uses only Node.js built-in modules for the HTTP server and routing.

## Database Schema

Todos are stored with the following structure:
```json
{
  "_id": "ObjectId",
  "text": "string",
  "completed": "boolean",
  "createdAt": "Date"
}
```
