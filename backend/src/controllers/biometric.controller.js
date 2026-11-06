'use strict';

const { sendSuccess, sendError } = require('../utils/helpers');
const { calculateBMR, calculateTDEE, recommendedProtein } = require('../utils/helpers');

// Recommended supplement stacks by goal
const STACKS = {
  'muscle-gain': {
    goal: 'Muscle Gain',
    description: 'Maximize muscle protein synthesis and anabolic drive.',
    products: [
      { id: 'prod_001', name: 'ISO Matrix Isolate', reason: 'Fast-absorbing post-workout protein (27g/serving)' },
      { id: 'prod_003', name: 'Creatine X-Force', reason: 'Clinically proven to increase strength and muscle volume' },
      { id: 'prod_002', name: 'Vortex Pre-Workout', reason: 'Maximize workout intensity and volume' },
    ],
  },
  'fat-loss': {
    goal: 'Fat Loss',
    description: 'Preserve lean muscle while in a caloric deficit.',
    products: [
      { id: 'prod_001', name: 'ISO Matrix Isolate', reason: 'High-protein, low-calorie — keeps you full and muscle intact' },
      { id: 'prod_004', name: 'BCAA Storm', reason: 'Anti-catabolic during fasted training' },
      { id: 'prod_006', name: 'Glutamine Surge', reason: 'Gut health and immune support during dieting' },
    ],
  },
  'endurance': {
    goal: 'Endurance & Performance',
    description: 'Fuel long-duration training and accelerate recovery.',
    products: [
      { id: 'prod_004', name: 'BCAA Storm', reason: 'Intra-workout fuel and electrolyte replenishment' },
      { id: 'prod_006', name: 'Glutamine Surge', reason: 'Accelerates recovery between sessions' },
      { id: 'prod_007', name: 'Omega Force', reason: 'Joint lubrication and anti-inflammatory for high-volume training' },
    ],
  },
  'general-health': {
    goal: 'General Health & Wellness',
    description: 'Build a strong nutritional foundation.',
    products: [
      { id: 'prod_007', name: 'Omega Force', reason: 'Heart health, cognitive function, joint care' },
      { id: 'prod_008', name: 'Night Recovery Complex', reason: 'Optimize sleep quality and overnight repair' },
      { id: 'prod_006', name: 'Glutamine Surge', reason: 'Gut health and immune support' },
    ],
  },
};

// ── POST /api/biometric/calculate ─────────────────────────────────────────────
const calculate = async (req, res) => {
  const { weight, height, age, gender = 'male', activityLevel = 'moderate', goal = 'muscle-gain' } = req.body;

  if (!weight || !height || !age) {
    return sendError(res, 400, 'weight, height, and age are required');
  }

  const w = Number(weight);
  const h = Number(height);
  const a = Number(age);

  if (w <= 0 || w > 300) return sendError(res, 400, 'Invalid weight (1-300 kg)');
  if (h <= 0 || h > 250) return sendError(res, 400, 'Invalid height (1-250 cm)');
  if (a <= 0 || a > 120) return sendError(res, 400, 'Invalid age (1-120)');

  const bmr  = Math.round(calculateBMR(w, h, a, gender));
  const tdee = calculateTDEE(bmr, activityLevel);
  const protein = recommendedProtein(w, goal);

  // Macro splits based on goal
  const macros = {
    'muscle-gain': { protein: Math.round(protein * 4),    carbs: Math.round(tdee * 0.45), fat: Math.round(tdee * 0.25) },
    'fat-loss':    { protein: Math.round(protein * 4),    carbs: Math.round(tdee * 0.30), fat: Math.round(tdee * 0.25) },
    'endurance':   { protein: Math.round(protein * 4),    carbs: Math.round(tdee * 0.55), fat: Math.round(tdee * 0.20) },
    'general-health': { protein: Math.round(protein * 4), carbs: Math.round(tdee * 0.40), fat: Math.round(tdee * 0.30) },
  };

  const recommendedStack = STACKS[goal] || STACKS['general-health'];

  return sendSuccess(res, 200, 'Biometric calculation complete', {
    results: {
      bmr,
      tdee,
      recommendedCalories: goal === 'muscle-gain' ? tdee + 300 : goal === 'fat-loss' ? tdee - 400 : tdee,
      dailyProtein:    protein,
      bmi:             Math.round((w / ((h / 100) ** 2)) * 10) / 10,
      idealWeight:     Math.round(22 * ((h / 100) ** 2)), // BMI 22 target
      macros:          macros[goal] || macros['general-health'],
      recommendedStack,
      goal,
      activityLevel,
    },
  });
};

// ── GET /api/biometric/stacks ─────────────────────────────────────────────────
const getStacks = async (req, res) => {
  return sendSuccess(res, 200, 'Supplement stacks', { stacks: STACKS });
};

module.exports = { calculate, getStacks };
