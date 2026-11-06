'use strict';

const { getIsConnected } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/helpers');

const getStore = () => {
  if (getIsConnected()) {
    return { Product: require('../models/product.model'), inMemory: false };
  }
  return { store: require('../config/data'), inMemory: true };
};

// ── GET /api/products ─────────────────────────────────────────────────────────
const getAllProducts = async (req, res) => {
  try {
    const { category, sort, search, minPrice, maxPrice, featured } = req.query;
    const { Product, store, inMemory } = getStore();

    if (inMemory) {
      let results = [...store.products].filter(p => p.isActive);

      if (category)  results = results.filter(p => p.category === category);
      if (featured)  results = results.filter(p => p.isFeatured);
      if (search)    results = results.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      );
      if (minPrice)  results = results.filter(p => p.price >= Number(minPrice));
      if (maxPrice)  results = results.filter(p => p.price <= Number(maxPrice));

      if (sort === 'price_asc')   results.sort((a, b) => a.price - b.price);
      if (sort === 'price_desc')  results.sort((a, b) => b.price - a.price);
      if (sort === 'rating')      results.sort((a, b) => b.rating - a.rating);
      if (sort === 'newest')      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return sendSuccess(res, 200, 'Products fetched', {
        count: results.length,
        products: results,
      });
    }

    // MongoDB mode
    let query = Product.find({ isActive: true });
    if (category) query = query.where('category').equals(category);
    if (featured) query = query.where('isFeatured').equals(true);
    if (search)   query = query.where('name').regex(new RegExp(search, 'i'));
    if (minPrice) query = query.where('price').gte(Number(minPrice));
    if (maxPrice) query = query.where('price').lte(Number(maxPrice));

    if (sort === 'price_asc')   query = query.sort({ price:  1 });
    else if (sort === 'price_desc') query = query.sort({ price: -1 });
    else if (sort === 'rating') query = query.sort({ rating: -1 });
    else                        query = query.sort({ createdAt: -1 });

    const products = await query.exec();
    return sendSuccess(res, 200, 'Products fetched', { count: products.length, products });
  } catch (err) {
    console.error('getAllProducts error:', err);
    return sendError(res, 500, 'Failed to fetch products');
  }
};

// ── GET /api/products/featured ────────────────────────────────────────────────
const getFeaturedProducts = async (req, res) => {
  try {
    const { Product, store, inMemory } = getStore();
    if (inMemory) {
      const featured = store.products.filter(p => p.isFeatured && p.isActive);
      return sendSuccess(res, 200, 'Featured products', { products: featured });
    }
    const products = await Product.find({ isFeatured: true, isActive: true }).limit(6);
    return sendSuccess(res, 200, 'Featured products', { products });
  } catch (err) {
    return sendError(res, 500, 'Failed to fetch featured products');
  }
};

// ── GET /api/products/:id ─────────────────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const { Product, store, inMemory } = getStore();
    if (inMemory) {
      const product = store.products.find(p => p._id === req.params.id);
      if (!product) return sendError(res, 404, 'Product not found');
      return sendSuccess(res, 200, 'Product fetched', { product });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return sendError(res, 404, 'Product not found');
    return sendSuccess(res, 200, 'Product fetched', { product });
  } catch (err) {
    return sendError(res, 500, 'Failed to fetch product');
  }
};

// ── GET /api/products/slug/:slug ──────────────────────────────────────────────
const getProductBySlug = async (req, res) => {
  try {
    const { Product, store, inMemory } = getStore();
    if (inMemory) {
      const product = store.products.find(p => p.slug === req.params.slug);
      if (!product) return sendError(res, 404, 'Product not found');
      return sendSuccess(res, 200, 'Product fetched', { product });
    }
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return sendError(res, 404, 'Product not found');
    return sendSuccess(res, 200, 'Product fetched', { product });
  } catch (err) {
    return sendError(res, 500, 'Failed to fetch product');
  }
};

// ── POST /api/products ────────────────────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const { Product, store, inMemory } = getStore();
    if (inMemory) {
      const newProduct = { _id: `prod_${Date.now()}`, ...req.body, isActive: true, createdAt: new Date() };
      store.products.push(newProduct);
      return sendSuccess(res, 201, 'Product created', { product: newProduct });
    }
    const product = await Product.create(req.body);
    return sendSuccess(res, 201, 'Product created', { product });
  } catch (err) {
    console.error('createProduct error:', err);
    return sendError(res, 400, err.message || 'Failed to create product');
  }
};

// ── PUT /api/products/:id ─────────────────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const { Product, store, inMemory } = getStore();
    if (inMemory) {
      const idx = store.products.findIndex(p => p._id === req.params.id);
      if (idx === -1) return sendError(res, 404, 'Product not found');
      store.products[idx] = { ...store.products[idx], ...req.body };
      return sendSuccess(res, 200, 'Product updated', { product: store.products[idx] });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return sendError(res, 404, 'Product not found');
    return sendSuccess(res, 200, 'Product updated', { product });
  } catch (err) {
    return sendError(res, 400, err.message || 'Failed to update product');
  }
};

// ── DELETE /api/products/:id ──────────────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const { Product, store, inMemory } = getStore();
    if (inMemory) {
      store.products = store.products.filter(p => p._id !== req.params.id);
      return sendSuccess(res, 200, 'Product deleted');
    }
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    return sendSuccess(res, 200, 'Product deleted');
  } catch (err) {
    return sendError(res, 500, 'Failed to delete product');
  }
};

// ── POST /api/products/:id/reviews ────────────────────────────────────────────
const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || !comment) return sendError(res, 400, 'Rating and comment are required');

  try {
    const { Product, store, inMemory } = getStore();
    if (inMemory) {
      const product = store.products.find(p => p._id === req.params.id);
      if (!product) return sendError(res, 404, 'Product not found');
      product.reviews.push({ name: req.user.name, rating: Number(rating), comment, createdAt: new Date() });
      const total = product.reviews.reduce((s, r) => s + r.rating, 0);
      product.rating = Math.round((total / product.reviews.length) * 10) / 10;
      product.numReviews = product.reviews.length;
      return sendSuccess(res, 201, 'Review added', { product });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return sendError(res, 404, 'Product not found');
    product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
    product.updateRating();
    await product.save();
    return sendSuccess(res, 201, 'Review added', { product });
  } catch (err) {
    return sendError(res, 500, 'Failed to add review');
  }
};

module.exports = {
  getAllProducts, getFeaturedProducts, getProductById, getProductBySlug,
  createProduct, updateProduct, deleteProduct, addReview,
};
