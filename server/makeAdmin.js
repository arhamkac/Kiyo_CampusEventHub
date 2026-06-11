const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.updateMany({ data: { role: 'ADMIN' } }).then(() => console.log('All users are now ADMINs')).finally(() => prisma.$disconnect());
