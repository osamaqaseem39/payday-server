const path = require('path');
const dotenv = require('dotenv');

// Load .env file explicitly
const envPath = path.join(__dirname, '.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

console.log('Environment variables loaded:');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET);

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined!');
  process.exit(1);
}

// Test MongoDB connection
const mongoose = require('mongoose');

console.log('\nTesting MongoDB connection...');
console.log('URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // 5 second timeout
  socketTimeoutMS: 45000, // 45 second timeout
})
.then(() => {
  console.log('✅ MongoDB connected successfully!');
  process.exit(0);
})
.catch((error) => {
  console.error('❌ MongoDB connection failed:');
  console.error('Error name:', error.name);
  console.error('Error message:', error.message);
  console.error('Full error:', error);
  process.exit(1);
}); 