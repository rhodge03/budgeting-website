import prisma from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export async function list(householdId: string) {
  return prisma.expenseScenario.findMany({
    where: { householdId },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function create(householdId: string, data: { name: string }) {
  // Snapshot current expenses + buffer into the new scenario
  const [categories, household] = await Promise.all([
    prisma.expenseCategory.findMany({
      where: { householdId },
      orderBy: { sortOrder: 'asc' },
      include: { subCategories: { orderBy: { sortOrder: 'asc' } } },
    }),
    prisma.household.findUnique({ where: { id: householdId } }),
  ]);

  const count = await prisma.expenseScenario.count({ where: { householdId } });

  return prisma.expenseScenario.create({
    data: {
      householdId,
      name: data.name,
      expenseData: JSON.parse(JSON.stringify(categories)),
      expenseBuffer: household?.expenseBuffer ?? 0,
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
 * Switch to a scenario: save current expenses into the previously active scenario,
 * then load the target scenario's expenses into the live tables.
 */
export async function switchTo(id: string, householdId: string) {
  const target = await prisma.expenseScenario.findFirst({ where: { id, householdId } });
  if (!target) throw new NotFoundError('Scenario not found');

  const household = await prisma.household.findUnique({ where: { id: householdId } });
  if (!household) throw new NotFoundError('Household not found');

  // 1. Save current live expenses into the previously active scenario (auto-save)
  if (household.activeExpenseScenarioId && household.activeExpenseScenarioId !== id) {
    const currentCategories = await prisma.expenseCategory.findMany({
      where: { householdId },
      orderBy: { sortOrder: 'asc' },
      include: { subCategories: { orderBy: { sortOrder: 'asc' } } },
    });
    await prisma.expenseScenario.update({
      where: { id: household.activeExpenseScenarioId },
      data: {
        expenseData: JSON.parse(JSON.stringify(currentCategories)),
        expenseBuffer: household.expenseBuffer,
      },
    });
  }

  // 2. Delete current live expense categories
  await prisma.expenseCategory.deleteMany({ where: { householdId } });

  // 3. Recreate from the target scenario's data
  const scenarioCategories = target.expenseData as any[];
  for (const cat of scenarioCategories) {
    await prisma.expenseCategory.create({
      data: {
        householdId,
        name: cat.name,
        isDefault: cat.isDefault ?? false,
        isCollapsed: cat.isCollapsed ?? false,
        sortOrder: cat.sortOrder ?? 0,
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

  // 4. Update household: set active scenario + buffer
  await prisma.household.update({
    where: { id: householdId },
    data: {
      activeExpenseScenarioId: id,
      expenseBuffer: target.expenseBuffer,
    },
  });

  // 5. Return the full updated state
  const [updatedHousehold, updatedCategories, scenarios] = await Promise.all([
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
  ]);

  return { household: updatedHousehold, expenseCategories: updatedCategories, expenseScenarios: scenarios };
}

/**
 * Save current live expenses into the active scenario without switching.
 */
export async function saveCurrent(householdId: string) {
  const household = await prisma.household.findUnique({ where: { id: householdId } });
  if (!household?.activeExpenseScenarioId) return null;

  const categories = await prisma.expenseCategory.findMany({
    where: { householdId },
    orderBy: { sortOrder: 'asc' },
    include: { subCategories: { orderBy: { sortOrder: 'asc' } } },
  });

  return prisma.expenseScenario.update({
    where: { id: household.activeExpenseScenarioId },
    data: {
      expenseData: JSON.parse(JSON.stringify(categories)),
      expenseBuffer: household.expenseBuffer,
    },
  });
}
