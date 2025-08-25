#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Payday Server Quick Setup');
console.log('============================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  const envExample = fs.readFileSync(path.join(__dirname, 'env.example'), 'utf8');
  fs.writeFileSync(envPath, envExample);
  console.log('✅ .env file created');
} else {
  console.log('✅ .env file already exists');
}

// Check environment variables
console.log('\n🔍 Checking environment variables...');
require('dotenv').config();

const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingVars = [];

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
    console.log(`❌ ${varName}: Not set`);
  } else {
    console.log(`✅ ${varName}: Set`);
  }
});

if (missingVars.length > 0) {
  console.log('\n⚠️  Missing required environment variables:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n💡 Please update your .env file with the required variables.');
  console.log('💡 For production deployment, set these in your Vercel dashboard.');
} else {
  console.log('\n✅ All required environment variables are set!');
}

// Test MongoDB connection
console.log('\n🔌 Testing MongoDB connection...');
const mongoose = require('mongoose');

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('✅ MongoDB connection successful!');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log('❌ MongoDB connection failed:');
    console.log(`   Error: ${error.message}`);
    console.log('\n💡 Please check your MONGODB_URI and ensure:');
    console.log('   - MongoDB Atlas cluster is running');
    console.log('   - IP whitelist includes 0.0.0.0/0');
    console.log('   - Username and password are correct');
  });
} else {
  console.log('⚠️  MONGODB_URI not set, skipping connection test');
}

console.log('\n📋 Next Steps:');
console.log('1. If MongoDB connection failed, fix your MONGODB_URI');
console.log('2. Start the server: npm start');
console.log('3. Test the health endpoint: curl http://localhost:3002/api/health');
console.log('4. Create an admin user using the registration endpoint');
console.log('\n📖 For detailed setup instructions, see DEPLOYMENT.md'); 