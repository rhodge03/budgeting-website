import prisma from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export async function list(householdId: string) {
  return prisma.expenseScenario.findMany({
    where: { householdId },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function create(householdId: string, data: { name: string }) {
  // Snapshot current expenses + buffer + home purchase into the new scenario
  const [categories, household, homePurchase] = await Promise.all([
    prisma.expenseCategory.findMany({
      where: { householdId },
      orderBy: { sortOrder: 'asc' },
      include: { subCategories: { orderBy: { sortOrder: 'asc' } } },
    }),
    prisma.household.findUnique({ where: { id: householdId } }),
    prisma.homePurchase.findUnique({ where: { householdId } }).catch(() => null),
  ]);

  const count = await prisma.expenseScenario.count({ where: { householdId } });

  return prisma.expenseScenario.create({
    data: {
      householdId,
      name: data.name,
      expenseData: JSON.parse(JSON.stringify(categories)),
      expenseBuffer: household?.expenseBuffer ?? 0,
      homePurchase: homePurchase ? JSON.parse(JSON.stringify(homePurchase)) : undefined,
      sortOrder: count,
    },
  });
}

export async function rename(id: string, householdId: string, name: string) {
  const scenario = await prisma.expenseScenario.findFirst({ where: { id, householdId } });
  if (!scenario) throw new NotFoundError('Scenario not found');

  return prisma.expenseScenario.update({
    where: { id },
    data: { name },
  });
}

export async function remove(id: string, householdId: string) {
  const scenario = await prisma.expenseScenario.findFirst({ where: { id, householdId } });
  if (!scenario) throw new NotFoundError('Scenario not found');

  // If this was the active scenario, clear the active pointer
  const household = await prisma.household.findUnique({ where: { id: householdId } });
  if (household?.activeExpenseScenarioId === id) {
    await prisma.household.update({
      where: { id: householdId },
      data: { activeExpenseScenarioId: null },
    });
  }

  await prisma.expenseScenario.delete({ where: { id } });
}

/**
 * Switch to a scenario: save current expenses + home purchase into the previously
 * active scenario, then load the target scenario's data into the live tables.
 */
export async function switchTo(id: string, householdId: string) {
  const target = await prisma.expenseScenario.findFirst({ where: { id, householdId } });
  if (!target) throw new NotFoundError('Scenario not found');

  const household = await prisma.household.findUnique({ where: { id: householdId } });
  if (!household) throw new NotFoundError('Household not found');

  // 1. Save current live data into the previously active scenario (auto-save)
  if (household.activeExpenseScenarioId && household.activeExpenseScenarioId !== id) {
    const [currentCategories, currentHp] = await Promise.all([
      prisma.expenseCategory.findMany({
        where: { householdId },
        orderBy: { sortOrder: 'asc' },
        include: { subCategories: { orderBy: { sortOrder: 'asc' } } },
      }),
      prisma.homePurchase.findUnique({ where: { householdId } }).catch(() => null),
    ]);
    await prisma.expenseScenario.update({
      where: { id: household.activeExpenseScenarioId },
      data: {
        expenseData: JSON.parse(JSON.stringify(currentCategories)),
        expenseBuffer: household.expenseBuffer,
        homePurchase: currentHp ? JSON.parse(JSON.stringify(currentHp)) : null,
      },
    });
  }

  // 2. Delete current live expense categories
  await prisma.expenseCategory.deleteMany({ where: { householdId } });

  // 3. Recreate expense categories from the target scenario's data
  const scenarioCategories = target.expenseData as any[];
  for (const cat of scenarioCategories) {
    await prisma.expenseCategory.create({
      data: {
        householdId,
        name: cat.name,
        isDefault: cat.isDefault ?? false,
        isCollapsed: cat.isCollapsed ?? false,
        sortOrder: cat.sortOrder ?? 0,
        inflationPreset: cat.inflationPreset ?? '20yr',
        customInflationRate: cat.customInflationRate ?? 0,
        subCategories: {
          create: (cat.subCategories || []).map((sub: any) => ({
            name: sub.name,
            amount: sub.amount ?? 0,
            isDefault: sub.isDefault ?? false,
            sortOrder: sub.sortOrder ?? 0,
          })),
        },
      },
    });
  }

  // 4. Restore home purchase from the target scenario
  const targetHp = target.homePurchase as any | null;
  // Delete existing home purchase
  await prisma.homePurchase.deleteMany({ where: { householdId } });
  // Recreate from scenario if it had one
  if (targetHp) {
    await prisma.homePurchase.create({
      data: {
        householdId,
        homePrice: targetHp.homePrice,
        downPayment: targetHp.downPayment,
        interestRate: targetHp.interestRate,
        loanTermYears: targetHp.loanTermYears ?? 30,
        closingCosts: targetHp.closingCosts ?? 3,
        closingCostMode: targetHp.closingCostMode ?? 'percent',
        propertyTax: targetHp.propertyTax ?? 1.2,
        propertyTaxMode: targetHp.propertyTaxMode ?? 'percent',
        homeInsurance: targetHp.homeInsurance ?? 0.5,
        homeInsuranceMode: targetHp.homeInsuranceMode ?? 'percent',
        repairsPct: targetHp.repairsPct ?? 1,
        appreciationRate: targetHp.appreciationRate ?? 3,
      },
    });
  }

  // 5. Update household: set active scenario + buffer
  await prisma.household.update({
    where: { id: householdId },
    data: {
      activeExpenseScenarioId: id,
      expenseBuffer: target.expenseBuffer,
    },
  });

  // 6. Return the full updated state
  const [updatedHousehold, updatedCategories, scenarios, homePurchase] = await Promise.all([
    prisma.household.findUnique({ where: { id: householdId } }),
    prisma.expenseCategory.findMany({
      where: { householdId },
      orderBy: { sortOrder: 'asc' },
      include: { subCategories: { orderBy: { sortOrder: 'asc' } } },
    }),
    prisma.expenseScenario.findMany({
      where: { householdId },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.homePurchase.findUnique({ where: { householdId } }).catch(() => null),
  ]);

  return {
    household: updatedHousehold,
    expenseCategories: updatedCategories,
    expenseScenarios: scenarios,
    homePurchase,
  };
}

/**
 * Save current live expenses + home purchase into the active scenario without switching.
 */
export async function saveCurrent(householdId: string) {
  const household = await prisma.household.findUnique({ where: { id: householdId } });
  if (!household?.activeExpenseScenarioId) return null;

  const [categories, homePurchase] = await Promise.all([
    prisma.expenseCategory.findMany({
      where: { householdId },
      orderBy: { sortOrder: 'asc' },
      include: { subCategories: { orderBy: { sortOrder: 'asc' } } },
    }),
    prisma.homePurchase.findUnique({ where: { householdId } }).catch(() => null),
  ]);

  return prisma.expenseScenario.update({
    where: { id: household.activeExpenseScenarioId },
    data: {
      expenseData: JSON.parse(JSON.stringify(categories)),
      expenseBuffer: household.expenseBuffer,
      homePurchase: homePurchase ? JSON.parse(JSON.stringify(homePurchase)) : null,
    },
  });
}
