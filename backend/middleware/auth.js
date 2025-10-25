const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to authenticate JWT token
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token - user not found' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication' 
    });
  }
};

/**
 * Middleware to check if user is admin
 */
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  next();
};

/**
 * Middleware to check if user is project member or admin
 */
const requireProjectAccess = async (req, res, next) => {
  try {
    const Project = require('../models/Project');
    const projectId = req.params.projectId || req.params.id || req.body.projectId;
    
    if (!projectId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project ID required' 
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }

    // Check if user is admin or project member
    const isMember = project.members.some(member => member.toString() === req.user._id.toString());
    const isAdmin = req.user.role === 'admin';
    const isCreator = project.createdBy.toString() === req.user._id.toString();

    if (!isMember && !isAdmin && !isCreator) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied - not a project member' 
      });
    }

    req.project = project;
    next();
  } catch (error) {
    console.error('Project access middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authorization' 
    });
  }
};

/**
 * Middleware to check if user can modify task
 */
const requireTaskAccess = async (req, res, next) => {
  try {
    const Task = require('../models/Task');
    const taskId = req.params.taskId || req.params.id;
    
    if (!taskId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Task ID required' 
      });
    }

    const task = await Task.findById(taskId).populate('projectId');
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    // Check if user is admin, project member, or task creator
    const isAdmin = req.user.role === 'admin';
    const isProjectMember = task.projectId.members.some(member => member.toString() === req.user._id.toString());
    const isTaskCreator = task.createdBy.toString() === req.user._id.toString();
    const isAssignedTo = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

    if (!isAdmin && !isProjectMember && !isTaskCreator && !isAssignedTo) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied - insufficient permissions' 
      });
    }

    req.task = task;
    next();
  } catch (error) {
    console.error('Task access middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authorization' 
    });
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireProjectAccess,
  requireTaskAccess
};
