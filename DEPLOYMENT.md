# Deployment Guide for TaskNestle

## Render.com Deployment

### Backend Deployment

1. **Connect your GitHub repository to Render.com**

2. **Create a new Web Service:**
   - Choose "Build and deploy from a Git repository"
   - Select your repository
   - Choose the branch (usually `main` or `master`)

3. **Configure the service:**
   - **Name**: `task-management-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

4. **Set Environment Variables:**
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/task-management
   JWT_SECRET=your-super-secret-jwt-key-here
   ADMIN_EMAIL=admin@tasknestle.com
   ADMIN_PASSWORD=Admin@123
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=https://your-frontend-url.onrender.com
   ```

5. **Create MongoDB Database:**
   - In Render dashboard, go to "Databases"
   - Create a new MongoDB database
   - Copy the connection string to `MONGO_URI`

6. **Deploy and Test:**
   - The service will automatically deploy
   - Check the logs for any errors
   - Test the health endpoint: `https://your-backend-url.onrender.com/health`

### Frontend Deployment

1. **Create a new Static Site:**
   - Choose "Build and deploy from a Git repository"
   - Select your repository

2. **Configure the service:**
   - **Name**: `task-management-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Root Directory**: `frontend`

3. **Set Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   REACT_APP_ENV=production
   ```

### Post-Deployment Setup

1. **Create Admin User:**
   After backend deployment, you need to create the admin user:
   ```bash
   # SSH into your Render service or use Render's shell
   cd backend
   npm run create-admin
   ```

2. **Test the Application:**
   - Backend health: `https://your-backend-url.onrender.com/health`
   - Frontend: `https://your-frontend-url.onrender.com`
   - Login with admin credentials

### Troubleshooting

#### Common Issues:

1. **Build Command Error:**
   - ✅ Fixed: Added `"build": "echo 'No build step required for this Node.js backend'"` to package.json

2. **MongoDB Connection Issues:**
   - Ensure MongoDB URI is correct
   - Check if MongoDB Atlas allows connections from Render's IPs
   - Verify database name and credentials

3. **CORS Issues:**
   - Update `FRONTEND_URL` environment variable with your actual frontend URL
   - Check CORS configuration in `server.js`

4. **Email Service Issues:**
   - Use Gmail App Password (not regular password)
   - Enable 2-factor authentication on Gmail
   - Update `EMAIL_USER` and `EMAIL_PASS` with correct credentials

### Environment Variables Reference

#### Backend (.env):
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/task-management
JWT_SECRET=your-super-secret-jwt-key-here
ADMIN_EMAIL=admin@tasknestle.com
ADMIN_PASSWORD=Admin@123
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=https://your-frontend-url.onrender.com
```

#### Frontend (.env):
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
REACT_APP_ENV=production
```

### Security Notes

1. **Change default admin password** after first login
2. **Use strong JWT_SECRET** (generate with: `openssl rand -base64 32`)
3. **Use MongoDB Atlas** for production (not local MongoDB)
4. **Enable HTTPS** (Render provides this automatically)
5. **Regular backups** of your MongoDB database
