import prisma from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export async function update(earnerId: string, householdId: string, data: {
  generalSavingsBalance?: number;
  fourOneKBalance?: number;
  contributionPercent?: number;
  employerMatchPercent?: number;
  salaryGrowthRate?: number;
}) {
  const earner = await prisma.earner.findFirst({ where: { id: earnerId, householdId } });
  if (!earner) throw new NotFoundError('Earner not found');

  return prisma.savingsBalance.upsert({
    where: { earnerId },
    update: data,
    create: { earnerId, ...data },
  });
}
