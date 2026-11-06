'use strict';

const mongoose = require('mongoose');

// In-memory flag: if MongoDB is not available, we fall back gracefully
let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/stitch_vortex_labs';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // fail fast during dev if no Mongo
    });
    isConnected = true;
    console.log(`  🗄️  MongoDB connected → ${conn.connection.host}`);
  } catch (err) {
    console.warn(`  ⚠️  MongoDB not available (${err.message})`);
    console.warn('  💡 Install MongoDB or use MongoDB Atlas for data persistence.');
    isConnected = false;
    // Don't throw — let server start without DB for in-memory mode
  }
};

const getIsConnected = () => isConnected;

module.exports = connectDB;
module.exports.getIsConnected = getIsConnected;
