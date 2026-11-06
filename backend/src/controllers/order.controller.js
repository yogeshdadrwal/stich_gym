'use strict';

const { sendSuccess, sendError } = require('../utils/helpers');
const { getIsConnected } = require('../config/db');

const getOrderStore = () => {
  if (getIsConnected()) {
    return { Order: require('../models/order.model'), inMemory: false };
  }
  return { store: require('../config/data'), inMemory: true };
};

// Generate a readable order ID
const genOrderId = () =>
  `STX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

// ── POST /api/orders ───────────────────────────────────────────────────────────
const placeOrder = async (req, res) => {
  const { items, shippingAddress, payment, guestName, guestEmail, promoCode, promoDiscount = 0 } = req.body;

  if (!items || items.length === 0) return sendError(res, 400, 'No items in order');
  if (!shippingAddress) return sendError(res, 400, 'Shipping address is required');
  if (!payment || !payment.method) return sendError(res, 400, 'Payment method is required');

  const FREE_SHIPPING = 999;
  const GST_RATE = 0.18;
  const SHIPPING = 99;

  const itemsTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = itemsTotal >= FREE_SHIPPING ? 0 : SHIPPING;
  const gst = Math.round(itemsTotal * GST_RATE);
  const grandTotal = itemsTotal + shipping + gst - promoDiscount;

  try {
    const { Order, store, inMemory } = getOrderStore();

    const orderData = {
      orderId: genOrderId(),
      user: req.user ? req.user._id : undefined,
      guestName, guestEmail,
      items,
      shippingAddress,
      payment: { method: payment.method, status: payment.method === 'COD' ? 'pending' : 'paid', transactionId: payment.transactionId },
      itemsTotal, shipping, gst, promoDiscount, grandTotal,
      status: 'placed',
      statusHistory: [{ status: 'placed', message: 'Order placed successfully', timestamp: new Date() }],
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // +5 days
      createdAt: new Date(),
    };

    if (inMemory) {
      store.orders.push(orderData);
      // Clear the user's cart
      const { carts } = require('../config/data');
      const cartKey = req.user ? `user_${req.user._id}` : `session_${req.headers['x-session-id'] || req.ip}`;
      carts[cartKey] = { items: [], promoCode: null, promoDiscount: 0 };
      return sendSuccess(res, 201, 'Order placed successfully! 🎉', { order: orderData });
    }

    const order = await Order.create(orderData);
    return sendSuccess(res, 201, 'Order placed successfully! 🎉', { order });
  } catch (err) {
    console.error('placeOrder error:', err);
    return sendError(res, 500, 'Failed to place order. Please try again.');
  }
};

// ── GET /api/orders/my-orders ──────────────────────────────────────────────────
const getMyOrders = async (req, res) => {
  try {
    const { Order, store, inMemory } = getOrderStore();
    if (inMemory) {
      const userId = String(req.user._id);
      const orders = store.orders.filter(o => o.user && String(o.user) === userId);
      return sendSuccess(res, 200, 'Orders fetched', { orders });
    }
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Orders fetched', { orders });
  } catch (err) {
    return sendError(res, 500, 'Failed to fetch orders');
  }
};

// ── GET /api/orders/:id ────────────────────────────────────────────────────────
const getOrderById = async (req, res) => {
  try {
    const { Order, store, inMemory } = getOrderStore();
    if (inMemory) {
      const order = store.orders.find(o => o.orderId === req.params.id || o._id === req.params.id);
      if (!order) return sendError(res, 404, 'Order not found');
      return sendSuccess(res, 200, 'Order fetched', { order });
    }
    const order = await Order.findOne({ $or: [{ orderId: req.params.id }, { _id: req.params.id }] });
    if (!order) return sendError(res, 404, 'Order not found');
    return sendSuccess(res, 200, 'Order fetched', { order });
  } catch (err) {
    return sendError(res, 500, 'Failed to fetch order');
  }
};

// ── PUT /api/orders/:id/status (admin) ────────────────────────────────────────
const updateOrderStatus = async (req, res) => {
  const { status, message } = req.body;
  const validStatuses = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
  if (!validStatuses.includes(status)) return sendError(res, 400, 'Invalid status');

  try {
    const { Order, store, inMemory } = getOrderStore();
    if (inMemory) {
      const order = store.orders.find(o => o.orderId === req.params.id);
      if (!order) return sendError(res, 404, 'Order not found');
      order.status = status;
      order.statusHistory.push({ status, message: message || `Order ${status}`, timestamp: new Date() });
      return sendSuccess(res, 200, 'Order status updated', { order });
    }
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      {
        status,
        $push: { statusHistory: { status, message: message || `Order ${status}`, timestamp: new Date() } },
      },
      { new: true }
    );
    if (!order) return sendError(res, 404, 'Order not found');
    return sendSuccess(res, 200, 'Order status updated', { order });
  } catch (err) {
    return sendError(res, 500, 'Failed to update order status');
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById, updateOrderStatus };
