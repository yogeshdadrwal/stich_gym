'use strict';

const express = require('express');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { getProfile, updateProfile, getAllUsers } = require('../controllers/user.controller');

const router = express.Router();

router.get('/profile',    protect,              getProfile);    // GET  /api/users/profile
router.put('/profile',    protect,              updateProfile); // PUT  /api/users/profile
router.get('/',           protect, adminOnly,   getAllUsers);   // GET  /api/users  (admin)

module.exports = router;
