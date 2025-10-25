const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * Send project invitation email
 */
const sendProjectInvitation = async (email, projectTitle, inviterName, invitationToken) => {
  try {
    const transporter = createTransporter();
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const invitationLink = `${frontendUrl}/invite?token=${invitationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Invitation to join project: ${projectTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Project Invitation</h2>
          <p>Hello!</p>
          <p><strong>${inviterName}</strong> has invited you to join the project <strong>"${projectTitle}"</strong>.</p>
          <p>Click the button below to accept the invitation and create your account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${invitationLink}" 
               style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Accept Invitation
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${invitationLink}</p>
          <p>This invitation will expire in 7 days.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send invitation email');
  }
};

/**
 * Send login credentials to new user
 */
const sendLoginCredentials = async (email, name, password, projectTitle = null) => {
  try {
    const transporter = createTransporter();
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your TaskNestle Login Credentials',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to TaskNestle!</h2>
          <p>Hello ${name},</p>
          <p>Your account has been created and you've been invited to join our team.</p>
          
          ${projectTitle ? `<p><strong>You've been added to the project: "${projectTitle}"</strong></p>` : ''}
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Your Login Credentials:</h3>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${frontendUrl}/login" 
               style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Login to Dashboard
            </a>
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;"><strong>Important:</strong> Please change your password after your first login for security.</p>
          </div>
          
          <p>If you have any questions, feel free to contact your team administrator.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Credentials email sending error:', error);
    throw new Error('Failed to send login credentials');
  }
};

/**
 * Generate invitation token
 */
const generateInvitationToken = (email, projectId) => {
  return jwt.sign(
    { email, projectId, type: 'invitation' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Verify invitation token
 */
const verifyInvitationToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'invitation') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired invitation token');
  }
};

/**
 * Send task assignment notification
 */
const sendTaskAssignmentNotification = async (email, taskTitle, projectTitle, assignerName) => {
  try {
    const transporter = createTransporter();
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `New task assigned: ${taskTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Task Assignment</h2>
          <p>Hello!</p>
          <p><strong>${assignerName}</strong> has assigned you a new task:</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #333;">${taskTitle}</h3>
            <p style="margin: 0; color: #666;">Project: ${projectTitle}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${frontendUrl}/dashboard" 
               style="background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              View Task
            </a>
          </div>
          <p>Log in to your dashboard to see all your assigned tasks.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Task assignment email error:', error);
    throw new Error('Failed to send task assignment notification');
  }
};

module.exports = {
  sendProjectInvitation,
  sendLoginCredentials,
  generateInvitationToken,
  verifyInvitationToken,
  sendTaskAssignmentNotification
};
