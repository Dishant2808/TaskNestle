# TaskNestle Backend API

A comprehensive Node.js + Express + MongoDB backend for a task management application with JWT authentication, email invitations, and role-based access control.

## Features

- **User Authentication**: JWT-based auth with registration, login, and profile management
- **Project Management**: CRUD operations for projects with member management
- **Task Management**: Full task lifecycle with status tracking and assignments
- **Comments System**: Add, update, and delete comments on tasks
- **Email Invitations**: Send project invitations via email with token-based registration
- **Role-based Access**: Admin and member roles with appropriate permissions
- **Security**: Helmet, CORS, rate limiting, and input validation
- **MongoDB Integration**: Mongoose ODM with proper indexing and relationships

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Nodemailer** - Email service
- **Bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get user's projects
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add members
- `DELETE /api/projects/:id/members` - Remove members

### Tasks
- `POST /api/projects/:projectId/tasks` - Create task
- `GET /api/projects/:projectId/tasks` - Get project tasks
- `GET /api/tasks/my-tasks` - Get user's assigned tasks
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/projects/:projectId/tasks/stats` - Get task statistics

### Comments
- `POST /api/tasks/:taskId/comments` - Add comment
- `GET /api/tasks/:taskId/comments` - Get task comments
- `PUT /api/comments/:commentId` - Update comment
- `DELETE /api/comments/:commentId` - Delete comment

### Invitations
- `POST /api/projects/:projectId/invite` - Invite user to project
- `POST /api/invitations/accept` - Accept invitation
- `GET /api/invitations/verify/:token` - Verify invitation token
- `GET /api/projects/:projectId/members` - Get project members

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Gmail account for email service

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
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
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/task-management
   JWT_SECRET=your-super-secret-jwt-key-here
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   - Local: `mongod`
   - Or use MongoDB Atlas (cloud)

5. **Run the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment | No (default: development) |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `EMAIL_USER` | Gmail address for sending emails | Yes |
| `EMAIL_PASS` | Gmail app password | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |

### Gmail Setup for Email Service

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASS`

### Database Schema

#### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'member']),
  isEmailVerified: Boolean,
  emailVerificationToken: String
}
```

#### Project Model
```javascript
{
  title: String (required),
  description: String,
  description: String,
  members: [ObjectId] (ref: User),
  createdBy: ObjectId (ref: User),
  status: String (enum: ['active', 'archived', 'completed'])
}
```

#### Task Model
```javascript
{
  title: String (required),
  description: String,
  status: String (enum: ['todo', 'in-progress', 'done']),
  priority: String (enum: ['low', 'medium', 'high']),
  assignedTo: ObjectId (ref: User),
  dueDate: Date,
  projectId: ObjectId (ref: Project),
  createdBy: ObjectId (ref: User),
  comments: [ObjectId] (ref: Comment)
}
```

#### Comment Model
```javascript
{
  text: String (required),
  createdBy: ObjectId (ref: User),
  taskId: ObjectId (ref: Task)
}
```

## Deployment

### For Render.com

1. **Create render.yaml**:
   ```yaml
   services:
     - type: web
       name: task-management-backend
       env: node
       plan: free
       buildCommand: npm install
       startCommand: npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: MONGO_URI
           fromDatabase:
             name: task-management-db
             property: connectionString
   ```

2. **Set environment variables in Render dashboard**
3. **Connect your GitHub repository**
4. **Deploy**

### For Heroku

1. **Install Heroku CLI**
2. **Login and create app**:
   ```bash
   heroku login
   heroku create your-app-name
   ```

3. **Add MongoDB addon**:
   ```bash
   heroku addons:create mongolab:sandbox
   ```

4. **Set environment variables**:
   ```bash
   heroku config:set JWT_SECRET=your-secret
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASS=your-app-password
   heroku config:set FRONTEND_URL=https://your-frontend-url.com
   ```

5. **Deploy**:
   ```bash
   git push heroku main
   ```

## API Testing

Use tools like Postman or curl to test endpoints:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"Password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password123"}'
```

## Health Check

Visit `http://localhost:5000/health` to verify the server is running.

## Error Handling

The API returns consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors (optional)
}
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation and sanitization
- SQL injection protection (MongoDB)
- XSS protection
