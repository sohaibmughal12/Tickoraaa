import express from 'express';
import { body } from 'express-validator';
import {
  getProductReviews,
  getAdminReviews,
  createReview,
  approveReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import validateRequest from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Public route to get reviews of a specific product
router.get('/product/:productId', getProductReviews);

// User review submissions
router.post(
  '/',
  protect,
  [
    body('productId').isMongoId().withMessage('Invalid Product ID'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').notEmpty().withMessage('Comment body text is required').trim()
  ],
  validateRequest,
  createReview
);

// Admin operations
router.get('/admin-list', protect, admin, getAdminReviews);
router.put('/:id/approve', protect, admin, approveReview);

// Delete review (both owner user and admin)
router.delete('/:id', protect, deleteReview);

export default router;
