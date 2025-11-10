#!/usr/bin/env node

/**
 * Script tự động detect port Next.js và start ngrok
 * Cross-platform (Windows, Mac, Linux)
 * Usage: node scripts/start-ngrok.js [port]
 */

const { exec, spawn } = require('child_process');
const http = require('http');
const { promisify } = require('util');

const execAsync = promisify(exec);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check if port is in use
async function checkPort(port) {
  return new Promise((resolve) => {
    const server = http
      .createServer()
      .listen(port, () => {
        server.once('close', () => resolve(false));
        server.close();
      })
      .on('error', () => resolve(true));
  });
}

// Check if service is running on port (by trying to connect)
async function isServiceRunning(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}`, (res) => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Find Next.js port
async function findNextjsPort() {
  log('🔍 Searching for Next.js server...', 'yellow');
  
  const ports = [3000, 3001, 3002, 3003, 3004, 3005];
  
  for (const port of ports) {
    const inUse = await checkPort(port);
    if (inUse) {
      const isRunning = await isServiceRunning(port);
      if (isRunning) {
        log(`✅ Found Next.js running on port ${port}`, 'green');
        return port;
      }
    }
  }
  
  log('❌ Next.js server not found!', 'red');
  log('💡 Please start Next.js first: npm run dev', 'yellow');
  return null;
}

// Check if ngrok is installed
async function checkNgrok() {
  try {
    await execAsync('ngrok version');
    return true;
  } catch (error) {
    return false;
  }
}

// Stop existing ngrok processes
async function stopNgrok() {
  try {
    if (process.platform === 'win32') {
      await execAsync('taskkill /F /IM ngrok.exe 2>nul || exit 0');
    } else {
      await execAsync('pkill -x ngrok 2>/dev/null || pkill -f "ngrok http" 2>/dev/null || true');
    }
  } catch (error) {
    // Ignore errors
  }
}

// Start ngrok
function startNgrok(port) {
  log('🚀 Starting ngrok tunnel...', 'green');
  log('', 'reset');
  log(`📋 Ngrok Dashboard: http://localhost:4040`, 'blue');
  log(`📋 Local Server: http://localhost:${port}`, 'blue');
  log('', 'reset');
  log('⚠️  Copy the forwarding URL from ngrok output above!', 'yellow');
  log('', 'reset');
  
  const ngrok = spawn('ngrok', ['http', port.toString()], {
    stdio: 'inherit',
    shell: true,
  });
  
  ngrok.on('error', (error) => {
    log(`❌ Error starting ngrok: ${error.message}`, 'red');
    process.exit(1);
  });
  
  process.on('SIGINT', () => {
    log('\n🛑 Stopping ngrok...', 'yellow');
    ngrok.kill();
    process.exit(0);
  });
}

// Main function
async function main() {
  log('========================================', 'blue');
  log('  NGROK AUTO-START SCRIPT', 'blue');
  log('========================================', 'blue');
  log('', 'reset');
  
  // Get port from argument or find it
  let port = process.argv[2];
  
  if (port) {
    port = parseInt(port, 10);
    log(`📌 Using provided port: ${port}`, 'blue');
    
    const inUse = await checkPort(port);
    if (!inUse) {
      log(`❌ Port ${port} is not in use!`, 'red');
      log(`💡 Please start Next.js on port ${port} first`, 'yellow');
      process.exit(1);
    }
  } else {
    port = await findNextjsPort();
    if (!port) {
      process.exit(1);
    }
  }
  
  // Check ngrok
  const hasNgrok = await checkNgrok();
  if (!hasNgrok) {
    log('❌ ngrok not found!', 'red');
    log('💡 Install ngrok:', 'yellow');
    log('   npm install -g ngrok', 'reset');
    log('   or download from https://ngrok.com/download', 'reset');
    process.exit(1);
  }
  
  // Stop existing ngrok
  const hasNgrokRunning = await checkNgrok();
  if (hasNgrokRunning) {
    log('⚠️  Stopping existing ngrok process...', 'yellow');
    await stopNgrok();
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Start ngrok
  startNgrok(port);
}

main().catch((error) => {
  log(`❌ Error: ${error.message}`, 'red');
  process.exit(1);
});

