const { validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Task = require('../models/Task');

/**
 * Add a comment to a task
 */
const addComment = async (req, res) => {
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

    const { text } = req.body;
    const { taskId } = req.params;
    const createdBy = req.user._id;

    // Verify task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Create comment
    const comment = new Comment({
      text,
      createdBy,
      taskId
    });

    await comment.save();
    await comment.populate('createdBy', 'name email');

    // Add comment to task
    task.comments.push(comment._id);
    await task.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding comment'
    });
  }
};

/**
 * Get comments for a task
 */
const getComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const comments = await Comment.find({ taskId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: { comments }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching comments'
    });
  }
};

/**
 * Update a comment
 */
const updateComment = async (req, res) => {
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

    const { text } = req.body;
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is the comment creator
    if (comment.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - can only edit your own comments'
      });
    }

    comment.text = text;
    await comment.save();
    await comment.populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: { comment }
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating comment'
    });
  }
};

/**
 * Delete a comment
 */
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is the comment creator or admin
    const isCreator = comment.createdBy.toString() === userId.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - can only delete your own comments'
      });
    }

    // Remove comment from task
    const task = await Task.findById(comment.taskId);
    if (task) {
      task.comments = task.comments.filter(commentRef => commentRef.toString() !== commentId);
      await task.save();
    }

    await Comment.findByIdAndDelete(commentId);

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting comment'
    });
  }
};

module.exports = {
  addComment,
  getComments,
  updateComment,
  deleteComment
};
