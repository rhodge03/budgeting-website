import prisma from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export async function list(householdId: string, includeArchived = false) {
  return prisma.earner.findMany({
    where: {
      householdId,
      ...(includeArchived ? {} : { isArchived: false }),
    },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function create(householdId: string, name: string) {
  const count = await prisma.earner.count({ where: { householdId } });
  const earner = await prisma.earner.create({
    data: {
      householdId,
      name,
      isPrimary: count === 0,
      sortOrder: count,
    },
  });

  // Create default related records
  await Promise.all([
    prisma.savingsBalance.create({ data: { earnerId: earner.id } }),
    prisma.retirementSettings.create({ data: { earnerId: earner.id } }),
    prisma.rateOfReturn.create({ data: { earnerId: earner.id } }),
  ]);

  return prisma.earner.findUnique({
    where: { id: earner.id },
    include: {
      incomeEntries: true,
      savingsBalance: true,
      retirementSettings: true,
      rateOfReturn: true,
      itemizedDeductions: true,
    },
  });
}

export async function update(id: string, householdId: string, data: {
  name?: string;
  state?: string;
  filingStatus?: string;
  deductionType?: string;
  dateOfBirth?: string | null;
}) {
  const earner = await prisma.earner.findFirst({ where: { id, householdId } });
  if (!earner) throw new NotFoundError('Earner not found');

  return prisma.earner.update({ where: { id }, data });
}

export async function archive(id: string, householdId: string) {
  const earner = await prisma.earner.findFirst({ where: { id, householdId } });
  if (!earner) throw new NotFoundError('Earner not found');

  return prisma.earner.update({
    where: { id },
    data: { isArchived: !earner.isArchived },
  });
}

export async function remove(id: string, householdId: string) {
  const earner = await prisma.earner.findFirst({ where: { id, householdId } });
  if (!earner) throw new NotFoundError('Earner not found');

  await prisma.earner.delete({ where: { id } });

  // If deleted earner was primary, assign primary to first remaining earner
  if (earner.isPrimary) {
    const first = await prisma.earner.findFirst({
      where: { householdId, isArchived: false },
      orderBy: { sortOrder: 'asc' },
    });
    if (first) {
      await prisma.earner.update({ where: { id: first.id }, data: { isPrimary: true } });
    }
  }
}

export async function setPrimary(id: string, householdId: string) {
  const earner = await prisma.earner.findFirst({ where: { id, householdId } });
  if (!earner) throw new NotFoundError('Earner not found');

  // Clear primary from all earners in household, then set this one
  await prisma.earner.updateMany({
    where: { householdId },
    data: { isPrimary: false },
  });
  return prisma.earner.update({ where: { id }, data: { isPrimary: true } });
}
