import { useState, useEffect, useMemo } from 'react';
import { useHouseholdStore } from '../../stores/householdStore';
import type { AmountMode } from 'shared';
import { computeHomePurchaseMonthly, computeClosingCosts } from 'shared';
import CurrencyInput from '../shared/CurrencyInput';
import ScrollPicker from '../shared/ScrollPicker';
import Modal from '../shared/Modal';

interface Props {
  open: boolean;
  onClose: () => void;
}

const fmt = (n: number) =>
  `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

const fmtDecimal = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function HomePurchaseDialog({ open, onClose }: Props) {
  const { homePurchase, upsertHomePurchase, removeHomePurchase } = useHouseholdStore();

  // Form state
  const [homePrice, setHomePrice] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [closingCosts, setClosingCosts] = useState(3);
  const [closingCostMode, setClosingCostMode] = useState<AmountMode>('percent');
  const [propertyTax, setPropertyTax] = useState(1.2);
  const [propertyTaxMode, setPropertyTaxMode] = useState<AmountMode>('percent');
  const [homeInsurance, setHomeInsurance] = useState(0.5);
  const [homeInsuranceMode, setHomeInsuranceMode] = useState<AmountMode>('percent');
  const [repairsPct, setRepairsPct] = useState(1.0);
  const [appreciationRate, setAppreciationRate] = useState(3.0);
  const [saving, setSaving] = useState(false);

  // Populate from existing config when dialog opens
  useEffect(() => {
    if (open && homePurchase) {
      setHomePrice(Number(homePurchase.homePrice));
      setDownPayment(Number(homePurchase.downPayment));
      setInterestRate(Number(homePurchase.interestRate));
      setLoanTermYears(homePurchase.loanTermYears);
      setClosingCosts(Number(homePurchase.closingCosts));
      setClosingCostMode(homePurchase.closingCostMode);
      setPropertyTax(Number(homePurchase.propertyTax));
      setPropertyTaxMode(homePurchase.propertyTaxMode);
      setHomeInsurance(Number(homePurchase.homeInsurance));
      setHomeInsuranceMode(homePurchase.homeInsuranceMode);
      setRepairsPct(Number(homePurchase.repairsPct));
      setAppreciationRate(Number(homePurchase.appreciationRate));
    } else if (open && !homePurchase) {
      setHomePrice(0);
      setDownPayment(0);
      setInterestRate(6.5);
      setLoanTermYears(30);
      setClosingCosts(3);
      setClosingCostMode('percent');
      setPropertyTax(1.2);
      setPropertyTaxMode('percent');
      setHomeInsurance(0.5);
      setHomeInsuranceMode('percent');
      setRepairsPct(1.0);
      setAppreciationRate(3.0);
    }
  }, [open, homePurchase]);

  // Live computed preview
  const formData = useMemo(() => ({
    id: '', householdId: '',
    homePrice, downPayment, interestRate, loanTermYears,
    closingCosts, closingCostMode,
    propertyTax, propertyTaxMode,
    homeInsurance, homeInsuranceMode,
    repairsPct, appreciationRate,
  }), [homePrice, downPayment, interestRate, loanTermYears, closingCosts, closingCostMode, propertyTax, propertyTaxMode, homeInsurance, homeInsuranceMode, repairsPct, appreciationRate]);

  const monthly = useMemo(() => computeHomePurchaseMonthly(formData), [formData]);
  const closingCostTotal = useMemo(() => computeClosingCosts(formData), [formData]);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await upsertHomePurchase({
        homePrice, downPayment, interestRate, loanTermYears,
        closingCosts, closingCostMode,
        propertyTax, propertyTaxMode,
        homeInsurance, homeInsuranceMode,
        repairsPct, appreciationRate,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    await removeHomePurchase();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-lg" ariaLabel="Home Purchase Details">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Home Purchase</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">&times;</button>
        </div>

        <div className="space-y-3">
          {/* Home Price */}
          <CurrencyInput label="Home Price" value={homePrice} onChange={setHomePrice} />

          {/* Down Payment */}
          <CurrencyInput label="Down Payment" value={downPayment} onChange={setDownPayment} />

          {/* Interest Rate */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Interest Rate</label>
            <ScrollPicker
              value={interestRate}
              onChange={setInterestRate}
              min={0}
              max={30}
              step={0.125}
            />
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Loan Term</label>
            <select
              value={loanTermYears}
              onChange={(e) => setLoanTermYears(Number(e.target.value))}
              className="px-2 py-2 text-sm border border-gray-300 rounded-lg"
            >
              <option value={15}>15 years</option>
              <option value={20}>20 years</option>
              <option value={30}>30 years</option>
            </select>
          </div>

          {/* Closing Costs */}
          <ModeInput
            label="Closing Costs"
            value={closingCosts}
            mode={closingCostMode}
            onValueChange={setClosingCosts}
            onModeChange={setClosingCostMode}
          />

          {/* Property Tax */}
          <ModeInput
            label="Property Tax (Annual)"
            value={propertyTax}
            mode={propertyTaxMode}
            onValueChange={setPropertyTax}
            onModeChange={setPropertyTaxMode}
          />

          {/* Home Insurance */}
          <ModeInput
            label="Home Insurance (Annual)"
            value={homeInsurance}
            mode={homeInsuranceMode}
            onValueChange={setHomeInsurance}
            onModeChange={setHomeInsuranceMode}
          />

          {/* Repairs */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Expected Repairs (% of home value/yr)</label>
            <ScrollPicker
              value={repairsPct}
              onChange={setRepairsPct}
              min={0}
              max={10}
              step={0.1}
            />
          </div>

          {/* Appreciation Rate */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Home Appreciation Rate</label>
            <ScrollPicker
              value={appreciationRate}
              onChange={setAppreciationRate}
              min={-10}
              max={20}
              step={0.1}
            />
          </div>
        </div>

        {/* Monthly Breakdown */}
        {homePrice > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200 text-sm">
            <p className="font-medium text-blue-900 mb-2">Monthly Breakdown</p>
            <div className="space-y-1 text-blue-800">
              <div className="flex justify-between"><span>Mortgage P&I</span><span>{fmtDecimal(monthly.mortgagePI)}</span></div>
              <div className="flex justify-between"><span>Property Tax</span><span>{fmtDecimal(monthly.propertyTax)}</span></div>
              <div className="flex justify-between"><span>Home Insurance</span><span>{fmtDecimal(monthly.homeInsurance)}</span></div>
              <div className="flex justify-between"><span>Repairs</span><span>{fmtDecimal(monthly.repairs)}</span></div>
              <div className="flex justify-between font-semibold border-t border-blue-200 pt-1 mt-1">
                <span>Total</span><span>{fmtDecimal(monthly.total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* One-Time Costs */}
        {homePrice > 0 && (
          <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200 text-sm">
            <p className="font-medium text-gray-700 mb-2">One-Time Costs</p>
            <div className="space-y-1 text-gray-600">
              <div className="flex justify-between"><span>Down Payment</span><span>{fmt(downPayment)}</span></div>
              <div className="flex justify-between"><span>Closing Costs</span><span>{fmt(closingCostTotal)}</span></div>
              <div className="flex justify-between font-semibold border-t border-gray-200 pt-1 mt-1">
                <span>Total</span><span>{fmt(downPayment + closingCostTotal)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-5">
          <div>
            {homePurchase && (
              <button
                onClick={handleRemove}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={homePrice <= 0 || saving}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/** Reusable input with % / $ mode toggle */
function ModeInput({
  label,
  value,
  mode,
  onValueChange,
  onModeChange,
}: {
  label: string;
  value: number;
  mode: AmountMode;
  onValueChange: (v: number) => void;
  onModeChange: (m: AmountMode) => void;
}) {
  const toggle = () => {
    onModeChange(mode === 'percent' ? 'dollar' : 'percent');
    onValueChange(0);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="flex items-center gap-1.5">
        {mode === 'percent' ? (
          <ScrollPicker
            value={value}
            onChange={onValueChange}
            min={0}
            max={20}
            step={0.1}
          />
        ) : (
          <>
            <span className="text-sm text-gray-400">$</span>
            <input
              type="number"
              min={0}
              step={100}
              value={value}
              onChange={(e) => onValueChange(Number(e.target.value))}
              className="w-28 px-2 py-2 text-sm text-right border border-gray-300 rounded-lg"
            />
          </>
        )}
        <button
          type="button"
          onClick={toggle}
          className="px-2 py-1 text-xs border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
        >
          {mode === 'percent' ? 'Switch to $' : 'Switch to %'}
        </button>
      </div>
    </div>
  );
}
