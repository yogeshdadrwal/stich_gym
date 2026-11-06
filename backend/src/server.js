'use strict';

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║   🏋️  STITCH | VORTEX LABS BACKEND API  🏋️   ║');
    console.log('╚══════════════════════════════════════════════╝');
    console.log(`  ✅ Server running on     → http://localhost:${PORT}`);
    console.log(`  🌍 Environment           → ${process.env.NODE_ENV}`);
    console.log(`  📦 API Base URL          → http://localhost:${PORT}/api`);
    console.log('');
  });
}).catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err.message);
  console.log('');
  console.log('⚠️  Running WITHOUT database (in-memory mode)');
  console.log('   Products and orders will not persist between restarts.');
  console.log('');
  // Still start server so frontend can hit it
  app.listen(PORT, () => {
    console.log(`  ✅ Server (no-db mode) → http://localhost:${PORT}`);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
});
