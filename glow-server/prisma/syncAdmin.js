// syncAdmin.js - Safely create/update admin without touching existing data
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "glowbeauty@gmail.com";
  const defaultPassword = "glowbeauty1234";

  console.log(`Starting admin credentials sync for ${adminEmail}...`);

  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  // 1. Ensure system_admin role exists
  const systemAdminRole = await prisma.adminRole.upsert({
    where: { name: "system_admin" },
    update: {},
    create: { name: "system_admin" },
  });

  // 2. Ensure User exists and is verified
  let user = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Glow Korean Beauty Admin",
        role: "admin",
        emailVerified: true
      }
    });
    console.log("Created user:", user.email);
  } else {
    user = await prisma.user.update({
      where: { email: adminEmail },
      data: { role: "admin", emailVerified: true }
    });
    console.log("Updated user:", user.email);
  }

  // 3. Ensure credential Account exists with matching password
  const account = await prisma.account.findFirst({
    where: { userId: user.id, providerId: "credential" }
  });

  if (!account) {
    await prisma.account.create({
      data: {
        userId: user.id,
        accountId: user.id,
        providerId: "credential",
        password: hashedPassword
      }
    });
    console.log("Created credential account with password for user:", user.id);
  } else {
    await prisma.account.update({
      where: { id: account.id },
      data: { password: hashedPassword }
    });
    console.log("Updated credential account password for user:", user.id);
  }

  // 4. Ensure AdminUser profile exists
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      name: "Glow Korean Beauty Admin",
      roleId: systemAdminRole.id,
      status: "Active",
    },
    create: {
      name: "Glow Korean Beauty Admin",
      email: adminEmail,
      roleId: systemAdminRole.id,
      status: "Active",
    },
  });

  console.log("\n========================================================");
  console.log("✅ Admin credentials successfully synced!");
  console.log(`   Email:    ${adminEmail}`);
  console.log(`   Password: ${defaultPassword}`);
  console.log("========================================================\n");
}

main()
  .catch((e) => {
    console.error("Error syncing admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
