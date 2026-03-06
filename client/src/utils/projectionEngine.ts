import { calculateTax, calculateCapitalGainsTax } from './taxCalculator';
import type { HouseholdSnapshot, HomePurchase } from 'shared';
import { computeHomePurchaseMonthly, computeMonthlyMortgage, HOME_PURCHASE_LOCKED_NAMES } from 'shared';

type EarnerWithRelations = HouseholdSnapshot['earners'][number];

export interface ProjectionYear {
  age: number;            // primary earner's age
  year: number;           // calendar year
  // Balances at end of year
  generalSavings: number;
  fourOneK: number;
  totalSavings: number;
  // Home equity
  homeEquity: number;     // home value - loan balance (0 if no home purchase)
  netWorth: number;       // totalSavings + homeEquity
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
  capitalGainsTax: number;  // tax on realized gains from selling investments
  // Inflation-adjusted
  totalSavingsReal: number;
  netWorthReal: number;
  investmentGrowthReal: number; // interest/gains adjusted for inflation
  savingsGrowthReal: number;    // savings interest adjusted for inflation
}

export interface ProjectionInputs {
  earners: EarnerWithRelations[];
  expenseCategories: HouseholdSnapshot['expenseCategories'];
  expenseBuffer: number;  // percentage
  inflationRate: number;  // percentage, e.g. 3
  maxAge: number;         // project until this age (default 100)
  homePurchase?: HomePurchase | null;
}

