import prisma from '../config/database.js';

export async function getSnapshot(householdId: string) {
  const [household, earners, expenseCategories] = await Promise.all([
    prisma.household.findUnique({ where: { id: householdId } }),
    prisma.earner.findMany({
      where: { householdId, isArchived: false },
      orderBy: { sortOrder: 'asc' },
      include: {
        incomeEntries: { orderBy: { sortOrder: 'asc' } },
        savingsBalance: true,
        retirementSettings: true,
        rateOfReturn: true,
        itemizedDeductions: { orderBy: { createdAt: 'asc' } },
      },
    }),
    prisma.expenseCategory.findMany({
      where: { householdId },
      orderBy: { sortOrder: 'asc' },
      include: {
        subCategories: { orderBy: { sortOrder: 'asc' } },
      },
    }),
  ]);

  return { household, earners, expenseCategories };
}

export async function updateHousehold(householdId: string, data: {
  name?: string;
  expenseBuffer?: number;
}) {
  return prisma.household.update({
    where: { id: householdId },
    data,
  });
}
