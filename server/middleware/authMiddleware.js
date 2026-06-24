const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isDBConnected, mockUsers } = require('../utils/dbFallback');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'montclair_super_secret_jwt_sign_key_102938');

      // Add user to request (excluding password)
      if (isDBConnected()) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        const user = mockUsers.find(u => u._id === decoded.id);
        if (user) {
          const { password, ...userWithoutPassword } = user;
          req.user = userWithoutPassword;
        }
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
