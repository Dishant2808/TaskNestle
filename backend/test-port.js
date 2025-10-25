// Test script to verify port binding
const express = require('express');
const app = express();

// Get port from environment
let PORT = parseInt(process.env.PORT) || 5000;

// Validate port number
if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
  console.error(`❌ Invalid port number: ${process.env.PORT}`);
  PORT = 5000;
}

console.log(`🔍 Environment variables:`);
console.log(`   PORT: ${process.env.PORT || 'Not set'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'Not set'}`);
console.log(`🚀 Starting test server on port ${PORT}`);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Test server is running',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Test server is working',
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`✅ Server bound to 0.0.0.0:${PORT}`);
  console.log(`✅ Health check: http://0.0.0.0:${PORT}/health`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});
