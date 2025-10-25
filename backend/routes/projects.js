const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateToken, requireProjectAccess } = require('../middleware/auth');
const { validateCreateProject, validateUpdateProject } = require('../middleware/validation');

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private
 */
router.post('/', authenticateToken, validateCreateProject, projectController.createProject);

/**
 * @route   GET /api/projects
 * @desc    Get all projects for current user
 * @access  Private
 */
router.get('/', authenticateToken, projectController.getProjects);

/**
 * @route   GET /api/projects/:id
 * @desc    Get a single project
 * @access  Private
 */
router.get('/:id', authenticateToken, requireProjectAccess, projectController.getProject);

/**
 * @route   PUT /api/projects/:id
 * @desc    Update a project
 * @access  Private
 */
router.put('/:id', authenticateToken, requireProjectAccess, validateUpdateProject, projectController.updateProject);

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project
 * @access  Private
 */
router.delete('/:id', authenticateToken, requireProjectAccess, projectController.deleteProject);

/**
 * @route   POST /api/projects/:id/members
 * @desc    Add members to project
 * @access  Private
 */
router.post('/:id/members', authenticateToken, requireProjectAccess, projectController.addMembers);

/**
 * @route   DELETE /api/projects/:id/members
 * @desc    Remove members from project
 * @access  Private
 */
router.delete('/:id/members', authenticateToken, requireProjectAccess, projectController.removeMembers);

/**
 * @route   GET /api/projects/:id/tasks
 * @desc    Get tasks for a project
 * @access  Private
 */
router.get('/:id/tasks', authenticateToken, requireProjectAccess, require('../controllers/taskController').getTasks);

/**
 * @route   POST /api/projects/:id/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post('/:id/tasks', authenticateToken, requireProjectAccess, require('../middleware/validation').validateCreateTask, require('../controllers/taskController').createTask);

/**
 * @route   GET /api/projects/:id/tasks/stats
 * @desc    Get task statistics for a project
 * @access  Private
 */
router.get('/:id/tasks/stats', authenticateToken, requireProjectAccess, require('../controllers/taskController').getTaskStats);

module.exports = router;
