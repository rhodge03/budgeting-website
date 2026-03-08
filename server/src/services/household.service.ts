import prisma from '../config/database.js';

export async function getSnapshot(householdId: string) {
  const [household, earners, expenseCategories, expenseScenarios, homePurchase] = await Promise.all([
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
    prisma.expenseScenario.findMany({
      where: { householdId },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.homePurchase.findUnique({ where: { householdId } }).catch(() => null),
  ]);

  return { household, earners, expenseCategories, expenseScenarios, homePurchase };
}

export async function updateHousehold(householdId: string, data: {
  name?: string;
  expenseBuffer?: number;
  inflationMode?: string;
}) {
  return prisma.household.update({
    where: { id: householdId },
    data,
  });
}
