const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');

/**
 * Create a new project
 */
const createProject = async (req, res) => {
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

    const { title, description, members = [] } = req.body;
    const createdBy = req.user._id;

    // Add creator to members if not already included
    const allMembers = [...new Set([...members, createdBy.toString()])];

    // Verify all member IDs exist
    const existingUsers = await User.find({ _id: { $in: allMembers } });
    if (existingUsers.length !== allMembers.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more member IDs are invalid'
      });
    }

    const project = new Project({
      title,
      description,
      members: allMembers,
      createdBy
    });

    await project.save();
    await project.populate('members', 'name email');
    await project.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project }
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating project'
    });
  }
};

/**
 * Get all projects for the current user
 */
const getProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    const { status = 'active' } = req.query;

    let query = { status };
    
    // If user is admin, show all projects. Otherwise, show only projects where user is a member
    if (userRole !== 'admin') {
      query.members = userId;
    }

    const projects = await Project.find(query)
    .populate('members', 'name email')
    .populate('createdBy', 'name email')
    .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: { projects }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching projects'
    });
  }
};

/**
 * Get a single project by ID
 */
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
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
      data: { project }
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching project'
    });
  }
};

/**
 * Update a project
 */
const updateProject = async (req, res) => {
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

    const { title, description, members, status } = req.body;
    const projectId = req.params.id;
    const userId = req.user._id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is admin, creator, or member
    const isAdmin = req.user.role === 'admin';
    const isCreator = project.createdBy.toString() === userId.toString();
    const isMember = project.members.some(member => member.toString() === userId.toString());

    if (!isAdmin && !isCreator && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - not a project member'
      });
    }

    // Prepare update data
    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status) updateData.status = status;
    if (members) {
      // Verify all member IDs exist
      const existingUsers = await User.find({ _id: { $in: members } });
      if (existingUsers.length !== members.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more member IDs are invalid'
        });
      }
      updateData.members = members;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('members', 'name email')
    .populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: { project: updatedProject }
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating project'
    });
  }
};

/**
 * Delete a project
 */
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user._id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is admin or creator
    const isAdmin = req.user.role === 'admin';
    const isCreator = project.createdBy.toString() === userId.toString();

    if (!isAdmin && !isCreator) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - only admin or project creator can delete'
      });
    }

    await Project.findByIdAndDelete(projectId);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting project'
    });
  }
};

/**
 * Add members to a project
 */
const addMembers = async (req, res) => {
  try {
    const { memberIds } = req.body;
    const projectId = req.params.id;

    if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Member IDs array is required'
      });
    }

    // Verify all member IDs exist
    const existingUsers = await User.find({ _id: { $in: memberIds } });
    if (existingUsers.length !== memberIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more member IDs are invalid'
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Add new members (avoid duplicates)
    const currentMembers = project.members.map(member => member.toString());
    const newMembers = memberIds.filter(id => !currentMembers.includes(id));
    
    if (newMembers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'All provided members are already in the project'
      });
    }

    project.members.push(...newMembers);
    await project.save();

    await project.populate('members', 'name email');

    res.json({
      success: true,
      message: 'Members added successfully',
      data: { project }
    });
  } catch (error) {
    console.error('Add members error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding members'
    });
  }
};

/**
 * Remove members from a project
 */
const removeMembers = async (req, res) => {
  try {
    const { memberIds } = req.body;
    const projectId = req.params.id;

    if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Member IDs array is required'
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if trying to remove creator
    const isRemovingCreator = memberIds.some(id => id === project.createdBy.toString());
    if (isRemovingCreator) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove project creator'
      });
    }

    // Remove members
    project.members = project.members.filter(member => !memberIds.includes(member.toString()));
    await project.save();

    await project.populate('members', 'name email');

    res.json({
      success: true,
      message: 'Members removed successfully',
      data: { project }
    });
  } catch (error) {
    console.error('Remove members error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing members'
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMembers,
  removeMembers
};
