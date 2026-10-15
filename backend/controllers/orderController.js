import asyncHandler from '../middlewares/asyncHandler.js';
import Order from '../models/Order.js';
import FoodListing from '../models/FoodListing.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// @desc    Create new order with atomic inventory deduction
// @route   POST /api/orders
// @access  Private/Customer
export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, pickupMethod, deliveryAddress, paymentMethod, isPaid, merchantId, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  // Track deducted items for atomic rollback in case of subsequent failures
  const deductedItems = [];

  try {
    for (const item of orderItems) {
      const listingId = item.listing?._id || item.listing;
      const qty = Number(item.qty || 1);

      if (qty <= 0) {
        throw new Error(`Invalid quantity for item "${item.name}"`);
      }

      // Atomic conditional update: only decrement if status is Available and quantityAvailable >= requested qty
      const updatedListing = await FoodListing.findOneAndUpdate(
        {
          _id: listingId,
          status: 'Available',
          quantityAvailable: { $gte: qty }
        },
        {
          $inc: { quantityAvailable: -qty }
        },
        { new: true }
      );

      if (!updatedListing) {
        // Find current listing status to give a precise error message
        const currentListing = await FoodListing.findById(listingId);
        if (!currentListing || currentListing.status !== 'Available') {
          throw new Error(`"${item.name}" is no longer available.`);
        } else {
          throw new Error(`Only ${currentListing.quantityAvailable} left in stock for "${item.name}". Please adjust quantity.`);
        }
      }

      // Automatically transition to 'Sold Out' if stock is completely exhausted
      if (updatedListing.quantityAvailable === 0) {
        await FoodListing.findByIdAndUpdate(listingId, { status: 'Sold Out' });
        updatedListing.status = 'Sold Out';
      }

      deductedItems.push({ listingId, qty, finalStock: updatedListing.quantityAvailable, status: updatedListing.status });
    }

    const merchantUser = await User.findById(merchantId);
    const autoAccept = merchantUser?.merchantPreferences?.autoAcceptOrders;

    const order = new Order({
      orderItems,
      customer: req.user._id,
      merchant: merchantId,
      pickupMethod,
      deliveryAddress,
      paymentMethod: paymentMethod || 'Card',
      totalPrice,
      isPaid: isPaid || false,
      status: autoAccept ? 'Accepted' : 'Pending',
      stockRestored: false
    });

    const createdOrder = await order.save();
    
    // Broadcast inventory changes via Socket.IO
    if (req.io) {
      for (const d of deductedItems) {
        req.io.emit('inventory-updated', {
          listingId: d.listingId,
          quantityAvailable: d.finalStock,
          status: d.status
        });
      }
    }

    const sendOrderAlerts = merchantUser?.notificationPreferences?.orderAlerts !== false;
    
    if (sendOrderAlerts) {
      // Emit real-time notification to merchant if Socket.io is attached
      if (req.io) {
        req.io.emit(`merchant-order-${merchantId}`, createdOrder);
      }
      
      // Create DB Notification for Merchant
      await Notification.create({
        recipient: merchantId,
        type: 'Order_Update',
        title: autoAccept ? 'New Auto-Accepted Order!' : 'New Order Received!',
        message: `You have received a new order totaling ₹${totalPrice}.`,
        relatedId: createdOrder._id
      });
    }

    res.status(201).json(createdOrder);

  } catch (err) {
    // Roll back already-deducted inventory items on failure
    for (const d of deductedItems) {
      await FoodListing.findByIdAndUpdate(d.listingId, {
        $inc: { quantityAvailable: d.qty },
        $set: { status: 'Available' }
      });
    }
    res.status(400);
    throw new Error(err.message || 'Failed to place order due to inventory constraints.');
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

// @desc    Update order status with automatic stock restoration upon cancellation
// @route   PUT /api/orders/:id/status
// @access  Private/Merchant
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // Pending, Accepted, Preparing, Ready, Completed, Cancelled
  
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Ensure the merchant updating the order is the one who owns it
  if (order.merchant.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to update this order');
  }

  // If status is transitioning to Cancelled and stock hasn't been restored yet, restore stock
  if (status === 'Cancelled' && order.status !== 'Cancelled' && !order.stockRestored) {
    for (const item of order.orderItems) {
      const listingId = item.listing?._id || item.listing;
      const qty = Number(item.qty || 1);
      
      const restored = await FoodListing.findByIdAndUpdate(
        listingId,
        {
          $inc: { quantityAvailable: qty },
          $set: { status: 'Available' }
        },
        { new: true }
      );

      if (req.io && restored) {
        req.io.emit('inventory-updated', {
          listingId,
          quantityAvailable: restored.quantityAvailable,
          status: restored.status
        });
      }
    }
    order.stockRestored = true;
  }

  order.status = status;
  const updatedOrder = await order.save();
  
  // Notify customer
  if (req.io) {
    req.io.emit(`order-update-${order.customer}`, updatedOrder);
  }

  res.json(updatedOrder);
});

// @desc    Cancel an order and safely restore inventory
// @route   PUT /api/orders/:id/cancel
// @access  Private (Customer owner, Merchant owner, or Admin)
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isCustomerOwner = order.customer.toString() === req.user._id.toString();
  const isMerchantOwner = order.merchant.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'Admin';

  if (!isCustomerOwner && !isMerchantOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to cancel this order');
  }

  if (order.status === 'Completed' || order.status === 'Cancelled') {
    res.status(400);
    throw new Error(`Order cannot be cancelled because it is already ${order.status}`);
  }

  // Restore inventory exactly once
  if (!order.stockRestored) {
    for (const item of order.orderItems) {
      const listingId = item.listing?._id || item.listing;
      const qty = Number(item.qty || 1);

      const restored = await FoodListing.findByIdAndUpdate(
        listingId,
        {
          $inc: { quantityAvailable: qty },
          $set: { status: 'Available' }
        },
        { new: true }
      );

      if (req.io && restored) {
        req.io.emit('inventory-updated', {
          listingId,
          quantityAvailable: restored.quantityAvailable,
          status: restored.status
        });
      }
    }
    order.stockRestored = true;
  }

  order.status = 'Cancelled';
  const updatedOrder = await order.save();

  if (req.io) {
    req.io.emit(`order-update-${order.customer}`, updatedOrder);
    req.io.emit(`merchant-order-${order.merchant}`, updatedOrder);
  }

  res.json(updatedOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 })
    .populate('merchant', 'name businessName address')
    .populate('orderItems.listing', 'title image category price discountedPrice quantityAvailable status');
  res.json(orders);
});

// @desc    Get merchant incoming orders
// @route   GET /api/orders/merchant
// @access  Private/Merchant
export const getMerchantOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ merchant: req.user._id }).sort({ createdAt: -1 })
    .populate('customer', 'name email')
    .populate('orderItems.listing', 'title image quantityAvailable status');
  res.json(orders);
});

