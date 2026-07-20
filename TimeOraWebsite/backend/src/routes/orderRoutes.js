import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAdminOrders,
  updateOrderStatus,
  getAnalytics,
  getOrderInvoice
} from '../controllers/orderController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import validateRequest from '../middlewares/validationMiddleware.js';

const router = express.Router();

// User placed orders and lists
router.route('/')
  .post(
    protect,
    [
      body('orderItems').isArray({ min: 1 }).withMessage('At least one item must be included in your order'),
      body('shippingAddress.street').notEmpty().withMessage('Street address is required').trim(),
      body('shippingAddress.city').notEmpty().withMessage('City is required').trim(),
      body('shippingAddress.state').notEmpty().withMessage('State is required').trim(),
      body('shippingAddress.zip').notEmpty().withMessage('ZIP code is required').trim(),
      body('shippingAddress.phone').notEmpty().withMessage('Contact phone number is required').trim(),
      body('paymentMethod').isIn(['stripe', 'cod', 'jazzcash', 'easypaisa', 'bank_transfer', 'postex']).withMessage('Unsupported payment method'),
      body('totalPrice').isNumeric().withMessage('Total price must be numeric')
    ],
    validateRequest,
    createOrder
  )
  .get(protect, admin, getAdminOrders);

// Admin dashboard analytics routes
router.get('/analytics', protect, admin, getAnalytics);

// Current user order history list
router.get('/myorders', protect, getMyOrders);

// Details & modification routing
router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .put(
    protect,
    admin,
    [
      body('orderStatus').optional().isIn(['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']).withMessage('Invalid order status value')
    ],
    validateRequest,
    updateOrderStatus
  );

// HTML invoice retrieval
router.get('/:id/invoice', protect, getOrderInvoice);

export default router;
