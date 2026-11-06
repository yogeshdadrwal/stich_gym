'use strict';

const { sendSuccess, sendError } = require('../utils/helpers');
const { getIsConnected } = require('../config/db');

// ─── Promo codes ──────────────────────────────────────────────────────────────
const PROMO_CODES = {
  STITCH10:  { type: 'percent', value: 10,   label: '10% off'  },
  VORTEX20:  { type: 'percent', value: 20,   label: '20% off'  },
  FLAT200:   { type: 'flat',    value: 200,  label: '₹200 off' },
  NEWUSER:   { type: 'percent', value: 15,   label: '15% off for new users' },
};

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 99;
const GST_RATE = 0.18;

// ─── Helper: build/recalculate a cart object ──────────────────────────────────
const computeTotals = (cart) => {
  const itemsTotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = itemsTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const gst = Math.round(itemsTotal * GST_RATE);
  const grandTotal = itemsTotal + shipping + gst - (cart.promoDiscount || 0);
  return { ...cart, itemsTotal, shipping, gst, grandTotal };
};

// ─── In-memory cart store ─────────────────────────────────────────────────────
const getCartKey = (req) => {
  if (req.user) return `user_${req.user._id || req.user.id}`;
  return `session_${req.headers['x-session-id'] || req.ip}`;
};

const getInMemoryStore = () => require('../config/data').carts;

// ─── GET /api/cart ─────────────────────────────────────────────────────────────
const getCart = async (req, res) => {
  try {
    const key = getCartKey(req);
    const store = getInMemoryStore();
    const cart = store[key] || { items: [], promoCode: null, promoDiscount: 0 };
    return sendSuccess(res, 200, 'Cart fetched', { cart: computeTotals(cart) });
  } catch (err) {
    return sendError(res, 500, 'Failed to fetch cart');
  }
};

// ─── POST /api/cart/add ────────────────────────────────────────────────────────
const addToCart = async (req, res) => {
  const { productId, name, price, quantity = 1, flavour, size, thumbnail } = req.body;
  if (!productId || !name || !price) {
    return sendError(res, 400, 'productId, name, and price are required');
  }

  try {
    const key = getCartKey(req);
    const store = getInMemoryStore();
    if (!store[key]) store[key] = { items: [], promoCode: null, promoDiscount: 0 };
    const cart = store[key];

    // Check if same product+flavour+size already in cart
    const existing = cart.items.find(
      i => i.productId === productId && i.flavour === flavour && i.size === size
    );
    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({
        _id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        productId, name, price: Number(price), quantity: Number(quantity),
        flavour, size, thumbnail,
      });
    }

    return sendSuccess(res, 200, 'Item added to cart', { cart: computeTotals(cart) });
  } catch (err) {
    console.error('addToCart error:', err);
    return sendError(res, 500, 'Failed to add item to cart');
  }
};

// ─── PUT /api/cart/item/:itemId ────────────────────────────────────────────────
const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  if (quantity === undefined) return sendError(res, 400, 'quantity is required');

  try {
    const key = getCartKey(req);
    const store = getInMemoryStore();
    const cart = store[key];
    if (!cart) return sendError(res, 404, 'Cart not found');

    const item = cart.items.find(i => i._id === req.params.itemId);
    if (!item) return sendError(res, 404, 'Cart item not found');

    if (Number(quantity) <= 0) {
      cart.items = cart.items.filter(i => i._id !== req.params.itemId);
    } else {
      item.quantity = Number(quantity);
    }

    return sendSuccess(res, 200, 'Cart updated', { cart: computeTotals(cart) });
  } catch (err) {
    return sendError(res, 500, 'Failed to update cart item');
  }
};

// ─── DELETE /api/cart/item/:itemId ─────────────────────────────────────────────
const removeFromCart = async (req, res) => {
  try {
    const key = getCartKey(req);
    const store = getInMemoryStore();
    const cart = store[key];
    if (!cart) return sendError(res, 404, 'Cart not found');
    cart.items = cart.items.filter(i => i._id !== req.params.itemId);
    return sendSuccess(res, 200, 'Item removed', { cart: computeTotals(cart) });
  } catch (err) {
    return sendError(res, 500, 'Failed to remove item');
  }
};

// ─── DELETE /api/cart/clear ────────────────────────────────────────────────────
const clearCart = async (req, res) => {
  const key = getCartKey(req);
  const store = getInMemoryStore();
  store[key] = { items: [], promoCode: null, promoDiscount: 0 };
  return sendSuccess(res, 200, 'Cart cleared');
};

// ─── POST /api/cart/promo ──────────────────────────────────────────────────────
const applyPromo = async (req, res) => {
  const { code } = req.body;
  if (!code) return sendError(res, 400, 'Promo code is required');

  const promo = PROMO_CODES[code.toUpperCase()];
  if (!promo) return sendError(res, 400, 'Invalid promo code');

  const key = getCartKey(req);
  const store = getInMemoryStore();
  const cart = store[key];
  if (!cart || cart.items.length === 0) return sendError(res, 400, 'Cart is empty');

  const itemsTotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  cart.promoCode = code.toUpperCase();
  cart.promoDiscount = promo.type === 'percent'
    ? Math.round(itemsTotal * promo.value / 100)
    : promo.value;

  return sendSuccess(res, 200, `Promo applied: ${promo.label}`, {
    cart: computeTotals(cart),
    promoLabel: promo.label,
    promoDiscount: cart.promoDiscount,
  });
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart, applyPromo };
