import express from 'express';
import { body } from 'express-validator';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import validateRequest from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Signup Route (Rate Limited)
router.post(
  '/signup',
  authLimiter,
  [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Please include a valid email address').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  validateRequest,
  registerUser
);

// Login Route (Rate Limited)
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please include a valid email address').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  loginUser
);

// Forgot Password
router.post(
  '/forgot-password',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please include a valid email address').normalizeEmail()
  ],
  validateRequest,
  forgotPassword
);

// Reset Password
router.post(
  '/reset-password/:token',
  authLimiter,
  [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  validateRequest,
  resetPassword
);

// Profile Routes (Protected)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(
    protect,
    [
      body('name').optional().notEmpty().withMessage('Name cannot be empty').trim(),
      body('email').optional().isEmail().withMessage('Please include a valid email address').normalizeEmail(),
      body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    validateRequest,
    updateUserProfile
  );

export default router;
