import { useState, useCallback } from 'react';
import { useHouseholdStore } from '../../stores/householdStore';
import * as incomeApi from '../../api/income';
import CurrencyInput from '../shared/CurrencyInput';
import type { IncomeEntry } from 'shared';

export default function IncomePanel() {
  const { earners, selectedEarnerId, loadSnapshot } = useHouseholdStore();
  const earner = earners.find((e) => e.id === selectedEarnerId);
  const [saving, setSaving] = useState(false);

  if (!earner) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <p className="text-sm text-gray-500">Select an earner to manage income.</p>
      </div>
    );
  }

  const entries = earner.incomeEntries || [];

  const handleAddEntry = async () => {
    setSaving(true);
    try {
      await incomeApi.create(earner.id, { label: 'New Income', amount: 0 });
      await loadSnapshot();
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateEntry = async (id: string, data: Partial<IncomeEntry>) => {
    setSaving(true);
    try {
      await incomeApi.update(id, data);
      await loadSnapshot();
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveEntry = async (id: string) => {
    setSaving(true);
    try {
      await incomeApi.remove(id);
      await loadSnapshot();
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

  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={handleLabelBlur}
        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Income label"
      />
      <CurrencyInput
        value={Number(entry.amount)}
        onChange={handleAmountChange}
        className="w-40"
      />
      <label className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
        <input
          type="checkbox"
          checked={entry.isTaxable}
          onChange={(e) => onUpdate({ isTaxable: e.target.checked })}
          className="rounded border-gray-300"
        />
        Taxable
      </label>
      <button
        onClick={onRemove}
        className="text-gray-400 hover:text-red-500 text-lg leading-none"
        title="Remove"
      >
        &times;
      </button>
    </div>
  );
}