export function runProjection(inputs: ProjectionInputs): ProjectionYear[] {
  const { earners, expenseCategories, expenseBuffer, inflationRate, maxAge } = inputs;

  // Find the primary earner to anchor the timeline (children cannot be primary)
  const adults = earners.filter((e) => e.memberType !== 'child');
  const primary = adults.find((e) => e.isPrimary) || adults[0];
  if (!primary?.retirementSettings) return [];

  const { currentAge } = primary.retirementSettings;
  if (currentAge >= maxAge) return [];

  const yearsToProject = maxAge - currentAge;
  const currentYear = new Date().getFullYear();
  const results: ProjectionYear[] = [];
  const inflationMultiplier = 1 + inflationRate / 100;

  // Monthly expenses (before buffer), accounting for home purchase locked subs
  const hpMonthlyTotal = inputs.homePurchase
    ? computeHomePurchaseMonthly(inputs.homePurchase).total
    : 0;
  const monthlyExpenses = expenseCategories.reduce(
    (sum, cat) => {
      const subs = cat.name === 'Housing' && inputs.homePurchase
        ? cat.subCategories.filter((s) => !HOME_PURCHASE_LOCKED_NAMES.includes(s.name))
        : cat.subCategories;
      return sum + subs.reduce((s, sub) => s + Number(sub.amount), 0);
    },
    0,
  ) + hpMonthlyTotal;
  const annualExpenses = monthlyExpenses * 12 * (1 + expenseBuffer / 100);

  // Per-earner tracking
  const earnerState = earners.map((earner) => {
    const savings = earner.savingsBalance;
    const retirement = earner.retirementSettings;
    const ror = earner.rateOfReturn;
    const retirementAge = retirement?.targetRetirementAge ?? 65;
    const earnerCurrentAge = retirement?.currentAge ?? currentAge;

    // Pre-process income entries with their durations and per-entry growth rates
    const incomeEntries = earner.incomeEntries.map((ie) => ({
      amount: Number(ie.amount),
      isTaxable: ie.isTaxable,
      durationYears: ie.durationYears != null ? Number(ie.durationYears) : null,
      growthRate: ie.growthRate != null ? Number(ie.growthRate) / 100 : 0,
    }));

    const isChild = earner.memberType === 'child';
    const monthlyContribution = Number(savings?.monthlyContribution ?? 0);
    const withdrawalAge = retirement?.withdrawalAge ?? (isChild ? 18 : 59);

    return {
      earner,
      incomeEntries,
      isChild,
      monthlyContribution,
      withdrawalAge,
      generalSavings: Number(savings?.generalSavingsBalance ?? 0),
      costBasis: Number(savings?.generalSavingsBalance ?? 0), // start: all basis, no unrealized gains
      fourOneK: Number(savings?.fourOneKBalance ?? 0),
      contributionPct: Number(savings?.contributionPercent ?? 0) / 100,
      employerMatchPct: Number(savings?.employerMatchPercent ?? 0) / 100,
      annualRate: Number(ror?.annualRate ?? 7) / 100,
      retirementAge,
      currentAge: earnerCurrentAge,
    };
  });

  // Home equity tracking
  const hp = inputs.homePurchase;
  let homeValue = hp ? Number(hp.homePrice) : 0;
  const hpAppreciationMul = hp ? 1 + Number(hp.appreciationRate) / 100 : 1;
  let loanBalance = hp ? Number(hp.homePrice) - Number(hp.downPayment) : 0;
  const hpMonthlyRate = hp ? Number(hp.interestRate) / 100 / 12 : 0;
  const hpMonthlyPayment = hp
    ? computeMonthlyMortgage(loanBalance, Number(hp.interestRate), hp.loanTermYears)
    : 0;
  const hpLoanTermYears = hp?.loanTermYears ?? 30;

  const startEquity = homeValue - loanBalance;

  // Baseline row: starting balances, no processing
  const startGeneralSavings = earnerState.reduce((s, es) => s + es.generalSavings, 0);
  const startFourOneK = earnerState.reduce((s, es) => s + es.fourOneK, 0);
  const startTotal = startGeneralSavings + startFourOneK;
  const startNetWorth = startTotal + startEquity;
  results.push({
    age: currentAge,
    year: currentYear,
    generalSavings: Math.round(startGeneralSavings),
    fourOneK: Math.round(startFourOneK),
    totalSavings: Math.round(startTotal),
    homeEquity: Math.round(startEquity),
    netWorth: Math.round(startNetWorth),
    totalIncome: 0,
    totalTax: 0,
    totalExpenses: 0,
    totalContributions401k: 0,
    totalEmployerMatch: 0,
    netCashFlow: 0,
    investmentGrowth: 0,
    fourOneKGrowth: 0,
    savingsGrowth: 0,
    capitalGainsTax: 0,
    totalSavingsReal: Math.round(startTotal),
    netWorthReal: Math.round(startNetWorth),
    investmentGrowthReal: 0,
    savingsGrowthReal: 0,
  });

  for (let y = 0; y < yearsToProject; y++) {
    const age = currentAge + y + 1;
    const year = currentYear + y + 1;
    const inflationFactor = Math.pow(inflationMultiplier, y);

    let totalIncome = 0;
    let totalTaxableIncome = 0;
    let totalTax = 0;
    let totalContributions401k = 0;
    let totalEmployerMatch = 0;
    let totalInvestmentGrowth = 0;
    let totalFourOneKGrowth = 0;
    let totalSavingsGrowth = 0;
    let aggregateGeneralSavings = 0;
    let aggregateFourOneK = 0;

    for (const es of earnerState) {
      const earnerAge = es.currentAge + y + 1;
      const isRetired = earnerAge >= es.retirementAge;

      // Evaluate each income entry individually based on its duration and growth rate
      let income = 0;
      let taxableIncome = 0;
      for (const ie of es.incomeEntries) {
        // Entry active? Check duration (null = until retirement)
        const active = ie.durationYears != null
          ? y < ie.durationYears
          : !isRetired;
        if (!active) continue;
        const entryAmount = ie.amount * Math.pow(1 + ie.growthRate, y);
        income += entryAmount;
        if (ie.isTaxable) taxableIncome += entryAmount;
      }

      // 401k contributions based on current taxable income
      const contribution401k = taxableIncome > 0 ? taxableIncome * es.contributionPct : 0;
      const employerMatch = taxableIncome > 0 ? taxableIncome * es.employerMatchPct : 0;

      // Calculate taxes (only on taxable income)
      const itemizedTotal = es.earner.itemizedDeductions.reduce((s, d) => s + Number(d.amount), 0);
      const tax = taxableIncome === 0
        ? { totalTax: 0 }
        : calculateTax({
            grossIncome: taxableIncome,
            filingStatus: es.earner.filingStatus,
            state: es.earner.state,
            deductionType: es.earner.deductionType,
            itemizedDeductionTotal: itemizedTotal,
            preTax401k: contribution401k,
          });

      totalIncome += income;
      totalTaxableIncome += taxableIncome;
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

    // Child monthly contributions: add to child's savings, counts as household expense
    let totalChildContributions = 0;
    for (const es of earnerState) {
      if (es.isChild && es.monthlyContribution > 0) {
        const earnerAge = es.currentAge + y + 1;
        // Only contribute up to the withdrawal age
        if (earnerAge <= es.withdrawalAge) {
          const annualContribution = es.monthlyContribution * 12;
          es.generalSavings += annualContribution;
          es.costBasis += annualContribution;
          totalChildContributions += annualContribution;
        }
      }
    }

    // Household expenses grow with inflation
    const yearExpenses = annualExpenses * inflationFactor;

    // Net cash flow = income - taxes - expenses - 401k contributions - child savings contributions
    const netCash = totalIncome - totalTax - yearExpenses - totalContributions401k - totalChildContributions;

    // Calculate interest on savings BEFORE applying net cash,
    // then net cash comes out of the interest (not the principal)
    let totalCapGainsTax = 0;
    if (earnerState.length > 0) {
      // Grow all general savings with the earner's rate first
      for (const es of earnerState) {
        const savingsInterest = es.generalSavings * es.annualRate;
        totalInvestmentGrowth += savingsInterest;
        totalSavingsGrowth += savingsInterest;
        es.generalSavings = es.generalSavings + savingsInterest;
        // Interest is unrealized gains — costBasis stays the same
      }

      const es0 = earnerState[0];
      if (netCash >= 0) {
        // Positive cash flow: add to savings and increase cost basis
        es0.generalSavings += netCash;
        es0.costBasis += netCash;
      } else {
        // Negative cash flow: need to sell investments to cover deficit
        const deficit = -netCash;
        const balance = es0.generalSavings;

        if (balance <= 0) {
          // No savings left, just go negative
          es0.generalSavings -= deficit;
        } else {
          const gainRatio = Math.max(0, (balance - es0.costBasis) / balance);

          if (gainRatio <= 0) {
            // No unrealized gains — no cap gains tax
            const withdrawal = Math.min(deficit, balance);
            es0.generalSavings -= deficit;
            es0.costBasis -= withdrawal; // reduce basis by amount sold (all basis)
            if (es0.costBasis < 0) es0.costBasis = 0;
          } else {
            // Iterative solve: sell enough to cover deficit + tax on the realized gains
            // Use primary earner's filing status/state for cap gains tax
            const primaryEarner = es0.earner;
            // ordinaryTaxableIncome: only taxable income (excludes non-taxable entries)
            const ordinaryTaxable = Math.max(0, totalTaxableIncome - totalContributions401k);
            let W = deficit;
            let capGainsTax = 0;
            for (let i = 0; i < 3; i++) {
              const realizedGains = W * gainRatio;
              capGainsTax = calculateCapitalGainsTax({
                capitalGains: realizedGains,
                ordinaryTaxableIncome: ordinaryTaxable,
                filingStatus: primaryEarner.filingStatus,
                state: primaryEarner.state,
              });
              W = deficit + capGainsTax;
            }
            // Cap withdrawal at available balance
            W = Math.min(W, balance);
            // Recalculate tax if capped
            if (W < deficit + capGainsTax) {
              const realizedGains = W * gainRatio;
              capGainsTax = calculateCapitalGainsTax({
                capitalGains: realizedGains,
                ordinaryTaxableIncome: ordinaryTaxable,
                filingStatus: primaryEarner.filingStatus,
                state: primaryEarner.state,
              });
            }
            es0.generalSavings -= W;
            es0.costBasis -= W * (1 - gainRatio); // reduce basis proportionally
            if (es0.costBasis < 0) es0.costBasis = 0;
            // Any remaining deficit beyond what savings can cover
            if (W < deficit + capGainsTax) {
              es0.generalSavings -= (deficit + capGainsTax - W);
            }
            totalCapGainsTax = capGainsTax;
            totalTax += capGainsTax;
          }
        }
      }
    }

    aggregateGeneralSavings = earnerState.reduce((s, es) => s + es.generalSavings, 0);
    const totalSavings = aggregateGeneralSavings + aggregateFourOneK;

    // Home equity: appreciate home value, pay down loan
    if (hp && y < hpLoanTermYears) {
      for (let m = 0; m < 12; m++) {
        if (loanBalance <= 0) break;
        const interestPmt = loanBalance * hpMonthlyRate;
        const principalPmt = Math.min(hpMonthlyPayment - interestPmt, loanBalance);
        loanBalance -= principalPmt;
      }
      if (loanBalance < 0.01) loanBalance = 0;
    } else if (hp && y >= hpLoanTermYears) {
      loanBalance = 0;
    }
    if (hp) {
      homeValue = Number(hp.homePrice) * Math.pow(hpAppreciationMul, y + 1);
    }
    const homeEquity = homeValue - loanBalance;
    const netWorth = totalSavings + homeEquity;

    results.push({
      age,
      year,
      generalSavings: Math.round(aggregateGeneralSavings),
      fourOneK: Math.round(aggregateFourOneK),
      totalSavings: Math.round(totalSavings),
      homeEquity: Math.round(homeEquity),
      netWorth: Math.round(netWorth),
      totalIncome: Math.round(totalIncome),
      totalTax: Math.round(totalTax),
      totalExpenses: Math.round(yearExpenses),
      totalContributions401k: Math.round(totalContributions401k),
      totalEmployerMatch: Math.round(totalEmployerMatch),
      netCashFlow: Math.round(netCash),
      investmentGrowth: Math.round(totalInvestmentGrowth),
      fourOneKGrowth: Math.round(totalFourOneKGrowth),
      savingsGrowth: Math.round(totalSavingsGrowth),
      capitalGainsTax: Math.round(totalCapGainsTax),
      totalSavingsReal: Math.round(totalSavings / inflationFactor),
      netWorthReal: Math.round(netWorth / inflationFactor),
      investmentGrowthReal: Math.round(totalInvestmentGrowth / inflationFactor),
      savingsGrowthReal: Math.round(totalSavingsGrowth / inflationFactor),
    });
  }

  return results;
}
