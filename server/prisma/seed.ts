import { PrismaClient } from '../src/generated/prisma/client.js';
import { DEFAULT_EXPENSE_CATEGORIES } from '../../shared/src/constants/defaultCategories.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a test household if none exists
  const existingHousehold = await prisma.household.findFirst();
  if (existingHousehold) {
    console.log('Database already has data, skipping seed.');
    return;
  }

  console.log('No existing data found. Seed will run during signup for new households.');
  console.log(`Default categories configured: ${DEFAULT_EXPENSE_CATEGORIES.length} categories`);
  for (const cat of DEFAULT_EXPENSE_CATEGORIES) {
    console.log(`  - ${cat.name} (${cat.subCategories.length} sub-categories)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
