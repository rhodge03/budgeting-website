import { useState, useEffect } from 'react';

interface PercentageInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export default function PercentageInput({
  value,
  onChange,
  label,
  className = '',
  disabled = false,
}: PercentageInputProps) {
  const [displayValue, setDisplayValue] = useState(String(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(String(value));
    }
  }, [value, isFocused]);

  function handleFocus() {
    setIsFocused(true);
    setDisplayValue(value === 0 ? '' : String(value));
  }

  function handleBlur() {
    setIsFocused(false);
    const parsed = parseFloat(displayValue);
    const finalValue = isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
    onChange(finalValue);
    setDisplayValue(String(finalValue));
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-gray-600 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={(e) => setDisplayValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className="w-full pr-8 pl-3 py-2 text-sm text-right border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          %
        </span>
      </div>
    </div>
  );
}
