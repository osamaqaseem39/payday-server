const mongoose = require('mongoose');

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log('⚠️  MONGODB_URI environment variable not set');
      console.log('💡 Please set MONGODB_URI in your environment variables');
      console.log('💡 For Vercel deployment, add it in the Vercel dashboard');
      return false;
    }
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('💡 Please check your MONGODB_URI and network connection');
    console.log('💡 For Vercel deployment, ensure MONGODB_URI is set in environment variables');
    return false;
  }
};

module.exports = connectDB; 