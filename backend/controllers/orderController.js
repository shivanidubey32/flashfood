import asyncHandler from '../middlewares/asyncHandler.js';
import Order from '../models/Order.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Customer
export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, pickupMethod, merchantId, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems,
      customer: req.user._id,
      merchant: merchantId,
      pickupMethod,
      totalPrice,
      isPaid: false // Usually updated after payment gateway success
    });

    const createdOrder = await order.save();
    
    // Emit real-time notification to merchant if Socket.io is attached
    if (req.io) {
      req.io.emit(`merchant-order-${merchantId}`, createdOrder);
    }

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('customer', 'name email')
    .populate('merchant', 'businessName address');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Merchant
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // Pending, Accepted, Preparing, Ready, Completed
  
  const order = await Order.findById(req.params.id);

  if (order) {
    // Ensure the merchant updating the order is the one who owns it
    if (order.merchant.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this order');
    }

    order.status = status;
    const updatedOrder = await order.save();
    
    // Notify customer
    if (req.io) {
      req.io.emit(`order-update-${order.customer}`, updatedOrder);
    }

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 })
    .populate('merchant', 'name businessName address');
  res.json(orders);
});

// @desc    Get merchant incoming orders
// @route   GET /api/orders/merchant
// @access  Private/Merchant
export const getMerchantOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ merchant: req.user._id }).sort({ createdAt: -1 })
    .populate('customer', 'name email');
  res.json(orders);
});
