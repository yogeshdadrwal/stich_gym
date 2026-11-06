'use strict';

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { generateToken, sendSuccess, sendError } = require('../utils/helpers');
const { getIsConnected } = require('../config/db');

// Lazy-require model/store based on DB availability
const getStore = () => {
  if (getIsConnected()) {
    return { User: require('../models/user.model'), inMemory: false };
  }
  return { store: require('../config/data'), inMemory: true };
};

// ── POST /api/auth/register ──────────────────────────────────────────────────
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, password, phone } = req.body;

  try {
    const { User, store, inMemory } = getStore();

    if (inMemory) {
      // In-memory mode
      if (store.users.find(u => u.email === email)) {
        return sendError(res, 400, 'Email already registered');
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = {
        _id: `user_${Date.now()}`,
        name, email, phone,
        password: hashedPassword,
        role: 'user',
        createdAt: new Date(),
      };
      store.users.push(newUser);
      const token = generateToken(newUser._id);
      return sendSuccess(res, 201, 'Registration successful', {
        token,
        user: { _id: newUser._id, name, email, phone, role: 'user' },
      });
    }

    // MongoDB mode
    const existing = await User.findOne({ email });
    if (existing) return sendError(res, 400, 'Email already registered');

    const user = await User.create({ name, email, password, phone });
    const token = generateToken(user._id);
    return sendSuccess(res, 201, 'Registration successful', {
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Register error:', err);
    return sendError(res, 500, 'Registration failed. Please try again.');
  }
};

// ── POST /api/auth/login ─────────────────────────────────────────────────────
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const { User, store, inMemory } = getStore();

    if (inMemory) {
      const user = store.users.find(u => u.email === email);
      if (!user) return sendError(res, 401, 'Invalid email or password');
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return sendError(res, 401, 'Invalid email or password');
      const token = generateToken(user._id);
      return sendSuccess(res, 200, 'Login successful', {
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) return sendError(res, 401, 'Invalid email or password');
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return sendError(res, 401, 'Invalid email or password');

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    return sendSuccess(res, 200, 'Login successful', {
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    return sendError(res, 500, 'Login failed. Please try again.');
  }
};

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  return sendSuccess(res, 200, 'User fetched', {
    user: req.user,
  });
};

// ── POST /api/auth/logout ────────────────────────────────────────────────────
const logout = async (req, res) => {
  // JWT is stateless; client should delete the token
  return sendSuccess(res, 200, 'Logged out successfully');
};

module.exports = { register, login, getMe, logout };
