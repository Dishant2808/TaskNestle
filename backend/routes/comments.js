const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticateToken, requireTaskAccess } = require('../middleware/auth');
const { validateComment } = require('../middleware/validation');

/**
 * @route   POST /api/tasks/:taskId/comments
 * @desc    Add a comment to a task
 * @access  Private
 */
router.post('/:taskId/comments', authenticateToken, requireTaskAccess, validateComment, commentController.addComment);

/**
 * @route   GET /api/tasks/:taskId/comments
 * @desc    Get comments for a task
 * @access  Private
 */
router.get('/:taskId/comments', authenticateToken, requireTaskAccess, commentController.getComments);

/**
 * @route   PUT /api/comments/:commentId
 * @desc    Update a comment
 * @access  Private
 */
router.put('/:commentId', authenticateToken, validateComment, commentController.updateComment);

/**
 * @route   DELETE /api/comments/:commentId
 * @desc    Delete a comment
 * @access  Private
 */
router.delete('/:commentId', authenticateToken, commentController.deleteComment);

module.exports = router;
