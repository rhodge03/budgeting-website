import type { PrismaClient } from '../generated/prisma/client.js';
import type { HouseholdSnapshot } from 'shared';

type Tx = Parameters<Parameters<PrismaClient['$transaction']>[0]>[0];

export async function mergeGuestData(
  tx: Tx,
  householdId: string,
  guestSnapshot: HouseholdSnapshot,
): Promise<void> {
  // Update household name/buffer from guest data
  await tx.household.update({
    where: { id: householdId },
    data: {
      name: guestSnapshot.household.name,
      expenseBuffer: guestSnapshot.household.expenseBuffer,
      inflationMode: (guestSnapshot.household as any).inflationMode ?? 'simple',
    },
  });

  // Replace any default categories with guest categories
  await tx.expenseCategory.deleteMany({ where: { householdId } });

  for (let i = 0; i < guestSnapshot.expenseCategories.length; i++) {
    const cat = guestSnapshot.expenseCategories[i];
    await tx.expenseCategory.create({
      data: {
        householdId,
        name: cat.name,
        isDefault: cat.isDefault,
        isCollapsed: cat.isCollapsed,
        sortOrder: i,
        inflationPreset: cat.inflationPreset ?? '20yr',
        customInflationRate: cat.customInflationRate ?? 0,
        subCategories: {
          create: cat.subCategories.map((sub, j) => ({
            name: sub.name,
            amount: sub.amount,
            isDefault: sub.isDefault,
            sortOrder: j,
          })),
        },
      },
    });
  }

  // Create earners with all nested data
  for (let i = 0; i < guestSnapshot.earners.length; i++) {
    const e = guestSnapshot.earners[i];
    const earner = await tx.earner.create({
      data: {
        householdId,
        name: e.name,
        memberType: e.memberType || 'adult',
        avatarIcon: e.avatarIcon,
        dateOfBirth: e.dateOfBirth ? new Date(e.dateOfBirth) : null,
        state: e.state,
        filingStatus: e.filingStatus,
        deductionType: e.deductionType,
        isArchived: e.isArchived,
        isPrimary: e.isPrimary,
        sortOrder: i,
      },
    });

    // Income entries
    for (let j = 0; j < e.incomeEntries.length; j++) {
      const ie = e.incomeEntries[j];
      await tx.incomeEntry.create({
        data: {
          earnerId: earner.id,
          label: ie.label,
          amount: ie.amount,
          isTaxable: ie.isTaxable,
          durationYears: ie.durationYears,
          growthRate: ie.growthRate,
          sortOrder: j,
        },
      });
    }

    // Savings balance
    if (e.savingsBalance) {
      await tx.savingsBalance.create({
        data: {
          earnerId: earner.id,
          generalSavingsBalance: e.savingsBalance.generalSavingsBalance,
          fourOneKBalance: e.savingsBalance.fourOneKBalance,
          contributionPercent: e.savingsBalance.contributionPercent,
          employerMatchPercent: e.savingsBalance.employerMatchPercent,
          salaryGrowthRate: e.savingsBalance.salaryGrowthRate,
        },
      });
    }

    // Retirement settings
    if (e.retirementSettings) {
      await tx.retirementSettings.create({
        data: {
          earnerId: earner.id,
          currentAge: e.retirementSettings.currentAge,
          targetRetirementAge: e.retirementSettings.targetRetirementAge,
          withdrawalAge: e.retirementSettings.withdrawalAge,
          retirementGoal: e.retirementSettings.retirementGoal,
        },
      });
    }

    // Rate of return
    if (e.rateOfReturn) {
      await tx.rateOfReturn.create({
        data: {
          earnerId: earner.id,
          annualRate: e.rateOfReturn.annualRate,
          benchmarkType: e.rateOfReturn.benchmarkType,
        },
      });
    }

    // Itemized deductions
    for (const ded of (e.itemizedDeductions || [])) {
      await tx.itemizedDeduction.create({
        data: {
          earnerId: earner.id,
          label: ded.label,
          amount: ded.amount,
          sortOrder: ded.sortOrder,
        },
      });
    }
  }
}
