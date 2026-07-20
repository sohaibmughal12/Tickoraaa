import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import ApiResponse from '../utils/apiResponse.js';

/**
 * @desc    Get all approved reviews for a single product
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
export const getProductReviews = async (req, res, next) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ product: productId, isApproved: true })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, 'Reviews retrieved successfully.', reviews);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reviews (Admin only - for review approval list)
 * @route   GET /api/reviews/admin-list
 * @access  Private/Admin
 */
export const getAdminReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({})
      .populate('user', 'name email')
      .populate('product', 'name sku')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, 'Admin review list retrieved.', reviews);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new product review
 * @route   POST /api/reviews
 * @access  Private
 */
export const createReview = async (req, res, next) => {
  const { productId, rating, comment, images } = req.body;
  const userId = req.user._id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return ApiResponse.error(res, 'Product not found.', 404);
    }

    // Check if user has already reviewed this product
    const alreadyReviewed = await Review.findOne({ user: userId, product: productId });
    if (alreadyReviewed) {
      return ApiResponse.error(res, 'You have already reviewed this product.', 400);
    }

    // Verify if user is a verified buyer (has a completed/delivered order with this product)
    const verifiedOrder = await Order.findOne({
      user: userId,
      orderStatus: 'Delivered',
      'orderItems.product': productId
    });

    const isVerifiedBuyer = !!verifiedOrder;

    const review = new Review({
      user: userId,
      product: productId,
      rating: Number(rating),
      comment,
      images: images || [],
      isVerifiedBuyer,
      isApproved: false // Requires admin moderation approval
    });

    const createdReview = await review.save();
    return ApiResponse.success(res, 'Review submitted successfully. Pending administrator approval.', createdReview, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve/Reject review (Admin toggle)
 * @route   PUT /api/reviews/:id/approve
 * @access  Private/Admin
 */
export const approveReview = async (req, res, next) => {
  const { id } = req.params;
  const { isApproved } = req.body; // boolean

  try {
    const review = await Review.findById(id);
    if (!review) {
      return ApiResponse.error(res, 'Review not found.', 404);
    }

    review.isApproved = isApproved !== undefined ? isApproved : true;
    await review.save();

    // Re-trigger calculation of average rating for the target product
    await Review.calculateAverageRating(review.product);

    return ApiResponse.success(res, `Review status updated to: ${review.isApproved ? 'Approved' : 'Unapproved'}.`, review);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
export const deleteReview = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  try {
    const review = await Review.findById(id);
    if (!review) {
      return ApiResponse.error(res, 'Review not found.', 404);
    }

    // Authorization check: Admin can delete any review, User can delete only their own
    if (userRole !== 'admin' && review.user.toString() !== userId.toString()) {
      return ApiResponse.error(res, 'Unauthorized to delete this review.', 403);
    }

    const productId = review.product;
    await Review.findByIdAndDelete(id);

    // Re-trigger calculation of average rating for the target product
    await Review.calculateAverageRating(productId);

    return ApiResponse.success(res, 'Review deleted successfully.', {});
  } catch (error) {
    next(error);
  }
};
