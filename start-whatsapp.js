console.log('🚀 Starting WhatsApp server...');
console.log('📱 This will start the Baileys WhatsApp server...\n');

// Since we're in a Node.js environment, we need to use the compiled version
// Let's start the Next.js dev server instead which will handle the TypeScript files

console.log('💡 To see the QR code, you need to:');
console.log('1. Start the Next.js server: npm run dev');
console.log('2. Look for "WhatsApp server starting..." in the terminal');
console.log('3. Scan the QR code that appears');
console.log('\n🔄 Starting Next.js server now...\n');

// Start the Next.js server
const { spawn } = require('child_process');
const nextDev = spawn('npm', ['run', 'dev'], { 
  stdio: 'inherit',
  shell: true 
});

nextDev.on('error', (error) => {
  console.error('❌ Error starting Next.js server:', error);
});

nextDev.on('close', (code) => {
  console.log(`\n📱 Next.js server closed with code ${code}`);
});
