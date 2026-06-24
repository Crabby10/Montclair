const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');
const { sendOrderConfirmationEmail } = require('../utils/emailService');
const { isDBConnected, mockProducts, mockOrders, mockUsers } = require('../utils/dbFallback');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  const { items, shippingAddress, subTotal, discountAmount, shippingFee, totalAmount, paymentDetails, couponCode } = req.body;

  if (items && items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    if (isDBConnected()) {
      // 1. Verify stock and decrement
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ message: `Product ${item.name} not found` });
        }

        // Find matching SKU
        const skuIndex = product.skus.findIndex(
          s => s.size === item.size && s.color === item.color
        );

        if (skuIndex === -1) {
          return res.status(400).json({ message: `SKU size ${item.size} / color ${item.color} not found for ${item.name}` });
        }

        if (product.skus[skuIndex].stock < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
        }

        // Decrement stock
        product.skus[skuIndex].stock -= item.quantity;
        await product.save();
      }

      // 2. Create Order
      const order = new Order({
        user: req.user._id,
        items,
        shippingAddress,
        subTotal,
        discountAmount,
        shippingFee,
        totalAmount,
        paymentDetails,
        couponCode
      });

      const createdOrder = await order.save();

      // 3. Credit loyalty points for purchase (1 point per dollar spent)
      req.user.loyaltyPoints += Math.floor(totalAmount);
      // Check tier upgrades
      if (req.user.loyaltyPoints >= 5000) {
        req.user.loyaltyTier = 'Platinum';
      } else if (req.user.loyaltyPoints >= 2000) {
        req.user.loyaltyTier = 'Gold';
      }
      await req.user.save();

      // 4. Dispatch Order Confirmation Email asynchronously
      sendOrderConfirmationEmail(req.user.email, createdOrder);

      return res.status(201).json(createdOrder);
    } else {
      // In-Memory Fallback
      for (const item of items) {
        const product = mockProducts.find(p => p._id === item.product || p.id === Number(item.product));
        if (!product) {
          return res.status(404).json({ message: `Product ${item.name} not found` });
        }

        const skuIndex = product.skus.findIndex(
          s => s.size === item.size && s.color.toLowerCase() === item.color.toLowerCase()
        );

        if (skuIndex === -1) {
          return res.status(400).json({ message: `SKU size ${item.size} / color ${item.color} not found for ${item.name}` });
        }

        if (product.skus[skuIndex].stock < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
        }

        product.skus[skuIndex].stock -= item.quantity;
      }

      const createdOrder = {
        _id: 'mock_order_' + Math.random().toString(36).substring(2, 9),
        user: req.user._id,
        items,
        shippingAddress,
        subTotal,
        discountAmount,
        shippingFee,
        totalAmount,
        paymentDetails,
        couponCode,
        shippingStatus: 'processing',
        createdAt: new Date()
      };

      mockOrders.push(createdOrder);

      // Update in-memory user loyalty points
      const user = mockUsers.find(u => u._id === req.user._id);
      if (user) {
        user.loyaltyPoints = (user.loyaltyPoints || 0) + Math.floor(totalAmount);
        if (user.loyaltyPoints >= 5000) {
          user.loyaltyTier = 'Platinum';
        } else if (user.loyaltyPoints >= 2000) {
          user.loyaltyTier = 'Gold';
        }
        // Update current request's user object as well
        req.user.loyaltyPoints = user.loyaltyPoints;
        req.user.loyaltyTier = user.loyaltyTier;
      }

      // Try sending confirmation email without throwing if fails
      try {
        sendOrderConfirmationEmail(req.user.email, createdOrder);
      } catch (err) {
        console.error('Email dispatch failed, skipping confirmation send.');
      }

      return res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    if (isDBConnected()) {
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
      res.json(orders);
    } else {
      const orders = mockOrders
        .filter(o => o.user === req.user._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    if (isDBConnected()) {
      const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');

      if (order) {
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
          return res.status(401).json({ message: 'Not authorized to view this order' });
        }
        res.json(order);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } else {
      const order = mockOrders.find(o => o._id === req.params.id);

      if (order) {
        if (order.user !== req.user._id && req.user.role !== 'admin') {
          return res.status(401).json({ message: 'Not authorized to view this order' });
        }
        // Populate user data mock
        const orderUser = mockUsers.find(u => u._id === order.user);
        const orderWithPopulatedUser = {
          ...order,
          user: orderUser ? {
            _id: orderUser._id,
            firstName: orderUser.firstName,
            lastName: orderUser.lastName,
            email: orderUser.email
          } : { _id: order.user }
        };
        res.json(orderWithPopulatedUser);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order to shipped (Admin only)
// @route   PUT /api/orders/:id/ship
// @access  Private/Admin
router.put('/:id/ship', protect, admin, async (req, res) => {
  const { trackingNumber, carrierName } = req.body;

  try {
    if (isDBConnected()) {
      const order = await Order.findById(req.params.id);

      if (order) {
        order.shippingStatus = 'shipped';
        order.trackingNumber = trackingNumber;
        order.carrierName = carrierName;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } else {
      const order = mockOrders.find(o => o._id === req.params.id);

      if (order) {
        order.shippingStatus = 'shipped';
        order.trackingNumber = trackingNumber;
        order.carrierName = carrierName;
        res.json(order);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
