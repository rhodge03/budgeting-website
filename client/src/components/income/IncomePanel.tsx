import { useState, useCallback } from 'react';
import { useHouseholdStore } from '../../stores/householdStore';
import CurrencyInput from '../shared/CurrencyInput';
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
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Income Sources
        </h3>
        <div className="flex items-center gap-3">
          {saving && (
            <span className="text-xs text-gray-400">Saving...</span>
          )}
          <button
            onClick={handleAddEntry}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
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
          <p className="text-sm text-gray-500 text-center py-4">
            No income entries yet. Add one to get started.
          </p>
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
    </div>
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
  const [growthStr, setGrowthStr] = useState(
    entry.growthRate != null ? String(entry.growthRate) : '',
  );

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

  const handleGrowthBlur = () => {
    const parsed = growthStr.trim() === '' ? null : parseFloat(growthStr);
    const current = entry.growthRate ?? null;
    if (parsed !== current) {
      onUpdate({ growthRate: isNaN(parsed as number) ? null : parsed });
    }
  };

  return (
    <div className="border border-gray-100 rounded-md p-2 space-y-2">
      {/* Row 1: Label + remove */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleLabelBlur}
          className="flex-1 min-w-0 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Income label"
        />
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 text-lg leading-none px-1"
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
            className="w-12 px-1.5 py-1.5 text-sm text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-500">yr</span>
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={0}
            max={50}
            step={0.1}
            value={growthStr}
            onChange={(e) => setGrowthStr(e.target.value)}
            onBlur={handleGrowthBlur}
            placeholder="0"
            title="Annual growth rate % (empty = 0%)"
            className="w-14 px-1.5 py-1.5 text-sm text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-500">%/yr</span>
        </div>
        <label className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
          <input
            type="checkbox"
            checked={entry.isTaxable}
            onChange={(e) => onUpdate({ isTaxable: e.target.checked })}
            className="rounded border-gray-300"
          />
          Taxable
        </label>
      </div>
    </div>
  );
}
