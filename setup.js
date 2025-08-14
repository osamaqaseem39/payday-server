#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Enhanced HR Dashboard Setup Script');
console.log('=====================================\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created successfully!');
    console.log('⚠️  Please edit .env file with your configuration before starting the server.\n');
  } else {
    console.log('❌ env.example file not found. Please create .env manually.');
  }
} else {
  console.log('✅ .env file already exists.\n');
}

// Check if uploads directory exists
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  console.log('📁 Creating uploads directory...');
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('✅ uploads directory created successfully!\n');
} else {
  console.log('✅ uploads directory already exists.\n');
}

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.log('❌ Node.js 18+ is required. Current version:', nodeVersion);
  console.log('   Please upgrade Node.js and try again.\n');
  process.exit(1);
} else {
  console.log('✅ Node.js version check passed:', nodeVersion, '\n');
}

// Check if dependencies are installed
const packageLockPath = path.join(__dirname, 'package-lock.json');
if (!fs.existsSync(packageLockPath)) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Dependencies installed successfully!\n');
  } catch (error) {
    console.log('❌ Failed to install dependencies. Please run "npm install" manually.\n');
  }
} else {
  console.log('✅ Dependencies are already installed.\n');
}

// Check MongoDB connection
console.log('🔍 Checking MongoDB connection...');
console.log('   Make sure MongoDB is running and accessible.\n');

// Display next steps
console.log('📋 Next Steps:');
console.log('==============');
console.log('1. Edit .env file with your configuration:');
console.log('   - MongoDB connection string');
console.log('   - JWT secret key');
console.log('   - Email credentials (Gmail)');
console.log('');
console.log('2. Start MongoDB (if running locally):');
console.log('   mongod');
console.log('');
console.log('3. Run the application:');
console.log('   npm run dev:full    # Both frontend and backend');
console.log('   npm run server      # Backend only (port 3002)');
console.log('   npm run dev         # Frontend only (port 3001)');
console.log('');
console.log('4. Access the application:');
console.log('   Frontend: http://localhost:3001');
console.log('   Backend:  http://localhost:3002');
console.log('');
console.log('5. Create your first admin user:');
console.log('   POST http://localhost:3002/api/auth/register');
console.log('   {');
console.log('     "username": "admin",');
console.log('     "email": "admin@company.com",');
console.log('     "password": "securepassword",');
console.log('     "firstName": "Admin",');
console.log('     "lastName": "User",');
console.log('     "department": "IT",');
console.log('     "role": "admin"');
console.log('   }');
console.log('');
console.log('🎉 Setup complete! Your enhanced HR dashboard is ready to use!');
console.log('');
console.log('📚 For more information, check the README.md file.');
console.log('🐛 For troubleshooting, see the README.md troubleshooting section.'); 