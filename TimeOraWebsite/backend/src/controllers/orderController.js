import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import PaymentService from '../utils/paymentService.js';
import ApiResponse from '../utils/apiResponse.js';
import { generateInvoiceHtml } from '../utils/invoiceGenerator.js';

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    couponCode,
    shippingPrice,
    taxPrice,
    discountPrice,
    totalPrice
  } = req.body;

  try {
    if (!orderItems || orderItems.length === 0) {
      return ApiResponse.error(res, 'No order items provided.', 400);
    }

    // 1. Double check stock levels for all products in order
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return ApiResponse.error(res, `Product ${item.name} not found.`, 404);
      }
      if (product.stock < item.quantity) {
        return ApiResponse.error(res, `Insufficient stock for ${item.name}. Available: ${product.stock}`, 400);
      }
    }

    // 2. Resolve Coupon usage if couponCode is provided
    let couponAppliedId = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        couponAppliedId = coupon._id;
        // Increment usage count
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    // 3. Construct Order Instance in Pending Payment Status
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      taxPrice,
      discountPrice,
      totalPrice,
      couponApplied: couponAppliedId
    });

    const createdOrder = await order.save();

    // 4. Trigger Modular Payment Service
    const paymentResult = await PaymentService.processPayment({
      amount: totalPrice,
      method: paymentMethod,
      orderId: createdOrder._id,
      billingDetails: {
        name: req.user.name,
        email: req.user.email,
        phone: shippingAddress.phone
      }
    });

    if (!paymentResult.success) {
      // Delete order or update status as cancelled if payment initialization failed completely
      createdOrder.orderStatus = 'Cancelled';
      await createdOrder.save();
      return ApiResponse.error(res, `Payment initialization failed: ${paymentResult.message}`, 400);
    }

    // 5. Update Order status based on payment outcome
    if (paymentResult.status === 'succeeded' || paymentResult.status === 'paid') {
      createdOrder.isPaid = true;
      createdOrder.paidAt = Date.now();
      createdOrder.paymentResult = {
        id: paymentResult.paymentId,
        status: paymentResult.status,
        update_time: new Date().toISOString(),
        email_address: req.user.email
      };
    } else {
      // Pending, Requires confirmation (easypaisa/jazzcash/bank)
      createdOrder.paymentResult = {
        id: paymentResult.paymentId,
        status: paymentResult.status,
        update_time: new Date().toISOString()
      };
    }

    // Save final status
    const finalizedOrder = await createdOrder.save();

    // 6. Deduct Stock Levels for items ordered
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    return ApiResponse.success(res, 'Order created successfully.', {
      order: finalizedOrder,
      clientSecret: paymentResult.clientSecret, // Used by Stripe SDK on client side if needed
      paymentMessage: paymentResult.message
    }, 201);

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order details by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id)
      .populate('user', 'name email')
      .populate('couponApplied', 'code discountAmount discountType');

    if (!order) {
      return ApiResponse.error(res, 'Order not found.', 404);
    }

    // Authorization: User can only see their own orders. Admins can see all.
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return ApiResponse.error(res, 'Access denied. Unauthorized order view request.', 403);
    }

    return ApiResponse.success(res, 'Order details retrieved.', order);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged in user orders list
 * @route   GET /api/orders/myorders
 * @access  Private
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return ApiResponse.success(res, 'My orders list retrieved.', orders);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders (Admin only)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
export const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    return ApiResponse.success(res, 'All orders retrieved.', orders);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status or tracking code (Admin only)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res, next) => {
  const { id } = req.params;
  const { orderStatus, trackingNumber, isPaid } = req.body;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return ApiResponse.error(res, 'Order not found.', 404);
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === 'Shipped') {
        order.shippedAt = Date.now();
      }
      if (orderStatus === 'Delivered') {
        order.deliveredAt = Date.now();
        // Assume COD order is settled on delivery
        if (order.paymentMethod === 'cod' || order.paymentMethod === 'postex') {
          order.isPaid = true;
          order.paidAt = Date.now();
          if (order.paymentResult) {
            order.paymentResult.status = 'succeeded';
          }
        }
      }
    }

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (isPaid !== undefined) {
      order.isPaid = isPaid;
      if (isPaid) {
        order.paidAt = Date.now();
      }
    }

    const updatedOrder = await order.save();
    return ApiResponse.success(res, 'Order status updated successfully.', updatedOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard metrics & analytics (Admin only)
 * @route   GET /api/orders/analytics
 * @access  Private/Admin
 */
export const getAnalytics = async (req, res, next) => {
  try {
    // 1. Total sales, unpaid vs paid orders
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $cond: [{ $eq: ['$isPaid', true] }, '$totalPrice', 0] } },
          totalOrders: { $sum: 1 },
          paidOrders: { $sum: { $cond: [{ $eq: ['$isPaid', true] }, 1, 0] } },
          pendingOrders: { $sum: { $cond: [{ $eq: ['$orderStatus', 'Pending'] }, 1, 0] } }
        }
      }
    ]);

    const totalRevenue = stats[0]?.totalRevenue || 0;
    const totalOrders = stats[0]?.totalOrders || 0;
    const paidOrders = stats[0]?.paidOrders || 0;
    const pendingOrders = stats[0]?.pendingOrders || 0;

    // 2. Count Customers
    const User = await import('../models/User.js').then(m => m.default);
    const totalCustomers = await User.countDocuments({ role: 'user' });

    // 3. Count low stock products (less than 5 stock)
    const totalLowStock = await Product.countDocuments({ stock: { $lt: 5 } });

    // 4. Monthly revenue aggregation (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          isPaid: true
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format monthly data for front-end charts
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlySales = monthlySales.map(item => {
      return {
        month: `${monthNames[item._id.month - 1]}`,
        revenue: item.revenue,
        orders: item.orders
      };
    });

    // 5. Recent orders list
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    return ApiResponse.success(res, 'Analytics metrics loaded.', {
      summary: {
        totalRevenue,
        totalOrders,
        paidOrders,
        pendingOrders,
        totalCustomers,
        totalLowStock
      },
      monthlySales: formattedMonthlySales,
      recentOrders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order HTML invoice document
 * @route   GET /api/orders/:id/invoice
 * @access  Private
 */
export const getOrderInvoice = async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return ApiResponse.error(res, 'Order not found.', 404);
    }

    // Access authorization checks
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return ApiResponse.error(res, 'Access denied. Unauthorized invoice retrieval.', 403);
    }

    const htmlContent = generateInvoiceHtml(order);
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(htmlContent);
  } catch (error) {
    next(error);
  }
};
