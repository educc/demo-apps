const http = require('http');
const url = require('url');
const { MongoClient, ObjectId } = require('mongodb');

// Environment variables for MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'todoapp';
const PORT = process.env.PORT || 3000;

let db;

// Connect to MongoDB
async function connectToMongo() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`Connected to MongoDB at ${MONGO_URI}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// CORS headers
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Parse JSON body
function parseJSON(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

// Send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Routes
async function handleRequest(req, res) {
  setCORSHeaders(res);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  try {
    if (path === '/todos' && method === 'GET') {
      // Get all todos
      const todos = await db.collection('todos').find({}).toArray();
      sendJSON(res, 200, todos);

    } else if (path === '/todos' && method === 'POST') {
      // Create new todo
      const body = await parseJSON(req);
      if (!body.text) {
        sendJSON(res, 400, { error: 'Text is required' });
        return;
      }
      
      const todo = {
        text: body.text,
        completed: false,
        createdAt: new Date()
      };
      
      const result = await db.collection('todos').insertOne(todo);
      todo._id = result.insertedId;
      sendJSON(res, 201, todo);

    } else if (path.startsWith('/todos/') && method === 'PUT') {
      // Update todo
      const id = path.split('/')[2];
      if (!ObjectId.isValid(id)) {
        sendJSON(res, 400, { error: 'Invalid ID' });
        return;
      }

      const body = await parseJSON(req);
      const updateData = {};
      
      if (body.text !== undefined) updateData.text = body.text;
      if (body.completed !== undefined) updateData.completed = body.completed;
      
      const result = await db.collection('todos').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        sendJSON(res, 404, { error: 'Todo not found' });
        return;
      }

      const updatedTodo = await db.collection('todos').findOne({ _id: new ObjectId(id) });
      sendJSON(res, 200, updatedTodo);

    } else if (path.startsWith('/todos/') && method === 'DELETE') {
      // Delete todo
      const id = path.split('/')[2];
      if (!ObjectId.isValid(id)) {
        sendJSON(res, 400, { error: 'Invalid ID' });
        return;
      }

      const result = await db.collection('todos').deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        sendJSON(res, 404, { error: 'Todo not found' });
        return;
      }

      sendJSON(res, 200, { message: 'Todo deleted successfully' });

    } else if (path === '/' && method === 'GET') {
      // Serve a simple HTML page
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Simple TODO App</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
                .todo-item { padding: 10px; border: 1px solid #ddd; margin: 5px 0; border-radius: 5px; }
                .completed { text-decoration: line-through; background-color: #f0f0f0; }
                input[type="text"] { width: 70%; padding: 8px; margin-right: 10px; }
                button { padding: 8px 15px; cursor: pointer; }
                .delete-btn { background-color: #ff4444; color: white; border: none; border-radius: 3px; }
                .toggle-btn { background-color: #44aa44; color: white; border: none; border-radius: 3px; margin-right: 5px; }
                .add-btn { background-color: #4444aa; color: white; border: none; border-radius: 3px; }
            </style>
        </head>
        <body>
            <h1>Simple TODO App</h1>
            <div>
                <input type="text" id="todoInput" placeholder="Add a new todo...">
                <button class="add-btn" onclick="addTodo()">Add</button>
            </div>
            <div id="todoList"></div>

            <script>
                async function loadTodos() {
                    const response = await fetch('/todos');
                    const todos = await response.json();
                    displayTodos(todos);
                }

                function displayTodos(todos) {
                    const list = document.getElementById('todoList');
                    list.innerHTML = '';
                    todos.forEach(todo => {
                        const div = document.createElement('div');
                        div.className = 'todo-item' + (todo.completed ? ' completed' : '');
                        div.innerHTML = \`
                            <button class="toggle-btn" onclick="toggleTodo('\${todo._id}', \${!todo.completed})">
                                \${todo.completed ? 'Undo' : 'Done'}
                            </button>
                            <span>\${todo.text}</span>
                            <button class="delete-btn" onclick="deleteTodo('\${todo._id}')">Delete</button>
                        \`;
                        list.appendChild(div);
                    });
                }

                async function addTodo() {
                    const input = document.getElementById('todoInput');
                    const text = input.value.trim();
                    if (!text) return;

                    await fetch('/todos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text })
                    });

                    input.value = '';
                    loadTodos();
                }

                async function toggleTodo(id, completed) {
                    await fetch(\`/todos/\${id}\`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ completed })
                    });
                    loadTodos();
                }

                async function deleteTodo(id) {
                    await fetch(\`/todos/\${id}\`, {
                        method: 'DELETE'
                    });
                    loadTodos();
                }

                // Load todos when page loads
                loadTodos();

                // Allow Enter key to add todo
                document.getElementById('todoInput').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        addTodo();
                    }
                });
            </script>
        </body>
        </html>
      `);

    } else {
      sendJSON(res, 404, { error: 'Not found' });
    }

  } catch (error) {
    console.error('Error handling request:', error);
    sendJSON(res, 500, { error: 'Internal server error' });
  }
}

// Start server
async function startServer() {
  await connectToMongo();
  
  const server = http.createServer(handleRequest);
  
  server.listen(PORT, () => {
    console.log(`TODO app running on http://localhost:${PORT}`);
    console.log('API endpoints:');
    console.log('  GET    /todos     - Get all todos');
    console.log('  POST   /todos     - Create new todo');
    console.log('  PUT    /todos/:id - Update todo');
    console.log('  DELETE /todos/:id - Delete todo');
  });
}

startServer();
