import { useState, useCallback } from 'react';
import { useHouseholdStore } from '../../stores/householdStore';
import Card from '../shared/Card';
import CurrencyInput from '../shared/CurrencyInput';
import ScrollPicker from '../shared/ScrollPicker';
import EmptyState from '../shared/EmptyState';
import SectionHeader from '../shared/SectionHeader';
import type { IncomeEntry } from 'shared';

interface Props {
  earnerId: string;
}

export default function IncomePanel({ earnerId }: Props) {
  const earner = useHouseholdStore((s) => s.earners.find((e) => e.id === earnerId));
  const { addIncomeEntry, updateIncomeEntry, removeIncomeEntry } = useHouseholdStore();
  const [saving, setSaving] = useState(false);

  if (!earner) return null;

  const entries = earner.incomeEntries || [];

  const handleAddEntry = async () => {
    setSaving(true);
    try {
      await addIncomeEntry(earner.id, { label: 'New Income', amount: 0 });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateEntry = async (id: string, data: Partial<IncomeEntry>) => {
    setSaving(true);
    try {
      await updateIncomeEntry(id, data);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveEntry = async (id: string) => {
    setSaving(true);
    try {
      await removeIncomeEntry(id, earner.id);
    } finally {
      setSaving(false);
    }
  };

  const totalIncome = entries.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <SectionHeader>Income Sources</SectionHeader>
        <div className="flex items-center gap-3">
          {saving && (
            <span className="text-xs text-gray-400">Saving...</span>
          )}
          <button
            onClick={handleAddEntry}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            + Add Income
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {entries.map((entry) => (
          <IncomeEntryRow
            key={entry.id}
            entry={entry}
            onUpdate={(data) => handleUpdateEntry(entry.id, data)}
            onRemove={() => handleRemoveEntry(entry.id)}
          />
        ))}

        {entries.length === 0 && (
          <EmptyState
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            }
            message="No income entries yet. Add one to get started."
          />
        )}
      </div>

      {entries.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total Annual Income</span>
          <span className="text-sm font-semibold text-gray-900">
            ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      )}
    </Card>
  );
}

function IncomeEntryRow({
  entry,
  onUpdate,
  onRemove,
}: {
  entry: IncomeEntry;
  onUpdate: (data: Partial<IncomeEntry>) => void;
  onRemove: () => void;
}) {
  const [label, setLabel] = useState(entry.label);
  const [durationStr, setDurationStr] = useState(
    entry.durationYears != null ? String(entry.durationYears) : '',
  );
  const growthRate = Number(entry.growthRate ?? 0);

  const handleLabelBlur = () => {
    if (label !== entry.label) {
      onUpdate({ label });
    }
  };

  const handleAmountChange = useCallback(
    (amount: number) => {
      onUpdate({ amount });
    },
    [onUpdate],
  );

  const handleDurationBlur = () => {
    const parsed = durationStr.trim() === '' ? null : parseInt(durationStr, 10);
    const current = entry.durationYears ?? null;
    if (parsed !== current) {
      onUpdate({ durationYears: isNaN(parsed as number) ? null : parsed });
    }
  };

  const handleGrowthChange = useCallback(
    (value: number) => {
      onUpdate({ growthRate: value });
    },
    [onUpdate],
  );

  return (
    <div className="border border-gray-100 rounded p-2 space-y-2">
      {/* Row 1: Label + remove */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleLabelBlur}
          className="flex-1 min-w-0 px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
          placeholder="Income label"
        />
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 text-lg leading-none px-1 transition-colors"
          title="Remove"
        >
          &times;
        </button>
      </div>
      {/* Row 2: Amount, Duration, Growth %, Taxable */}
      <div className="flex items-center gap-2 flex-wrap">
        <CurrencyInput
          value={Number(entry.amount)}
          onChange={handleAmountChange}
          className="w-32"
        />
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={1}
            max={99}
            value={durationStr}
            onChange={(e) => setDurationStr(e.target.value)}
            onBlur={handleDurationBlur}
            placeholder={"\u221E"}
            title="Duration in years (empty = until retirement)"
            className="w-16 px-1.5 py-1.5 text-sm text-center border border-gray-300 rounded-lg"
          />
          <span className="text-xs text-gray-500">yr</span>
        </div>
        <div className="flex items-center gap-1">
          <ScrollPicker
            value={growthRate}
            onChange={handleGrowthChange}
            min={0}
            max={50}
            step={0.1}
            suffix="%/yr"
          />
        </div>
        <label className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
          <input
            type="checkbox"
            checked={entry.isTaxable}
            onChange={(e) => onUpdate({ isTaxable: e.target.checked })}
            className="rounded-sm border-gray-300"
          />
          Taxable
        </label>
      </div>
    </div>
  );
}
