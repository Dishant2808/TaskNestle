# TaskNestle

A full-stack task management application similar to Trello or Asana, built with React + Tailwind CSS frontend and Node.js + Express + MongoDB backend.

## 🚀 Features

### Backend Features
- **User Authentication**: JWT-based auth with registration and login
- **Project Management**: CRUD operations with member management
- **Task Management**: Full task lifecycle with status tracking
- **Comments System**: Add and manage task comments
- **Email Invitations**: Send project invitations via email
- **Role-based Access**: Admin and member roles
- **Security**: Helmet, CORS, rate limiting, input validation

### Frontend Features
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Kanban Board**: Drag-and-drop task management
- **Real-time Updates**: Live task status changes
- **User Management**: Invite and manage team members
- **Task Comments**: Collaborative task discussions
- **Mobile Responsive**: Works on all device sizes

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Bcryptjs** - Password hashing

### Frontend
- **React 18** - Frontend framework
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **React DnD** - Drag and drop
- **Axios** - HTTP client
- **React Toastify** - Notifications

## 📁 Project Structure

```
task-management/
├── backend/                 # Node.js + Express API
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth and validation middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── services/          # Email service
│   ├── server.js          # Main server file
│   └── package.json
├── frontend/              # React application
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── contexts/     # React contexts
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── App.js        # Main app
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Gmail account for email service

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
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
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   ```

5. **Run the server**
   ```bash
   npm run dev
   ```

   Backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   ```
   
   Update `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_ENV=development
   ```

4. **Start development server**
   ```bash
   npm start
   ```

   Frontend will be available at `http://localhost:3000`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get user projects
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add members
- `DELETE /api/projects/:id/members` - Remove members

### Tasks
- `POST /api/projects/:projectId/tasks` - Create task
- `GET /api/projects/:projectId/tasks` - Get project tasks
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/my-tasks` - Get user's tasks

### Comments
- `POST /api/tasks/:taskId/comments` - Add comment
- `GET /api/tasks/:taskId/comments` - Get task comments
- `PUT /api/comments/:commentId` - Update comment
- `DELETE /api/comments/:commentId` - Delete comment

### Invitations
- `POST /api/projects/:projectId/invite` - Invite user
- `POST /api/invitations/accept` - Accept invitation
- `GET /api/invitations/verify/:token` - Verify invitation

## 🔧 Configuration

### Gmail Setup for Email Service

1. **Enable 2-factor authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASS`

### Database Schema

#### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/member),
  isEmailVerified: Boolean
}
```

#### Project Model
```javascript
{
  title: String,
  description: String,
  members: [ObjectId],
  createdBy: ObjectId,
  status: String (active/archived/completed)
}
```

#### Task Model
```javascript
{
  title: String,
  description: String,
  status: String (todo/in-progress/done),
  priority: String (low/medium/high),
  assignedTo: ObjectId,
  dueDate: Date,
  projectId: ObjectId,
  createdBy: ObjectId,
  comments: [ObjectId]
}
```

## 🚀 Deployment

### Backend Deployment (Render.com)

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
3. **Connect GitHub repository**
4. **Deploy**

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Set environment variables**:
   - `REACT_APP_API_URL`: Your backend API URL

### Alternative: Heroku

#### Backend
```bash
# Install Heroku CLI
heroku login
heroku create your-app-name

# Add MongoDB
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASS=your-app-password
heroku config:set FRONTEND_URL=https://your-frontend-url.com

# Deploy
git push heroku main
```

#### Frontend
```bash
# Build and deploy to Netlify or Vercel
npm run build
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📱 Usage

1. **Register/Login**: Create an account or sign in
2. **Create Project**: Start by creating a new project
3. **Invite Members**: Send email invitations to team members
4. **Add Tasks**: Create tasks with priorities and due dates
5. **Manage Tasks**: Use the Kanban board to organize tasks
6. **Collaborate**: Add comments and assign tasks to team members

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevent abuse with request limits
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Server-side validation for all inputs
- **Helmet**: Security headers
- **XSS Protection**: React's built-in protection

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check `MONGO_URI` in `.env`
   - Ensure MongoDB is running
   - Verify connection string format

2. **Email Not Sending**
   - Check Gmail credentials
   - Verify app password is correct
   - Check 2FA is enabled

3. **CORS Errors**
   - Update `FRONTEND_URL` in backend `.env`
   - Check frontend `REACT_APP_API_URL`

4. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility
   - Verify all environment variables

### Debug Mode

Enable debug logging:
```env
NODE_ENV=development
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation

## 🎯 Roadmap

- [ ] Real-time updates with Socket.io
- [ ] File attachments for tasks
- [ ] Advanced reporting and analytics
- [ ] Mobile app (React Native)
- [ ] Dark mode theme
- [ ] Advanced search and filtering
- [ ] Task templates
- [ ] Time tracking
- [ ] Integration with external tools

---

**Happy Task Managing! 🎉**
