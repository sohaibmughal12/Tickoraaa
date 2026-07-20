import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please enter a coupon code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Please select discount type']
  },
  discountAmount: {
    type: Number,
    required: [true, 'Please enter discount amount'],
    min: [0, 'Discount amount cannot be negative']
  },
  minOrderAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum order amount cannot be negative']
  },
  maxDiscountAmount: {
    type: Number, // Applicable for percentage coupons
    default: null,
    min: [0, 'Max discount amount cannot be negative']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please provide coupon expiry date']
  },
  usageLimit: {
    type: Number, // Limit how many times this coupon can be used overall
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Helper method to check if coupon is valid
couponSchema.methods.isValid = function(orderAmount) {
  if (!this.isActive) return false;
  if (new Date() > this.expiryDate) return false;
  if (orderAmount < this.minOrderAmount) return false;
  if (this.usageLimit !== null && this.usedCount >= this.usageLimit) return false;
  return true;
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
