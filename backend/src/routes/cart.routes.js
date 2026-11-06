'use strict';

const express = require('express');
const { optionalAuth } = require('../middleware/auth.middleware');
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart, applyPromo } = require('../controllers/cart.controller');

const router = express.Router();

// All cart routes support both guests (sessionId) and logged-in users (JWT)
router.use(optionalAuth);

router.get('/',              getCart);         // GET  /api/cart
router.post('/add',          addToCart);       // POST /api/cart/add
router.put('/item/:itemId',  updateCartItem);  // PUT  /api/cart/item/:itemId
router.delete('/item/:itemId', removeFromCart);// DELETE /api/cart/item/:itemId
router.delete('/clear',      clearCart);       // DELETE /api/cart/clear
router.post('/promo',        applyPromo);      // POST /api/cart/promo

module.exports = router;
