# Node.js Express CRUD Application

This project is a simple CRUD application built with Node.js, Express, and PostgreSQL. It allows users to manage a list of persons with their names and ages through a web interface.

## Features

- Create, Read, Update, and Delete persons
- Simple HTML form for user interaction
- PostgreSQL database connection
- Environment variable configuration

## Project Structure

```
nodejs-express-crud-app
├── src
│   ├── app.js
│   ├── config
│   │   └── database.js
│   ├── controllers
│   │   └── personController.js
│   ├── models
│   │   └── person.js
│   ├── routes
│   │   └── personRoutes.js
│   └── middleware
│       └── errorHandler.js
├── public
│   ├── css
│   │   └── style.css
│   └── js
│       └── script.js
├── views
│   └── index.html
├── package.json
├── .env.example
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd nodejs-express-crud-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file and configure your PostgreSQL database connection:
   ```
   DATABASE_URL=your_database_url
   ```

4. Start the application:
   ```
   npm start
   ```

## Usage

- Open your browser and navigate to `http://localhost:3000`.
- Use the form to add new persons and manage the existing list.

## License

This project is licensed under the MIT License.