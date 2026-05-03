import { PrismaClient } from '@prisma/client';

async function test() {
  const prisma = new PrismaClient();
  console.log('Checking manualTransaction property...');
  if ('manualTransaction' in prisma) {
    console.log('✅ prisma.manualTransaction exists!');
  } else {
    console.log('❌ prisma.manualTransaction DOES NOT exist!');
    console.log('Available properties:', Object.keys(prisma).filter(k => !k.startsWith('$')));
  }
  await prisma.$disconnect();
}

test().catch(console.error);
