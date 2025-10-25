const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitationController');
const { authenticateToken, requireProjectAccess } = require('../middleware/auth');
const { validateInvitation, validateAcceptInvitation } = require('../middleware/validation');

/**
 * @route   POST /api/projects/:projectId/invite
 * @desc    Invite user to project via email
 * @access  Private
 */
router.post('/:projectId/invite', authenticateToken, requireProjectAccess, validateInvitation, invitationController.inviteUser);

/**
 * @route   POST /api/invitations/accept
 * @desc    Accept invitation and register user
 * @access  Public
 */
router.post('/accept', validateAcceptInvitation, invitationController.acceptInvitation);

/**
 * @route   GET /api/invitations/verify/:token
 * @desc    Verify invitation token
 * @access  Public
 */
router.get('/verify/:token', invitationController.verifyInvitation);

/**
 * @route   GET /api/projects/:projectId/members
 * @desc    Get project members
 * @access  Private
 */
router.get('/:projectId/members', authenticateToken, requireProjectAccess, invitationController.getProjectMembers);

module.exports = router;
