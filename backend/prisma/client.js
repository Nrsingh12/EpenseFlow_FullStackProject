const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

// Handle Prisma connection errors
prisma.$connect()
  .then(() => {
    console.log('✅ Prisma Client connected to database');
  })
  .catch((error) => {
    console.error('❌ Prisma Client connection error:', error);
  });

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;

