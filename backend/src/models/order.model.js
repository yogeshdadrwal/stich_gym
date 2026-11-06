'use strict';

const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const orderItemSchema = new mongoose.Schema({
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true, min: 1 },
  flavour:   { type: String },
  size:      { type: String },
  thumbnail: { type: String },
}, { _id: true });

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone:    { type: String, required: true },
  line1:    { type: String, required: true },
  line2:    { type: String },
  city:     { type: String, required: true },
  state:    { type: String, required: true },
  pincode:  { type: String, required: true },
}, { _id: false });

const paymentSchema = new mongoose.Schema({
  method:        { type: String, enum: ['UPI', 'Card', 'COD'], required: true },
  status:        { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  transactionId: { type: String },
  paidAt:        { type: Date },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    default: () => `STX-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 4).toUpperCase()}`,
  },

  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestName: { type: String },   // for non-logged-in users
  guestEmail:{ type: String },

  items:           [orderItemSchema],
  shippingAddress: { type: addressSchema, required: true },
  payment:         { type: paymentSchema, required: true },

  // Pricing breakdown
  itemsTotal:    { type: Number, required: true },
  shipping:      { type: Number, default: 0 },
  gst:           { type: Number, default: 0 },
  promoDiscount: { type: Number, default: 0 },
  grandTotal:    { type: Number, required: true },

  // Order lifecycle
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'placed',
  },
  statusHistory: [
    {
      status:    String,
      message:   String,
      timestamp: { type: Date, default: Date.now },
    }
  ],

  trackingNumber: { type: String },
  estimatedDelivery: { type: Date },
  notes: { type: String },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
