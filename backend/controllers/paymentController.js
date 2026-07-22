import asyncHandler from '../middlewares/asyncHandler.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { amount, orderId } = req.body;

  if (!amount || !orderId) {
    res.status(400);
    throw new Error('Amount and Order ID are required');
  }

  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'dummy_key_id') {
    res.status(400);
    throw new Error('Razorpay API keys are missing in the .env file. Please add RAZORPAY_KEY_ID and RAZORPAY_SECRET.');
  }

  // Initialize Razorpay SDK
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  // Razorpay expects amount in the smallest currency unit (e.g., paise for INR)
  const options = {
    amount: amount * 100, // Multiply by 100 to convert Rupees to Paise
    currency: 'INR',
    receipt: `receipt_order_${orderId}`,
    payment_capture: 1, // Auto capture
  };

  try {
    const razorpayOrder = await razorpay.orders.create(options);

    // Save initial pending payment record in DB
    const payment = new Payment({
      user: req.user._id,
      order: orderId,
      amount: amount,
      razorpayOrderId: razorpayOrder.id,
      status: 'pending',
    });

    await payment.save();

    res.json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
    });
  } catch (error) {
    console.error("Razorpay Create Order Error: ", error);
    res.status(500);
    throw new Error('Failed to create Razorpay order');
  }
});

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify-payment
// @access  Private
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
    res.status(400);
    throw new Error('Missing payment verification details');
  }

  const secret = process.env.RAZORPAY_SECRET || 'dummy_secret';

  // Create HMAC SHA256 digest
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');

  // Verify the signature
  if (generated_signature === razorpay_signature) {
    // 1. Update Payment Record
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (payment) {
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.status = 'paid';
      await payment.save();
    }

    // 2. Update Order Record to Paid
    const order = await Order.findById(orderId);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      await order.save();
    }

    res.json({ success: true, message: 'Payment verified successfully' });
  } else {
    // 3. Mark Payment as Failed if signatures don't match
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (payment) {
      payment.status = 'failed';
      await payment.save();
    }
    
    res.status(400);
    throw new Error('Payment verification failed');
  }
});
