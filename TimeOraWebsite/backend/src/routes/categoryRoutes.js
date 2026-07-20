import express from 'express';
import { body } from 'express-validator';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import validateRequest from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Public route to view all categories
router.route('/')
  .get(getCategories)
  .post(
    protect,
    admin,
    [
      body('name').notEmpty().withMessage('Category name is required').trim(),
      body('description').notEmpty().withMessage('Category description is required').trim()
    ],
    validateRequest,
    createCategory
  );

router.route('/:id')
  .put(
    protect,
    admin,
    [
      body('name').optional().notEmpty().withMessage('Category name cannot be empty').trim()
    ],
    validateRequest,
    updateCategory
  )
  .delete(protect, admin, deleteCategory);

export default router;
