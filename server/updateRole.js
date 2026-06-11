const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    data: { role: 'ORGANIZER' }
  });
  console.log('Done!');
}
main().finally(() => prisma.$disconnect());
