const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { 
  validateCreateUser, 
  validateLogin, 
  validateUpdateProfile, 
  validateChangePassword 
} = require('../middleware/validation');

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateLogin, authController.login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticateToken, authController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticateToken, validateUpdateProfile, authController.updateProfile);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', authenticateToken, validateChangePassword, authController.changePassword);

/**
 * @route   POST /api/auth/users
 * @desc    Create a new user (Admin only)
 * @access  Private (Admin)
 */
router.post('/users', authenticateToken, requireAdmin, validateCreateUser, authController.createUser);

/**
 * @route   GET /api/auth/users
 * @desc    Get all users (Admin only)
 * @access  Private (Admin)
 */
router.get('/users', authenticateToken, requireAdmin, authController.getAllUsers);

/**
 * @route   DELETE /api/auth/users/:userId
 * @desc    Delete user (Admin only)
 * @access  Private (Admin)
 */
router.delete('/users/:userId', authenticateToken, requireAdmin, authController.deleteUser);

/**
 * @route   PUT /api/auth/users/:userId/role
 * @desc    Update user role (Admin only)
 * @access  Private (Admin)
 */
router.put('/users/:userId/role', authenticateToken, requireAdmin, authController.updateUserRole);

/**
 * @route   POST /api/auth/users/with-credentials
 * @desc    Create user and send credentials via email (Admin only)
 * @access  Private (Admin)
 */
router.post('/users/with-credentials', authenticateToken, requireAdmin, validateCreateUser, adminController.createUserWithCredentials);

/**
 * @route   POST /api/auth/users/add-to-project
 * @desc    Add user to project (Admin only)
 * @access  Private (Admin)
 */
router.post('/users/add-to-project', authenticateToken, requireAdmin, adminController.addUserToProject);

/**
 * @route   GET /api/auth/admin/dashboard
 * @desc    Get admin dashboard statistics
 * @access  Private (Admin)
 */
router.get('/admin/dashboard', authenticateToken, requireAdmin, adminController.getDashboardStats);

module.exports = router;
