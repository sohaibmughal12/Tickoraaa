import Category from '../models/Category.js';
import Product from '../models/Product.js';
import ApiResponse from '../utils/apiResponse.js';

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    return ApiResponse.success(res, 'Categories retrieved successfully.', categories);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a category (Admin only)
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = async (req, res, next) => {
  const { name, description, image } = req.body;

  try {
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return ApiResponse.error(res, 'Category already exists.', 400);
    }

    const category = new Category({
      name,
      description,
      image
    });

    const createdCategory = await category.save();
    return ApiResponse.success(res, 'Category created successfully.', createdCategory, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a category (Admin only)
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, image } = req.body;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return ApiResponse.error(res, 'Category not found.', 404);
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.image = image || category.image;

    if (name && name !== category.name) {
      category.slug = undefined; // Trigger slug re-generation on save
    }

    const updatedCategory = await category.save();
    return ApiResponse.success(res, 'Category updated successfully.', updatedCategory);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a category (Admin only)
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return ApiResponse.error(res, 'Category not found.', 404);
    }

    // Check if any product references this category
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return ApiResponse.error(res, 'Cannot delete category containing active products.', 400);
    }

    await Category.findByIdAndDelete(id);
    return ApiResponse.success(res, 'Category deleted successfully.', {});
  } catch (error) {
    next(error);
  }
};
