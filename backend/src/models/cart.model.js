'use strict';

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  flavour:  { type: String },
  size:     { type: String },
  thumbnail:{ type: String },
}, { _id: true });

const cartSchema = new mongoose.Schema({
  // For logged-in users
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true },
  // For guest users (session-based)
  sessionId: { type: String, unique: true, sparse: true },

  items: [cartItemSchema],

  // Computed totals (kept in sync)
  itemsTotal: { type: Number, default: 0 },
  discount:   { type: Number, default: 0 },
  shipping:   { type: Number, default: 0 },
  gst:        { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },

  promoCode: { type: String },
  promoDiscount: { type: Number, default: 0 },
}, {
  timestamps: true,
});

// Recalculate totals before saving
cartSchema.pre('save', function (next) {
  const FREE_SHIPPING_THRESHOLD = 999;
  const GST_RATE = 0.18;
  const SHIPPING_COST = 99;

  this.itemsTotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  this.shipping = this.itemsTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  this.gst = Math.round((this.itemsTotal) * GST_RATE);
  this.grandTotal = this.itemsTotal + this.shipping + this.gst - this.promoDiscount;
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
