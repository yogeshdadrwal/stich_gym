'use strict';

const express = require('express');
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const { placeOrder, getMyOrders, getOrderById, updateOrderStatus } = require('../controllers/order.controller');
const { adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/',          optionalAuth, placeOrder);              // POST /api/orders
router.get('/my-orders',  protect,      getMyOrders);             // GET  /api/orders/my-orders
router.get('/:id',        optionalAuth, getOrderById);            // GET  /api/orders/:id
router.put('/:id/status', protect, adminOnly, updateOrderStatus); // PUT  /api/orders/:id/status (admin)

module.exports = router;
