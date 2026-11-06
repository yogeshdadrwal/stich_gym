'use strict';

const express = require('express');
const { calculate, getStacks } = require('../controllers/biometric.controller');

const router = express.Router();

router.post('/calculate', calculate);  // POST /api/biometric/calculate
router.get('/stacks',     getStacks);  // GET  /api/biometric/stacks

module.exports = router;
