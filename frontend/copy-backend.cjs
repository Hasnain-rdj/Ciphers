const fs = require('fs-extra');
const path = require('path');

const backendSource = path.join(__dirname, '../backend');
const backendDest = path.join(__dirname, 'backend-bundled');

console.log('Copying backend files...');
console.log('From:', backendSource);
console.log('To:', backendDest);

// Remove old bundled backend if it exists
if (fs.existsSync(backendDest)) {
  fs.removeSync(backendDest);
}

// Copy backend files
fs.copySync(backendSource, backendDest, {
  filter: (src) => {
    // Exclude node_modules from source - we'll install fresh
    return !src.includes('node_modules');
  }
});

console.log('Backend files copied successfully!');
console.log('\nNow installing backend dependencies...');

// Install backend dependencies
const { execSync } = require('child_process');
try {
  execSync('npm install --production', { 
    cwd: backendDest,
    stdio: 'inherit'
  });
  console.log('Backend dependencies installed successfully!');
} catch (error) {
  console.error('Failed to install backend dependencies:', error.message);
  process.exit(1);
}
