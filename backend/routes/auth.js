import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/models.js';
import { authMiddleware, JWT_SECRET, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a new customer
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // If email matches shekhawaticollection@gmail.com, auto-assign admin role
    const role = email.toLowerCase() === 'shekhawaticollection@gmail.com' ? 'admin' : 'customer';

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      rewardPoints: 100 // Seed new signups with 100 reward points ($10 value) to drive trust
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        rewardPoints: newUser.rewardPoints
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate customer & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rewardPoints: user.rewardPoints
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// @route   GET api/auth/user
// @desc    Get user data
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      rewardPoints: user.rewardPoints
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving profile.' });
  }
});

// @route   GET api/auth/users
// @desc    Get all users (Admin only)
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    const safeUsers = users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      rewardPoints: u.rewardPoints,
      createdAt: u.createdAt
    }));
    res.json(safeUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving users list.' });
  }
});

export default router;
