# TaskNestle Frontend

A modern React frontend for TaskNestle with Tailwind CSS, drag-and-drop functionality, and real-time updates.

## Features

- **Authentication**: Login/Register with JWT tokens
- **Dashboard**: Project overview with statistics
- **Kanban Board**: Drag-and-drop task management
- **Project Management**: Create, edit, and manage projects
- **Task Management**: Full CRUD operations with comments
- **User Invitations**: Email-based project invitations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live task status updates
- **Modern UI**: Clean, intuitive interface

## Tech Stack

- **React 18** - Frontend framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React DnD** - Drag and drop functionality
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **Lucide React** - Icon library
- **Date-fns** - Date manipulation

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CreateProjectModal.js
│   ├── CreateTaskModal.js
│   ├── InviteModal.js
│   ├── KanbanBoard.js
│   ├── Layout.js
│   ├── ProtectedRoute.js
│   └── TaskCard.js
├── contexts/           # React contexts
│   └── AuthContext.js
├── pages/              # Page components
│   ├── Dashboard.js
│   ├── Invite.js
│   ├── Login.js
│   ├── Project.js
│   └── Register.js
├── services/           # API services
│   └── api.js
├── App.js              # Main app component
├── index.js            # Entry point
└── index.css           # Global styles
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API running on port 5000

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_ENV=development
   ```

4. **Start development server**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `REACT_APP_ENV` | Environment | `development` |

## Key Components

### Authentication
- **Login/Register**: JWT-based authentication
- **Protected Routes**: Automatic redirect for unauthenticated users
- **Auth Context**: Global authentication state management

### Dashboard
- **Project Overview**: List all user projects
- **Statistics**: Project and task counts
- **Quick Actions**: Create project, invite users

### Kanban Board
- **Drag & Drop**: Move tasks between columns
- **Three Columns**: To Do, In Progress, Done
- **Task Cards**: Priority indicators, due dates, assignees

### Project Management
- **Create Projects**: Title, description, members
- **Edit Projects**: Update details and members
- **Invite Users**: Email-based invitations
- **Member Management**: Add/remove team members

### Task Management
- **Create Tasks**: Title, description, priority, assignee, due date
- **Edit Tasks**: Update all task properties
- **Comments**: Add and view task comments
- **Status Updates**: Drag to change status

## API Integration

The frontend communicates with the backend through a centralized API service:

```javascript
// Example API usage
import { projectAPI, taskAPI } from './services/api';

// Get projects
const projects = await projectAPI.getProjects();

// Create task
const task = await taskAPI.createTask({
  title: 'New Task',
  projectId: 'project-id',
  priority: 'high'
});
```

## Styling

The app uses Tailwind CSS with custom components:

```css
/* Custom button styles */
.btn {
  @apply inline-flex items-center justify-center rounded-md text-sm font-medium;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700;
}
```

## State Management

- **Auth Context**: User authentication state
- **Local State**: Component-level state with hooks
- **API State**: Server state managed through API calls

## Routing

```javascript
// Protected routes
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Layout><Dashboard /></Layout>
  </ProtectedRoute>
} />

// Public routes
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
```

## Deployment

### For Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard**
   - `REACT_APP_API_URL`: Your backend API URL

### For Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variables

### For GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/task-management",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Code Structure

- **Components**: Reusable UI components
- **Pages**: Route-level components
- **Services**: API integration layer
- **Contexts**: Global state management
- **Utils**: Helper functions and utilities

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Optimized Build**: Production optimizations
- **Caching**: API response caching

## Security

- **JWT Tokens**: Secure authentication
- **Protected Routes**: Route-level security
- **Input Validation**: Client-side validation
- **XSS Protection**: React's built-in protection

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check `REACT_APP_API_URL` in `.env`
   - Ensure backend is running
   - Check CORS configuration

2. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check for TypeScript errors
   - Verify all imports are correct

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS
   - Verify class names are correct

### Debug Mode

Enable debug mode by setting:
```env
REACT_APP_ENV=development
```

This will show additional console logs and error details.
