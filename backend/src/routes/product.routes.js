'use strict';

const express = require('express');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getFeaturedProducts,
} = require('../controllers/product.controller');

const router = express.Router();

// ── Public routes ─────────────────────────────────────────────────────────────
router.get('/',             getAllProducts);         // GET /api/products?category=Protein&sort=price_asc
router.get('/featured',     getFeaturedProducts);    // GET /api/products/featured
router.get('/slug/:slug',   getProductBySlug);       // GET /api/products/slug/iso-matrix-isolate
router.get('/:id',          getProductById);         // GET /api/products/prod_001

// ── Protected: add review ─────────────────────────────────────────────────────
router.post('/:id/reviews', protect, addReview);     // POST /api/products/:id/reviews

// ── Admin only ────────────────────────────────────────────────────────────────
router.post('/',      protect, adminOnly, createProduct);        // POST /api/products
router.put('/:id',    protect, adminOnly, updateProduct);        // PUT  /api/products/:id
router.delete('/:id', protect, adminOnly, deleteProduct);        // DELETE /api/products/:id

module.exports = router;
