import express from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import validateRequest from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Public routes for product list and single product detail
router.route('/')
  .get(getProducts)
  .post(
    protect,
    admin,
    [
      body('name').notEmpty().withMessage('Product name is required').trim(),
      body('description').notEmpty().withMessage('Description is required'),
      body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
      body('category').isMongoId().withMessage('Invalid Category ID'),
      body('stock').isInt({ min: 0 }).withMessage('Stock cannot be negative'),
      body('sku').notEmpty().withMessage('SKU code is required').trim(),
      body('movement').isIn(['Automatic', 'Quartz', 'Manual', 'Smart']).withMessage('Invalid movement type'),
      body('dialColor').notEmpty().withMessage('Dial color is required').trim()
    ],
    validateRequest,
    createProduct
  );

router.route('/:identifier')
  .get(getProductById);

router.route('/:id')
  .put(
    protect,
    admin,
    [
      body('name').optional().notEmpty().withMessage('Product name cannot be empty').trim(),
      body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
      body('category').optional().isMongoId().withMessage('Invalid Category ID'),
      body('stock').optional().isInt({ min: 0 }).withMessage('Stock cannot be negative'),
      body('movement').optional().isIn(['Automatic', 'Quartz', 'Manual', 'Smart']).withMessage('Invalid movement type')
    ],
    validateRequest,
    updateProduct
  )
  .delete(protect, admin, deleteProduct);

export default router;
