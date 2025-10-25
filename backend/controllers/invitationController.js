const { validationResult } = require('express-validator');
const User = require('../models/User');
const Project = require('../models/Project');
const { 
  sendProjectInvitation, 
  sendWelcomeEmail, 
  generateInvitationToken, 
  verifyInvitationToken 
} = require('../services/emailService');

/**
 * Invite user to project via email
 */
const inviteUser = async (req, res) => {
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

    const { email } = req.body;
    const { projectId } = req.params;
    const inviterId = req.user._id;

    // Verify project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is project member or admin
    const isMember = project.members.some(member => member.toString() === inviterId.toString());
    const isAdmin = req.user.role === 'admin';
    const isCreator = project.createdBy.toString() === inviterId.toString();

    if (!isMember && !isAdmin && !isCreator) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - not a project member'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Check if user is already a project member
      const isAlreadyMember = project.members.some(member => member.toString() === existingUser._id.toString());
      if (isAlreadyMember) {
        return res.status(400).json({
          success: false,
          message: 'User is already a project member'
        });
      }

      // Add existing user to project
      project.members.push(existingUser._id);
      await project.save();

      return res.json({
        success: true,
        message: 'User added to project successfully',
        data: { user: existingUser.toJSON() }
      });
    }

    // Generate invitation token
    const invitationToken = generateInvitationToken(email, projectId);

    // Send invitation email
    await sendProjectInvitation(email, project.title, req.user.name, invitationToken);

    res.json({
      success: true,
      message: 'Invitation sent successfully',
      data: { email, invitationToken }
    });
  } catch (error) {
    console.error('Invite user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending invitation'
    });
  }
};

/**
 * Accept invitation and register user
 */
const acceptInvitation = async (req, res) => {
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

    const { token, name, password } = req.body;

    // Verify invitation token
    const decoded = verifyInvitationToken(token);
    const { email, projectId } = decoded;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Verify project still exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or has been deleted'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      isEmailVerified: true
    });

    await user.save();

    // Add user to project
    project.members.push(user._id);
    await project.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(email, name);
    } catch (emailError) {
      console.error('Welcome email error:', emailError);
      // Don't fail the registration if email fails
    }

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Account created and invitation accepted successfully',
      data: {
        user: user.toJSON(),
        token: authToken,
        project: {
          id: project._id,
          title: project.title
        }
      }
    });
  } catch (error) {
    console.error('Accept invitation error:', error);
    if (error.message.includes('Invalid') || error.message.includes('expired')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while accepting invitation'
    });
  }
};

/**
 * Verify invitation token
 */
const verifyInvitation = async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = verifyInvitationToken(token);
    const { email, projectId } = decoded;

    // Get project details
    const project = await Project.findById(projectId).select('title description');
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Invitation token is valid',
      data: {
        email,
        project: {
          id: project._id,
          title: project.title,
          description: project.description
        }
      }
    });
  } catch (error) {
    console.error('Verify invitation error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get project members
 */
const getProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: {
        members: project.members,
        createdBy: project.createdBy
      }
    });
  } catch (error) {
    console.error('Get project members error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching project members'
    });
  }
};

module.exports = {
  inviteUser,
  acceptInvitation,
  verifyInvitation,
  getProjectMembers
};
