const express = require('express');
const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user profile
router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'User profile', user: req.user });
});

// Update user profile
router.put('/profile', verifyToken, (req, res) => {
  const { name, phone, address } = req.body;
  res.json({ message: 'Profile updated', data: { name, phone, address } });
});

// Get all users (Admin only)
router.get('/', verifyToken, (req, res) => {
  if (req.user.portalType !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  res.json({ message: 'All users', users: [] });
});

module.exports = router;
