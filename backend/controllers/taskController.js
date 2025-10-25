const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

/**
 * Create a new task
 */
const createTask = async (req, res) => {
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

    const { title, description, priority, assignedTo, dueDate } = req.body;
    const projectId = req.params.projectId || req.params.id;
    const createdBy = req.user._id;

    // Verify project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is project member
    const isMember = project.members.some(member => member.toString() === createdBy.toString());
    const isAdmin = req.user.role === 'admin';
    const isCreator = project.createdBy.toString() === createdBy.toString();

    if (!isMember && !isAdmin && !isCreator) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - not a project member'
      });
    }

    // Verify assigned user is project member (if assigned)
    if (assignedTo) {
      const isAssignedUserMember = project.members.some(member => member.toString() === assignedTo);
      if (!isAssignedUserMember) {
        return res.status(400).json({
          success: false,
          message: 'Assigned user must be a project member'
        });
      }
    }

    const task = new Task({
      title,
      description,
      priority,
      assignedTo,
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId,
      createdBy
    });

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');
    await task.populate('projectId', 'title');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating task'
    });
  }
};

/**
 * Get tasks for a project
 */
const getTasks = async (req, res) => {
  try {
    const projectId = req.params.projectId || req.params.id;
    const { status, priority, assignedTo } = req.query;

    // Build filter object
    const filter = { projectId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { tasks }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks'
    });
  }
};

/**
 * Get a single task by ID
 */
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'title')
      .populate({
        path: 'comments',
        populate: {
          path: 'createdBy',
          select: 'name email'
        }
      });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: { task }
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching task'
    });
  }
};

/**
 * Update a task
 */
const updateTask = async (req, res) => {
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

    const { title, description, status, priority, assignedTo, dueDate } = req.body;
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Get project to verify access
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user has permission to update
    const isAdmin = req.user.role === 'admin';
    const isProjectMember = project.members.some(member => member.toString() === req.user._id.toString());
    const isTaskCreator = task.createdBy.toString() === req.user._id.toString();
    const isAssignedTo = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

    if (!isAdmin && !isProjectMember && !isTaskCreator && !isAssignedTo) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - insufficient permissions'
      });
    }

    // Verify assigned user is project member (if being assigned)
    if (assignedTo) {
      const isAssignedUserMember = project.members.some(member => member.toString() === assignedTo);
      if (!isAssignedUserMember) {
        return res.status(400).json({
          success: false,
          message: 'Assigned user must be a project member'
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('projectId', 'title');

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: { task: updatedTask }
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating task'
    });
  }
};

/**
 * Delete a task
 */
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Get project to verify access
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user has permission to delete
    const isAdmin = req.user.role === 'admin';
    const isProjectCreator = project.createdBy.toString() === req.user._id.toString();
    const isTaskCreator = task.createdBy.toString() === req.user._id.toString();

    if (!isAdmin && !isProjectCreator && !isTaskCreator) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - insufficient permissions'
      });
    }

    await Task.findByIdAndDelete(taskId);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting task'
    });
  }
};

/**
 * Get tasks assigned to current user
 */
const getMyTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    const { status, priority } = req.query;

    // Build filter object
    let filter = {};
    
    // If user is admin, get all tasks. Otherwise, get only assigned tasks
    if (userRole !== 'admin') {
      filter.assignedTo = userId;
    }
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'title')
      .sort({ dueDate: 1, createdAt: -1 });

    res.json({
      success: true,
      data: { tasks }
    });
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks'
    });
  }
};

/**
 * Get task statistics for a project
 */
const getTaskStats = async (req, res) => {
  try {
    const projectId = req.params.projectId || req.params.id;

    const stats = await Task.aggregate([
      { $match: { projectId: require('mongoose').Types.ObjectId(projectId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Task.aggregate([
      { $match: { projectId: require('mongoose').Types.ObjectId(projectId) } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        statusStats: stats,
        priorityStats: priorityStats
      }
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching task statistics'
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getMyTasks,
  getTaskStats
};
