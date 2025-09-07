const bcrypt = require('bcryptjs');
const { PrismaClient, ManagementRole } = require('@prisma/client');
const prisma = new PrismaClient();

bcrypt.hash('Admin1234', 10).then(hashed => {
  prisma.admin.create({
    data: {
      name: 'Admin User',
      email: 'dpvpsuper@gmail.com',
      password: hashed,
      role: ManagementRole.ADMIN
    }
  }).then(() => {
    console.log('✅ Admin created successfully');
    prisma.$disconnect().then(() => process.exit(0));
  }).catch(err => {
    console.error(err);
    prisma.$disconnect().then(() => process.exit(1));
  });
});

