import Product from '../models/Product.js';
import Category from '../models/Category.js';
import ApiResponse from '../utils/apiResponse.js';

/**
 * @desc    Get all products with advanced filtering, sorting, search, and pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      gender,
      movement,
      minPrice,
      maxPrice,
      color,
      strapMaterial,
      sort,
      page = 1,
      limit = 9
    } = req.query;

    const query = {};

    // 1. Search Query (debounced search matching name, tags, or description)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // 2. Category Filter
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        // If category query doesn't exist, return empty data
        return ApiResponse.success(res, 'No products found.', { products: [], page: 1, pages: 0, total: 0 });
      }
    }

    // 3. Gender Filter
    if (gender) {
      query.gender = gender;
    }

    // 4. Movement Filter (Automatic, Quartz, Manual, Smart)
    if (movement) {
      query.movement = movement;
    }

    // 5. Price Range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 6. Color Filter (matches variants color)
    if (color) {
      query['variants.color'] = { $regex: color, $options: 'i' };
    }

    // 7. Strap Material Filter (matches variants strap material)
    if (strapMaterial) {
      query['variants.strapMaterial'] = { $regex: strapMaterial, $options: 'i' };
    }

    // Pagination calculations
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build Sort options
    let sortOptions = { createdAt: -1 }; // Default: Newest
    if (sort) {
      switch (sort) {
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'price-asc':
          sortOptions = { price: 1 };
          break;
        case 'price-desc':
          sortOptions = { price: -1 };
          break;
        case 'best-selling':
          sortOptions = { ratings: -1, numReviews: -1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    }

    // Execute query with counts
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const pages = Math.ceil(total / limitNum);

    return ApiResponse.success(res, 'Products retrieved successfully.', {
      products,
      page: pageNum,
      pages,
      total
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get product details by slug or ID
 * @route   GET /api/products/:identifier
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  const { identifier } = req.params;

  try {
    let product;

    // Check if identifier is a valid MongoDB ObjectId, otherwise search by slug
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier).populate('category', 'name slug');
    } else {
      product = await Product.findOne({ slug: identifier }).populate('category', 'name slug');
    }

    if (!product) {
      return ApiResponse.error(res, 'Product not found.', 404);
    }

    return ApiResponse.success(res, 'Product details retrieved.', product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new product (Admin only)
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      images,
      category,
      stock,
      sku,
      gender,
      movement,
      dialColor,
      variants,
      specifications,
      isFeatured,
      isLimitedEdition,
      tags
    } = req.body;

    // Check category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return ApiResponse.error(res, 'Invalid category reference.', 400);
    }

    // Check SKU unique
    const skuExists = await Product.findOne({ sku });
    if (skuExists) {
      return ApiResponse.error(res, 'SKU already exists. Please use a unique SKU code.', 400);
    }

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      images,
      category,
      stock,
      sku,
      gender,
      movement,
      dialColor,
      variants: variants || [],
      specifications: specifications || [],
      isFeatured: isFeatured || false,
      isLimitedEdition: isLimitedEdition || false,
      tags: tags || []
    });

    const createdProduct = await product.save();
    return ApiResponse.success(res, 'Product created successfully.', createdProduct, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing product (Admin only)
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return ApiResponse.error(res, 'Product not found.', 404);
    }

    const {
      name,
      description,
      price,
      discountPrice,
      images,
      category,
      stock,
      sku,
      gender,
      movement,
      dialColor,
      variants,
      specifications,
      isFeatured,
      isLimitedEdition,
      tags
    } = req.body;

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return ApiResponse.error(res, 'Invalid category reference.', 400);
      }
      product.category = category;
    }

    if (sku && sku !== product.sku) {
      const skuExists = await Product.findOne({ sku });
      if (skuExists) {
        return ApiResponse.error(res, 'SKU already exists. Please use a unique SKU code.', 400);
      }
      product.sku = sku;
    }

    // Update remaining properties
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
    product.images = images || product.images;
    product.stock = stock !== undefined ? stock : product.stock;
    product.gender = gender || product.gender;
    product.movement = movement || product.movement;
    product.dialColor = dialColor || product.dialColor;
    product.variants = variants || product.variants;
    product.specifications = specifications || product.specifications;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.isLimitedEdition = isLimitedEdition !== undefined ? isLimitedEdition : product.isLimitedEdition;
    product.tags = tags || product.tags;

    // Resetting slug if name changed
    if (name && name !== product.name) {
      product.slug = undefined; // Will trigger re-validation in schema hook
    }

    const updatedProduct = await product.save();
    return ApiResponse.success(res, 'Product updated successfully.', updatedProduct);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product (Admin only)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return ApiResponse.error(res, 'Product not found.', 404);
    }

    await Product.findByIdAndDelete(id);
    return ApiResponse.success(res, 'Product deleted successfully.', {});
  } catch (error) {
    next(error);
  }
};
