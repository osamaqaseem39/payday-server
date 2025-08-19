const fs = require('fs');
const path = require('path');

console.log('Current directory:', __dirname);
console.log('Files in directory:');
fs.readdirSync(__dirname).forEach(file => {
  if (file.includes('env')) {
    console.log('Found env file:', file);
  }
});

console.log('\nReading .env file content:');
const envPath = path.join(__dirname, '.env');
try {
  const content = fs.readFileSync(envPath, 'utf8');
  console.log('File content:');
  console.log(content);
  
  // Parse manually
  const lines = content.split('\n');
  console.log('\nParsed lines:');
  lines.forEach((line, index) => {
    if (line.trim() && !line.startsWith('#')) {
      console.log(`Line ${index + 1}: "${line}"`);
    }
  });
  
} catch (error) {
  console.error('Error reading .env file:', error);
} 