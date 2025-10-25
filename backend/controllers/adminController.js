const { validationResult } = require('express-validator');
const User = require('../models/User');
const Project = require('../models/Project');
const { sendLoginCredentials } = require('../services/emailService');
const crypto = require('crypto');

/**
 * Create user and send credentials via email
 */
const createUserWithCredentials = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, role = 'member', projectId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Generate a random password
    const password = crypto.randomBytes(8).toString('base64').replace(/[^a-zA-Z0-9]/g, '') + '123';
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
      isEmailVerified: true
    });

    await user.save();

    // Get project info if projectId is provided
    let projectTitle = null;
    if (projectId) {
      const project = await Project.findById(projectId);
      if (project) {
        projectTitle = project.title;
        // Add user to project
        project.members.push(user._id);
        await project.save();
      }
    }

    // Send credentials via email
    try {
      await sendLoginCredentials(email, name, password, projectTitle);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail user creation if email fails
    }

    res.status(201).json({
      success: true,
      message: 'User created and credentials sent successfully',
      data: {
        user: user.toJSON(),
        credentials: {
          email,
          password
        }
      }
    });
  } catch (error) {
    console.error('Create user with credentials error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating user'
    });
  }
};

/**
 * Add user to project and send notification
 */
const addUserToProject = async (req, res) => {
  try {
    const { userId, projectId } = req.body;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is already a member
    const isAlreadyMember = project.members.some(member => member.toString() === userId);
    if (isAlreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a project member'
      });
    }

    // Add user to project
    project.members.push(userId);
    await project.save();

    // Send notification email
    try {
      await sendLoginCredentials(user.email, user.name, 'Your existing password', project.title);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the operation if email fails
    }

    res.json({
      success: true,
      message: 'User added to project successfully',
      data: {
        user: user.toJSON(),
        project: {
          id: project._id,
          title: project.title
        }
      }
    });
  } catch (error) {
    console.error('Add user to project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding user to project'
    });
  }
};

/**
 * Get dashboard statistics for admin
 */
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'active' });
    const totalTasks = await require('../models/Task').countDocuments();

    // Get recent users
    const recentUsers = await User.find({})
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent projects
    const recentProjects = await Project.find({})
      .populate('createdBy', 'name email')
      .select('title status createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalProjects,
          activeProjects,
          totalTasks
        },
        recentUsers,
        recentProjects
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard statistics'
    });
  }
};

module.exports = {
  createUserWithCredentials,
  addUserToProject,
  getDashboardStats
};
