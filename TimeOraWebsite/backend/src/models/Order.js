import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  selectedColor: String,
  selectedStrap: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true, default: 'Pakistan' },
    phone: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['stripe', 'cod', 'jazzcash', 'easypaisa', 'bank_transfer', 'postex']
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  discountPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  shippedAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  couponApplied: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
