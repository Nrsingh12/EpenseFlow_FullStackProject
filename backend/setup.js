// Setup script to initialize Prisma database
// Run this after installing dependencies: node setup.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('Setting up ExpenseFlow backend...\n');

// Check if .env file exists, create it if not
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('Creating .env file...');
  const envContent = `PORT=5000
JWT_SECRET=your-secret-key-change-in-production
DATABASE_URL=mysql://root:Nishant%402005@localhost:3306/expenseflow
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created\n');
  // Reload env after creating it
  require('dotenv').config({ path: envPath });
}

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env file');
  process.exit(1);
}

console.log(`Using database: ${process.env.DATABASE_URL}\n`);

try {
  console.log('1. Generating Prisma Client...');
  execSync('npx prisma generate', { 
    stdio: 'inherit', 
    env: { ...process.env },
    cwd: __dirname
  });
  
  console.log('\n2. Running database migrations...');
  execSync('npx prisma migrate dev --name init', { 
    stdio: 'inherit', 
    env: { ...process.env },
    cwd: __dirname
  });
  
  console.log('\n✅ Setup complete! You can now start the server with: npm run dev');
} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  process.exit(1);
}

