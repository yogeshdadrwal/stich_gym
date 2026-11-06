'use strict';

const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT for a user
 * @param {string} id - MongoDB user ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Standard API success response
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = {}) => {
  return res.status(statusCode).json({ success: true, message, ...data });
};

/**
 * Standard API error response
 */
const sendError = (res, statusCode = 500, message = 'Server Error') => {
  return res.status(statusCode).json({ success: false, message });
};

/**
 * Calculate BMR using Mifflin-St Jeor equation
 * @param {number} weight - kg
 * @param {number} height - cm
 * @param {number} age
 * @param {string} gender - 'male' | 'female'
 */
const calculateBMR = (weight, height, age, gender) => {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'female' ? base - 161 : base + 5;
};

const ACTIVITY_MULTIPLIERS = {
  sedentary:    1.2,
  light:        1.375,
  moderate:     1.55,
  active:       1.725,
  'very-active': 1.9,
};

/**
 * Calculate TDEE from BMR and activity level
 */
const calculateTDEE = (bmr, activityLevel) => {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
};

/**
 * Recommended daily protein intake in grams (1.8–2.2g per kg body weight for athletes)
 */
const recommendedProtein = (weight, goal = 'muscle-gain') => {
  const multipliers = {
    'muscle-gain': 2.2,
    'fat-loss':    1.8,
    'endurance':   1.6,
    'maintenance': 1.4,
  };
  return Math.round(weight * (multipliers[goal] || 2.0));
};

module.exports = { generateToken, sendSuccess, sendError, calculateBMR, calculateTDEE, recommendedProtein };
