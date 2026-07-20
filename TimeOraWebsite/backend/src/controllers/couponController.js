import Coupon from '../models/Coupon.js';
import ApiResponse from '../utils/apiResponse.js';

/**
 * @desc    Get all coupons (Admin only)
 * @route   GET /api/coupons
 * @access  Private/Admin
 */
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return ApiResponse.success(res, 'Coupons retrieved successfully.', coupons);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new promo coupon (Admin only)
 * @route   POST /api/coupons
 * @access  Private/Admin
 */
export const createCoupon = async (req, res, next) => {
  const {
    code,
    discountType,
    discountAmount,
    minOrderAmount,
    maxDiscountAmount,
    expiryDate,
    usageLimit
  } = req.body;

  try {
    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      return ApiResponse.error(res, 'Coupon code already exists.', 400);
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountType,
      discountAmount,
      minOrderAmount: minOrderAmount || 0,
      maxDiscountAmount: maxDiscountAmount || null,
      expiryDate: new Date(expiryDate),
      usageLimit: usageLimit !== undefined ? usageLimit : null
    });

    const createdCoupon = await coupon.save();
    return ApiResponse.success(res, 'Coupon created successfully.', createdCoupon, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a coupon (Admin only)
 * @route   DELETE /api/coupons/:id
 * @access  Private/Admin
 */
export const deleteCoupon = async (req, res, next) => {
  const { id } = req.params;

  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return ApiResponse.error(res, 'Coupon not found.', 404);
    }

    await Coupon.findByIdAndDelete(id);
    return ApiResponse.success(res, 'Coupon deleted successfully.', {});
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Apply a coupon to calculate discounts
 * @route   POST /api/coupons/apply
 * @access  Private
 */
export const applyCoupon = async (req, res, next) => {
  const { code, cartSubtotal } = req.body;

  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return ApiResponse.error(res, 'Invalid coupon code or coupon is inactive.', 400);
    }

    // Verify validity using our Model method
    if (!coupon.isValid(cartSubtotal)) {
      if (new Date() > coupon.expiryDate) {
        return ApiResponse.error(res, 'This coupon code has expired.', 400);
      }
      if (cartSubtotal < coupon.minOrderAmount) {
        return ApiResponse.error(res, `Minimum order amount of PKR ${coupon.minOrderAmount} is required to use this coupon.`, 400);
      }
      if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        return ApiResponse.error(res, 'This coupon usage limit has been reached.', 400);
      }
      return ApiResponse.error(res, 'Coupon is invalid for your cart.', 400);
    }

    // Calculate discount value
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (coupon.discountAmount / 100) * cartSubtotal;
      // Cap the discount if maxDiscountAmount is set
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountAmount;
    }

    return ApiResponse.success(res, 'Coupon applied successfully.', {
      code: coupon.code,
      discountType: coupon.discountType,
      discountAmount: coupon.discountAmount,
      discountCalculated: Math.round(discount),
      minOrderAmount: coupon.minOrderAmount,
      couponId: coupon._id
    });
  } catch (error) {
    next(error);
  }
};
