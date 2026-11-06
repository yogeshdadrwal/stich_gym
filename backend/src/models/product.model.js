'use strict';

const mongoose = require('mongoose');

const nutritionFactSchema = new mongoose.Schema({
  servingSize:   { type: String },     // e.g. "30g"
  servingsPerContainer: { type: Number },
  calories:      { type: Number },
  protein:       { type: Number },     // grams
  carbohydrates: { type: Number },     // grams
  fat:           { type: Number },     // grams
  sugar:         { type: Number },
  sodium:        { type: Number },     // mg
  fibre:         { type: Number },
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:      { type: String, required: true },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  brand: {
    type: String,
    default: 'Vortex Labs',
  },
  category: {
    type: String,
    required: true,
    enum: ['Protein', 'Pre-Workout', 'Creatine', 'BCAA', 'Mass Gainer', 'Recovery', 'Vitamins', 'Other'],
  },
  description: { type: String },
  shortDescription: { type: String },

  // Pricing
  price:         { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },            // for showing strike-through
  discount:      { type: Number, default: 0 }, // percentage

  // Variants
  flavours: {
    type: [String],
    default: [],
  },
  sizes: [
    {
      label:    { type: String },   // e.g. "1kg", "2kg"
      weightGrams: { type: Number },
      price:    { type: Number },
      stock:    { type: Number, default: 100 },
    }
  ],

  // Media
  images: { type: [String], default: [] }, // URLs or filenames
  thumbnail: { type: String },

  // Nutrition
  nutritionFacts: nutritionFactSchema,

  // Reviews & Rating
  reviews:       [reviewSchema],
  rating:        { type: Number, default: 0 },
  numReviews:    { type: Number, default: 0 },

  // Stock
  stock:         { type: Number, default: 100 },
  isFeatured:    { type: Boolean, default: false },
  isActive:      { type: Boolean, default: true },

  tags: [String],
}, {
  timestamps: true,
});

// Auto-generate slug from name
productSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Recalculate average rating when a review is added
productSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.rating = Math.round((total / this.reviews.length) * 10) / 10;
    this.numReviews = this.reviews.length;
  }
};

module.exports = mongoose.model('Product', productSchema);
