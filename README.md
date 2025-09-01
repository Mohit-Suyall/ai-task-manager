# AI Task Manager

A full-stack task management application with AI-powered features built with React, Node.js, Express, and JSON file storage (no database required).

## Features

### Core Features
- ✅ User authentication (JWT-based)
- ✅ CRUD operations for tasks
- ✅ Drag & drop Kanban board
- ✅ List view with filtering
- ✅ Task priorities and due dates
- ✅ Tag system
- ✅ File attachments
- ✅ Responsive design with Tailwind CSS
- ✅ **No Database Required** - Uses JSON file storage

### AI Features
- 🤖 **AI Summarize**: Automatically summarize long task descriptions
- 🧠 **Priority Suggestions**: AI suggests task priority based on content
- 🏷️ **Auto-tagging**: Automatically generate relevant tags for tasks
- 🔍 **Smart Search**: Server-side search across tasks

### UI/UX Features
- 📱 Responsive design
- 🎨 Clean, modern interface with Tailwind CSS
- 🔔 Toast notifications
- 📋 Kanban board with drag & drop
- 📝 List view with filtering
- 🎯 Priority and status indicators

## Tech Stack

### Frontend
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Context API** - State management
- **Fetch API** - HTTP requests

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **JSON Files** - Data storage (no database needed!)
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads

## Project Structure

```
ai-task-manager/
├── backend/
│   ├── data/
│   │   ├── users.json
│   │   └── tasks.json
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   ├── tasks/
│   │   │   └── ui/
│   │   ├── contexts/
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- **No database installation required!**

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```env
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=4000
   OPENAI_API_KEY=your-openai-api-key-here  # Optional
   ```

5. Start the server:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:4000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

### Data Storage

The application automatically creates:
- `backend/data/users.json` - User accounts
- `backend/data/tasks.json` - Task data
- `backend/uploads/` - File attachments

No database setup required!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks (with filtering)
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### AI Features
- `POST /api/ai/summarize` - Summarize task description
- `POST /api/ai/suggest-priority` - Suggest task priority
- `POST /api/ai/auto-tag` - Generate tags for task

### File Upload
- `POST /api/tasks/:id/attachments` - Upload file attachment

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Create Tasks**: Click "New Task" to create tasks with title, description, priority, due date, and tags
3. **Manage Tasks**: Use the Kanban board to drag tasks between columns (To Do, In Progress, Done)
4. **AI Features**: Click the AI buttons on task cards:
   - ✂️ Summarize long descriptions
   - 🧠 Get priority suggestions
   - # Generate relevant tags
5. **Filter & Search**: Use the sidebar to filter by status/priority or search tasks
6. **Switch Views**: Toggle between Kanban board and list view

## AI Integration

The application includes smart AI functionality:

### Current Implementation
- Intelligent text summarization
- Context-aware priority suggestions
- Smart tag generation based on content analysis

### OpenAI Integration (Optional)
To enable enhanced AI features, add your OpenAI API key to the `.env` file.

## Quick Start Commands

```bash
# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
npm install
npm start
```

## Deployment

### Backend Deployment
1. Deploy to platforms like Heroku, Railway, or DigitalOcean
2. Set environment variables in your deployment platform
3. Data files will be created automatically

### Frontend Deployment
1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder to platforms like Netlify, Vercel, or AWS S3

## Advantages of JSON File Storage

- ✅ **No Database Setup** - Works immediately
- ✅ **Easy Backup** - Just copy JSON files
- ✅ **Portable** - Move data anywhere
- ✅ **Version Control** - Track data changes
- ✅ **Simple Debugging** - Human-readable files
- ✅ **Zero Configuration** - No connection strings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- [ ] Real-time collaboration with WebSockets
- [ ] Advanced AI features with OpenAI integration
- [ ] Mobile app with React Native
- [ ] Team workspaces
- [ ] Time tracking
- [ ] Calendar integration
- [ ] Email notifications
- [ ] Advanced analytics and reporting
- [ ] Dark mode theme
- [ ] Offline support with PWA
- [ ] Database migration tools (JSON to MongoDB/PostgreSQL)

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**🎉 Ready to use - No database installation required!**