import express from 'express';
import { body } from 'express-validator';
import {
  getCoupons,
  createCoupon,
  deleteCoupon,
  applyCoupon
} from '../controllers/couponController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import validateRequest from '../middlewares/validationMiddleware.js';

const router = express.Router();

// User apply coupon
router.post(
  '/apply',
  protect,
  [
    body('code').notEmpty().withMessage('Coupon code is required').trim(),
    body('cartSubtotal').isNumeric().withMessage('Subtotal must be a numeric value')
  ],
  validateRequest,
  applyCoupon
);

// Admin Coupon list and CRUD routes
router.route('/')
  .get(protect, admin, getCoupons)
  .post(
    protect,
    admin,
    [
      body('code').notEmpty().withMessage('Coupon code is required').trim(),
      body('discountType').isIn(['percentage', 'fixed']).withMessage('Discount type must be percentage or fixed'),
      body('discountAmount').isFloat({ min: 0 }).withMessage('Discount amount must be a positive number'),
      body('expiryDate').isISO8601().toDate().withMessage('Invalid date format for expiry date')
    ],
    validateRequest,
    createCoupon
  );

router.route('/:id')
  .delete(protect, admin, deleteCoupon);

export default router;
