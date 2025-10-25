const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateToken, requireProjectAccess, requireTaskAccess } = require('../middleware/auth');
const { validateCreateTask, validateUpdateTask } = require('../middleware/validation');

/**
 * @route   POST /api/projects/:projectId/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post('/:projectId/tasks', authenticateToken, requireProjectAccess, validateCreateTask, taskController.createTask);

/**
 * @route   GET /api/projects/:projectId/tasks
 * @desc    Get tasks for a project
 * @access  Private
 */
router.get('/:projectId/tasks', authenticateToken, requireProjectAccess, taskController.getTasks);

/**
 * @route   GET /api/tasks/my-tasks
 * @desc    Get tasks assigned to current user
 * @access  Private
 */
router.get('/my-tasks', authenticateToken, taskController.getMyTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task
 * @access  Private
 */
router.get('/:id', authenticateToken, requireTaskAccess, taskController.getTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
router.put('/:id', authenticateToken, requireTaskAccess, validateUpdateTask, taskController.updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete('/:id', authenticateToken, requireTaskAccess, taskController.deleteTask);

/**
 * @route   GET /api/projects/:projectId/tasks/stats
 * @desc    Get task statistics for a project
 * @access  Private
 */
router.get('/:projectId/tasks/stats', authenticateToken, requireProjectAccess, taskController.getTaskStats);

module.exports = router;
