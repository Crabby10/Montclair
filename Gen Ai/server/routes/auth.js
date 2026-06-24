const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isDBConnected, mockUsers } = require('../utils/dbFallback');

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'montclair_super_secret_jwt_sign_key_102938', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, referralCode } = req.body;

  try {
    if (isDBConnected()) {
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Check referredBy referral code
      let referredByUser = null;
      if (referralCode) {
        referredByUser = await User.findOne({ referralCode });
      }

      // Generate unique referral code for this user
      const generatedReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        referralCode: generatedReferralCode,
        referredBy: referredByUser ? referredByUser._id : null
      });

      if (user) {
        // Credit referral points if applicable
        if (referredByUser) {
          referredByUser.loyaltyPoints += 100; // Credit points
          await referredByUser.save();
        }

        return res.status(201).json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          loyaltyTier: user.loyaltyTier,
          loyaltyPoints: user.loyaltyPoints,
          referralCode: user.referralCode,
          token: generateToken(user._id)
        });
      } else {
        return res.status(400).json({ message: 'Invalid user data' });
      }
    } else {
      // In-Memory Fallback
      const userExists = mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      let referredByUser = null;
      if (referralCode) {
        referredByUser = mockUsers.find(u => u.referralCode === referralCode);
      }

      const generatedReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const mockUserId = 'mock_user_' + Math.random().toString(36).substring(2, 9);

      const newUser = {
        _id: mockUserId,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'user',
        loyaltyTier: 'member',
        loyaltyPoints: 0,
        referralCode: generatedReferralCode,
        referredBy: referredByUser ? referredByUser._id : null
      };

      mockUsers.push(newUser);

      if (referredByUser) {
        referredByUser.loyaltyPoints = (referredByUser.loyaltyPoints || 0) + 100;
      }

      return res.status(201).json({
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        loyaltyTier: newUser.loyaltyTier,
        loyaltyPoints: newUser.loyaltyPoints,
        referralCode: newUser.referralCode,
        token: generateToken(newUser._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (isDBConnected()) {
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          loyaltyTier: user.loyaltyTier,
          loyaltyPoints: user.loyaltyPoints,
          referralCode: user.referralCode,
          token: generateToken(user._id)
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      // In-Memory Fallback
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          loyaltyTier: user.loyaltyTier,
          loyaltyPoints: user.loyaltyPoints,
          referralCode: user.referralCode,
          token: generateToken(user._id)
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Mock Google Auth endpoint
// @route   POST /api/auth/google
// @access  Public
router.post('/google', async (req, res) => {
  const { googleId, email, firstName, lastName } = req.body;

  try {
    if (isDBConnected()) {
      let user = await User.findOne({ email });

      if (!user) {
        // Create new user if not exists
        const generatedReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const randomPassword = Math.random().toString(36).substring(2, 15);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);

        user = await User.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          googleId,
          referralCode: generatedReferralCode
        });
      }

      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        loyaltyTier: user.loyaltyTier,
        loyaltyPoints: user.loyaltyPoints,
        referralCode: user.referralCode,
        token: generateToken(user._id)
      });
    } else {
      // In-Memory Fallback
      let user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        const generatedReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const randomPassword = Math.random().toString(36).substring(2, 15);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);
        const mockUserId = 'mock_user_' + Math.random().toString(36).substring(2, 9);

        user = {
          _id: mockUserId,
          firstName,
          lastName,
          email,
          password: hashedPassword,
          googleId,
          role: 'user',
          loyaltyTier: 'member',
          loyaltyPoints: 0,
          referralCode: generatedReferralCode
        };

        mockUsers.push(user);
      }

      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        loyaltyTier: user.loyaltyTier,
        loyaltyPoints: user.loyaltyPoints,
        referralCode: user.referralCode,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
