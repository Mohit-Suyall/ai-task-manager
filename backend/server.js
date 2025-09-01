const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create data and uploads directories if they don't exist
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// File paths for JSON storage
const usersFile = path.join(dataDir, 'users.json');
const tasksFile = path.join(dataDir, 'tasks.json');

// Initialize JSON files if they don't exist
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
}
if (!fs.existsSync(tasksFile)) {
  fs.writeFileSync(tasksFile, JSON.stringify([], null, 2));
}

// Helper functions for JSON file operations
const readUsers = () => {
  try {
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

const writeUsers = (users) => {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users file:', error);
  }
};

const readTasks = () => {
  try {
    const data = fs.readFileSync(tasksFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tasks file:', error);
    return [];
  }
};

const writeTasks = (tasks) => {
  try {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error writing tasks file:', error);
  }
};

// Generate unique IDs
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Basic routes to fix "Cannot GET /" error
app.get('/', (req, res) => {
  res.json({
    message: '🚀 AI Task Manager API Server',
    status: 'Running Successfully',
    port: 8000,
    endpoints: {
      auth: '/api/auth/login, /api/auth/register',
      tasks: '/api/tasks (GET, POST, PUT, DELETE)',
      ai: '/api/ai/summarize, /api/ai/suggest-priority, /api/ai/auto-tag'
    },
    note: 'Frontend should run on http://localhost:3000'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const users = readUsers();
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: generateId(),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    users.push(user);
    writeUsers(users);

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const users = readUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Task routes
app.get('/api/tasks', authenticateToken, (req, res) => {
  try {
    const { status, priority, search } = req.query;
    let tasks = readTasks();
    
    // Filter by user
    tasks = tasks.filter(task => task.userId === req.user.userId);

    // Filter by status
    if (status && status !== 'all') {
      tasks = tasks.filter(task => task.status === status);
    }

    // Filter by priority
    if (priority && priority !== 'all') {
      tasks = tasks.filter(task => task.priority === priority);
    }

    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      tasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower)) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    // Sort by creation date (newest first)
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/tasks', authenticateToken, (req, res) => {
  try {
    const { title, description, priority, dueDate, tags } = req.body;
    
    const task = {
      _id: generateId(),
      title,
      description,
      priority: priority || 'medium',
      status: 'todo',
      dueDate,
      tags: tags || [],
      attachments: [],
      userId: req.user.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const tasks = readTasks();
    tasks.push(task);
    writeTasks(tasks);

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/tasks/:id', authenticateToken, (req, res) => {
  try {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(task => 
      task._id === req.params.id && task.userId === req.user.userId
    );
    
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task with new data
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    writeTasks(tasks);
    res.json(tasks[taskIndex]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
  try {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(task => 
      task._id === req.params.id && task.userId === req.user.userId
    );
    
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    writeTasks(tasks);
    
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// AI endpoints
app.post('/api/ai/summarize', authenticateToken, (req, res) => {
  try {
    const { taskId } = req.body;
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(task => 
      task._id === taskId && task.userId === req.user.userId
    );
    
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const task = tasks[taskIndex];
    const description = task.description || '';
    const summary = description.slice(0, 140) + (description.length > 140 ? '...' : '');

    tasks[taskIndex].summary = summary;
    tasks[taskIndex].updatedAt = new Date().toISOString();
    writeTasks(tasks);

    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/ai/suggest-priority', authenticateToken, (req, res) => {
  try {
    const { taskId } = req.body;
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(task => 
      task._id === taskId && task.userId === req.user.userId
    );
    
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const task = tasks[taskIndex];
    const description = (task.description || '').toLowerCase();
    let suggestedPriority = 'medium';
    
    if (description.includes('urgent') || description.includes('asap') || description.includes('critical')) {
      suggestedPriority = 'high';
    } else if (description.includes('later') || description.includes('someday') || description.includes('nice to have')) {
      suggestedPriority = 'low';
    }

    tasks[taskIndex].priority = suggestedPriority;
    tasks[taskIndex].updatedAt = new Date().toISOString();
    writeTasks(tasks);

    res.json({ priority: suggestedPriority });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/ai/auto-tag', authenticateToken, (req, res) => {
  try {
    const { taskId } = req.body;
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(task => 
      task._id === taskId && task.userId === req.user.userId
    );
    
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const task = tasks[taskIndex];
    const text = `${task.title} ${task.description}`.toLowerCase();
    const suggestedTags = [];

    const tagKeywords = {
      'work': ['work', 'office', 'meeting', 'project', 'deadline'],
      'personal': ['personal', 'home', 'family', 'self'],
      'urgent': ['urgent', 'asap', 'critical', 'important'],
      'development': ['code', 'programming', 'development', 'bug', 'feature'],
      'design': ['design', 'ui', 'ux', 'mockup', 'wireframe'],
      'research': ['research', 'study', 'analyze', 'investigate']
    };

    Object.entries(tagKeywords).forEach(([tag, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        suggestedTags.push(tag);
      }
    });

    const existingTags = task.tags || [];
    tasks[taskIndex].tags = [...new Set([...existingTags, ...suggestedTags])];
    tasks[taskIndex].updatedAt = new Date().toISOString();
    writeTasks(tasks);

    res.json({ tags: tasks[taskIndex].tags });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// File upload endpoint
app.post('/api/tasks/:id/attachments', authenticateToken, upload.single('file'), (req, res) => {
  try {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(task => 
      task._id === req.params.id && task.userId === req.user.userId
    );
    
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!tasks[taskIndex].attachments) {
      tasks[taskIndex].attachments = [];
    }
    
    tasks[taskIndex].attachments.push(req.file.filename);
    tasks[taskIndex].updatedAt = new Date().toISOString();
    writeTasks(tasks);

    res.json({ filename: req.file.filename, task: tasks[taskIndex] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server on port 8000
const PORT = 8000;

app.listen(PORT, () => {
  console.log('🚀 AI Task Manager Server running on port', PORT);
  console.log('📱 Frontend should connect to: http://localhost:' + PORT);
  console.log('🌐 API available at: http://localhost:' + PORT);
  console.log('💾 Using JSON file storage (no database required)');
  console.log('📁 Data stored in:', dataDir);
  console.log('📎 Uploads stored in:', uploadsDir);
  console.log('✅ Server ready - no MongoDB needed!');
  console.log('');
  console.log('🔗 Test the API:');
  console.log('   GET  http://localhost:' + PORT + '/');
  console.log('   GET  http://localhost:' + PORT + '/health');
});