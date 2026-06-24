const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_montclair_stripe_key');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { protect } = require('../middleware/authMiddleware');

// Initialize Razorpay client
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_mock_secret'
  });
} catch (error) {
  console.error('Razorpay initialization failed:', error.message);
}

// @desc    Create Stripe Payment Intent
// @route   POST /api/payments/stripe/create-intent
// @access  Private
router.post('/stripe/create-intent', protect, async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in cents
      currency: currency || 'usd',
      metadata: { userId: req.user._id.toString() },
      automatic_payment_methods: { enabled: true }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/razorpay/create-order
// @access  Private
router.post('/razorpay/create-order', protect, async (req, res) => {
  const { amount, currency } = req.body;

  if (!razorpay) {
    return res.status(500).json({ message: 'Razorpay gateway not configured' });
  }

  const options = {
    amount: Math.round(amount * 100), // Razorpay expects amount in paise
    currency: currency || 'INR',
    receipt: `receipt_order_${Math.random().toString(36).substring(2, 12)}`
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify Razorpay Signature (Callback validation)
// @route   POST /api/payments/razorpay/verify
// @access  Private
router.post('/razorpay/verify', protect, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_mock_secret')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      return res.json({ message: 'Payment verified successfully', status: 'success' });
    } else {
      return res.status(400).json({ message: 'Invalid payment signature', status: 'failure' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
