import prisma from '../config/database.js';

export async function get(householdId: string) {
  return prisma.homePurchase.findUnique({ where: { householdId } });
}

export async function upsert(householdId: string, data: {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTermYears?: number;
  closingCosts?: number;
  closingCostMode?: string;
  propertyTax?: number;
  propertyTaxMode?: string;
  homeInsurance?: number;
  homeInsuranceMode?: string;
  repairsPct?: number;
  appreciationRate?: number;
}) {
  return prisma.homePurchase.upsert({
    where: { householdId },
    update: data,
    create: { householdId, ...data },
  });
}

export async function remove(householdId: string) {
  const existing = await prisma.homePurchase.findUnique({ where: { householdId } });
  if (!existing) return null;
  return prisma.homePurchase.delete({ where: { householdId } });
}
