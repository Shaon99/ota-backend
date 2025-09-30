const bcrypt = require('bcrypt');
const config = require('../config/env');
const database = require('../config/database');

async function main() {
  try {
    // Connect to database
    await database.connect();
    const prisma = database.getClient();

    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', config.BCRYPT_ROUNDS);

    // Create super admin user
    await prisma.admin.upsert({
      where: { email: 'superadmin@ota.com' },
      update: {},
      create: {
        name: 'Super Admin',
        email: 'superadmin@ota.com',
        password: hashedPassword,
        role: 'superadmin',
        isActive: true,
      },
    });
  } catch (error) {
    throw error;
  }
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await database.disconnect();
  });
