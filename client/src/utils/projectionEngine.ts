import { calculateTax } from './taxCalculator';
import type { HouseholdSnapshot } from 'shared';

type EarnerWithRelations = HouseholdSnapshot['earners'][number];

export interface ProjectionYear {
  age: number;            // primary earner's age
  year: number;           // calendar year
  // Balances at end of year
  generalSavings: number;
  fourOneK: number;
  totalSavings: number;
  // Annual flows
  totalIncome: number;
  totalTax: number;
  totalExpenses: number;
  totalContributions401k: number;
  totalEmployerMatch: number;
  netCashFlow: number;
  investmentGrowth: number; // total interest/gains accrued this year
  fourOneKGrowth: number;   // 401(k) interest this year
  savingsGrowth: number;    // general savings interest this year
  // Inflation-adjusted
  totalSavingsReal: number;
  investmentGrowthReal: number; // interest/gains adjusted for inflation
  savingsGrowthReal: number;    // savings interest adjusted for inflation
}

export interface ProjectionInputs {
  earners: EarnerWithRelations[];
  expenseCategories: HouseholdSnapshot['expenseCategories'];
  expenseBuffer: number;  // percentage
  inflationRate: number;  // percentage, e.g. 3
  maxAge: number;         // project until this age (default 100)
}

export function runProjection(inputs: ProjectionInputs): ProjectionYear[] {
  const { earners, expenseCategories, expenseBuffer, inflationRate, maxAge } = inputs;

  // Find the primary earner to anchor the timeline
  const primary = earners.find((e) => e.isPrimary) || earners[0];
  if (!primary?.retirementSettings) return [];

  const { currentAge } = primary.retirementSettings;
  if (currentAge >= maxAge) return [];

  const yearsToProject = maxAge - currentAge;
  const currentYear = new Date().getFullYear();
  const results: ProjectionYear[] = [];
  const inflationMultiplier = 1 + inflationRate / 100;

  // Monthly expenses (before buffer)
  const monthlyExpenses = expenseCategories.reduce(
    (sum, cat) => sum + cat.subCategories.reduce((s, sub) => s + Number(sub.amount), 0),
    0,
  );
  const annualExpenses = monthlyExpenses * 12 * (1 + expenseBuffer / 100);

  // Per-earner tracking
  const earnerState = earners.map((earner) => {
    const income = earner.incomeEntries.reduce((s, ie) => s + Number(ie.amount), 0);
    const taxableIncome = earner.incomeEntries
      .filter((ie) => ie.isTaxable)
      .reduce((s, ie) => s + Number(ie.amount), 0);
    const savings = earner.savingsBalance;
    const retirement = earner.retirementSettings;
    const ror = earner.rateOfReturn;

    return {
      earner,
      currentIncome: income,
      currentTaxableIncome: taxableIncome,
      generalSavings: Number(savings?.generalSavingsBalance ?? 0),
      fourOneK: Number(savings?.fourOneKBalance ?? 0),
      contributionPct: Number(savings?.contributionPercent ?? 0) / 100,
      employerMatchPct: Number(savings?.employerMatchPercent ?? 0) / 100,
      salaryGrowthRate: Number(savings?.salaryGrowthRate ?? 0) / 100,
      annualRate: Number(ror?.annualRate ?? 7) / 100,
      retirementAge: retirement?.targetRetirementAge ?? 65,
      currentAge: retirement?.currentAge ?? currentAge,
    };
  });

  for (let y = 0; y < yearsToProject; y++) {
    const age = currentAge + y;
    const year = currentYear + y;
    const inflationFactor = Math.pow(inflationMultiplier, y);

    let totalIncome = 0;
    let totalTax = 0;
    let totalContributions401k = 0;
    let totalEmployerMatch = 0;
    let totalInvestmentGrowth = 0;
    let totalFourOneKGrowth = 0;
    let totalSavingsGrowth = 0;
    let aggregateGeneralSavings = 0;
    let aggregateFourOneK = 0;

    for (const es of earnerState) {
      const earnerAge = es.currentAge + y;
      const isRetired = earnerAge >= es.retirementAge;

      // Salary grows each year (only while working)
      const income = isRetired ? 0 : es.currentIncome * Math.pow(1 + es.salaryGrowthRate, y);
      const taxableIncome = isRetired ? 0 : es.currentTaxableIncome * Math.pow(1 + es.salaryGrowthRate, y);

      // 401k contributions (only while working)
      const contribution401k = isRetired ? 0 : taxableIncome * es.contributionPct;
      const employerMatch = isRetired ? 0 : taxableIncome * es.employerMatchPct;

      // Calculate taxes
      const itemizedTotal = es.earner.itemizedDeductions.reduce((s, d) => s + Number(d.amount), 0);
      const tax = isRetired
        ? { totalTax: 0 }
        : calculateTax({
            grossIncome: income,
            filingStatus: es.earner.filingStatus,
            state: es.earner.state,
            deductionType: es.earner.deductionType,
            itemizedDeductionTotal: itemizedTotal,
            preTax401k: contribution401k,
          });

      totalIncome += income;
      totalTax += tax.totalTax;
      totalContributions401k += contribution401k;
      totalEmployerMatch += employerMatch;

      // Grow balances with rate of return, tracking interest separately
      const fourOneKInterest = es.fourOneK * es.annualRate;
      es.fourOneK = es.fourOneK + fourOneKInterest + contribution401k + employerMatch;
      totalInvestmentGrowth += fourOneKInterest;
      totalFourOneKGrowth += fourOneKInterest;
      aggregateFourOneK += es.fourOneK;
      aggregateGeneralSavings += es.generalSavings;
    }

    // Household expenses grow with inflation
    const yearExpenses = annualExpenses * inflationFactor;

    // Net cash flow = income - taxes - expenses - 401k contributions (already deducted)
    const netCash = totalIncome - totalTax - yearExpenses - totalContributions401k;

    // Calculate interest on savings BEFORE applying net cash,
    // then net cash comes out of the interest (not the principal)
    if (earnerState.length > 0) {
      // Grow all general savings with the earner's rate first
      for (const es of earnerState) {
        const savingsInterest = es.generalSavings * es.annualRate;
        totalInvestmentGrowth += savingsInterest;
        totalSavingsGrowth += savingsInterest;
        es.generalSavings = es.generalSavings + savingsInterest;
      }
      // Then apply net cash flow (negative net cash draws from interest/savings)
      earnerState[0].generalSavings += netCash;
    }

    aggregateGeneralSavings = earnerState.reduce((s, es) => s + es.generalSavings, 0);
    const totalSavings = aggregateGeneralSavings + aggregateFourOneK;

    results.push({
      age,
      year,
      generalSavings: Math.round(aggregateGeneralSavings),
      fourOneK: Math.round(aggregateFourOneK),
      totalSavings: Math.round(totalSavings),
      totalIncome: Math.round(totalIncome),
      totalTax: Math.round(totalTax),
      totalExpenses: Math.round(yearExpenses),
      totalContributions401k: Math.round(totalContributions401k),
      totalEmployerMatch: Math.round(totalEmployerMatch),
      netCashFlow: Math.round(netCash),
      investmentGrowth: Math.round(totalInvestmentGrowth),
      fourOneKGrowth: Math.round(totalFourOneKGrowth),
      savingsGrowth: Math.round(totalSavingsGrowth),
      totalSavingsReal: Math.round(totalSavings / inflationFactor),
      investmentGrowthReal: Math.round(totalInvestmentGrowth / inflationFactor),
      savingsGrowthReal: Math.round(totalSavingsGrowth / inflationFactor),
    });
  }

  return results;
}
