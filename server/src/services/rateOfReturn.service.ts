import prisma from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export async function update(earnerId: string, householdId: string, data: {
  annualRate?: number;
  benchmarkType?: string | null;
}) {
  const earner = await prisma.earner.findFirst({ where: { id: earnerId, householdId } });
  if (!earner) throw new NotFoundError('Earner not found');

  return prisma.rateOfReturn.upsert({
    where: { earnerId },
    update: data,
    create: { earnerId, ...data },
  });
}
