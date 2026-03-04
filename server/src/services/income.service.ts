import prisma from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export async function listByEarner(earnerId: string, householdId: string) {
  // Verify earner belongs to household
  const earner = await prisma.earner.findFirst({ where: { id: earnerId, householdId } });
  if (!earner) throw new NotFoundError('Earner not found');

  return prisma.incomeEntry.findMany({
    where: { earnerId },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function create(earnerId: string, householdId: string, data: {
  label: string;
  amount: number;
  isTaxable?: boolean;
  durationYears?: number | null;
  growthRate?: number | null;
}) {
  const earner = await prisma.earner.findFirst({ where: { id: earnerId, householdId } });
  if (!earner) throw new NotFoundError('Earner not found');

  const count = await prisma.incomeEntry.count({ where: { earnerId } });
  return prisma.incomeEntry.create({
    data: {
      earnerId,
      label: data.label,
      amount: data.amount,
      isTaxable: data.isTaxable ?? true,
      durationYears: data.durationYears ?? null,
      growthRate: data.growthRate ?? null,
      sortOrder: count,
    },
  });
}

export async function update(id: string, householdId: string, data: {
  label?: string;
  amount?: number;
  isTaxable?: boolean;
  durationYears?: number | null;
  growthRate?: number | null;
  sortOrder?: number;
}) {
  const entry = await prisma.incomeEntry.findUnique({
    where: { id },
    include: { earner: true },
  });
  if (!entry || entry.earner.householdId !== householdId) {
    throw new NotFoundError('Income entry not found');
  }

  return prisma.incomeEntry.update({ where: { id }, data });
}

export async function remove(id: string, householdId: string) {
  const entry = await prisma.incomeEntry.findUnique({
    where: { id },
    include: { earner: true },
  });
  if (!entry || entry.earner.householdId !== householdId) {
    throw new NotFoundError('Income entry not found');
  }

  await prisma.incomeEntry.delete({ where: { id } });
}

export async function bulkUpsert(earnerId: string, householdId: string, entries: {
  id?: string;
  label: string;
  amount: number;
  isTaxable: boolean;
  durationYears?: number | null;
  growthRate?: number | null;
  sortOrder: number;
}[]) {
  const earner = await prisma.earner.findFirst({ where: { id: earnerId, householdId } });
  if (!earner) throw new NotFoundError('Earner not found');

  // Delete entries not in the update list
  const keepIds = entries.filter((e) => e.id).map((e) => e.id!);
  await prisma.incomeEntry.deleteMany({
    where: { earnerId, id: { notIn: keepIds } },
  });

  // Upsert each entry
  const results = await Promise.all(
    entries.map((entry) =>
      entry.id
        ? prisma.incomeEntry.update({
            where: { id: entry.id },
            data: {
              label: entry.label,
              amount: entry.amount,
              isTaxable: entry.isTaxable,
              durationYears: entry.durationYears ?? null,
              growthRate: entry.growthRate ?? null,
              sortOrder: entry.sortOrder,
            },
          })
        : prisma.incomeEntry.create({
            data: {
              earnerId,
              label: entry.label,
              amount: entry.amount,
              isTaxable: entry.isTaxable,
              durationYears: entry.durationYears ?? null,
              growthRate: entry.growthRate ?? null,
              sortOrder: entry.sortOrder,
            },
          }),
    ),
  );

  return results;
}
