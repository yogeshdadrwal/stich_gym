'use strict';

const { sendSuccess, sendError } = require('../utils/helpers');
const { getIsConnected } = require('../config/db');

const getStore = () => {
  if (getIsConnected()) {
    return { User: require('../models/user.model'), inMemory: false };
  }
  return { store: require('../config/data'), inMemory: true };
};

// ── GET /api/users/profile ─────────────────────────────────────────────────────
const getProfile = async (req, res) => {
  return sendSuccess(res, 200, 'Profile fetched', { user: req.user });
};

// ── PUT /api/users/profile ─────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  const { name, phone, addresses } = req.body;
  try {
    const { User, store, inMemory } = getStore();
    if (inMemory) {
      const user = store.users.find(u => u._id === String(req.user._id));
      if (!user) return sendError(res, 404, 'User not found');
      if (name)      user.name = name;
      if (phone)     user.phone = phone;
      if (addresses) user.addresses = addresses;
      return sendSuccess(res, 200, 'Profile updated', { user });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, addresses },
      { new: true, runValidators: true }
    );
    return sendSuccess(res, 200, 'Profile updated', { user });
  } catch (err) {
    return sendError(res, 500, 'Failed to update profile');
  }
};

// ── GET /api/users (admin) ─────────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const { User, store, inMemory } = getStore();
    if (inMemory) {
      const users = store.users.map(({ password, ...u }) => u);
      return sendSuccess(res, 200, 'Users fetched', { count: users.length, users });
    }
    const users = await User.find().select('-password');
    return sendSuccess(res, 200, 'Users fetched', { count: users.length, users });
  } catch (err) {
    return sendError(res, 500, 'Failed to fetch users');
  }
};

module.exports = { getProfile, updateProfile, getAllUsers };
