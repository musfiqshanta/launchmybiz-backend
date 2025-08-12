const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

const router = express.Router();

// POST /api/customers/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, name, password, remember, profileImage } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: String(email).toLowerCase().trim(),
      hashedPassword,
      remember: Boolean(remember),
      profileImage: profileImage || '',
    });

    return res.status(201).json({
      message: 'Signup successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        remember: user.remember,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/customers/signin
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+hashedPassword');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'customer' },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        remember: user.remember,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error('Signin error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


