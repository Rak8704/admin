import bcrypt from "bcryptjs";

const { PrismaClient, ManagementRole } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin654", 10);

  await prisma.admin.create({
    data: {
      name: "Admin User",
      email: "dpvpsuper@gmail.com",
      password: hashedPassword,
      role: ManagementRole.ADMIN,
    },
  });

  await prisma.admin.create({
    data: {
      name: "Sub-Admin User",
      email: "subadmin@example.com",
      password: hashedPassword,
      role: ManagementRole.SUBADMIN,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });