import { useState, useRef, useEffect, useMemo, useCallback } from 'react';

interface ScrollPickerProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  decimals?: number;
}

const ITEM_HEIGHT = 28;
const VISIBLE_ITEMS = 3;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

export default function ScrollPicker({
  value,
  onChange,
  min,
  max,
  step,
  suffix = '%',
  decimals,
}: ScrollPickerProps) {
  const resolvedDecimals = decimals ?? Math.max(0, -Math.floor(Math.log10(step)));
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [isTyping, setIsTyping] = useState(false);
  const [typedValue, setTypedValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate values array, inserting custom value if off-step
  const values = useMemo(() => {
    const arr: number[] = [];
    const count = Math.round((max - min) / step);
    for (let i = 0; i <= count; i++) {
      const v = min + i * step;
      arr.push(Number(v.toFixed(resolvedDecimals)));
    }
    // If value is off-step but within range, insert it at the right position
    if (value >= min && value <= max && !arr.some((v) => v === value)) {
      arr.push(value);
      arr.sort((a, b) => a - b);
    }
    return arr;
  }, [min, max, step, resolvedDecimals, value]);

  // Find index of current value (exact match first, then nearest step)
  const currentIndex = useMemo(() => {
    const exact = values.findIndex((v) => v === value);
    if (exact >= 0) return exact;
    const close = values.findIndex((v) => Math.abs(v - value) < step / 2);
    return close >= 0 ? close : 0;
  }, [values, value, step]);

  // Scroll to value on mount and when value changes externally
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = currentIndex * ITEM_HEIGHT;
  }, [currentIndex]);

  // Block native scroll entirely — we handle wheel manually
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const prevent = (e: WheelEvent) => e.preventDefault();
    el.addEventListener('wheel', prevent, { passive: false });
    return () => el.removeEventListener('wheel', prevent);
  }, []);

  // Mouse wheel: move exactly one step per tick
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const direction = e.deltaY > 0 ? 1 : -1;
      const newIndex = Math.max(0, Math.min(values.length - 1, currentIndex + direction));
      if (newIndex !== currentIndex) {
        onChange(values[newIndex]);
      }
    },
    [currentIndex, values, onChange],
  );

  // Keyboard handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newIndex = Math.max(0, currentIndex - 1);
        if (newIndex !== currentIndex) onChange(values[newIndex]);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const newIndex = Math.min(values.length - 1, currentIndex + 1);
        if (newIndex !== currentIndex) onChange(values[newIndex]);
      }
    },
    [currentIndex, values, onChange],
  );

  // Click on drum opens text input
  const startTyping = () => {
    setTypedValue(value.toFixed(resolvedDecimals));
    setIsTyping(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  // Commit typed value
  const commitTypedValue = () => {
    setIsTyping(false);
    const parsed = parseFloat(typedValue);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange(clamped);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  if (isTyping) {
    return (
      <div
        className="inline-flex items-center gap-0.5 rounded-lg border border-blue-300 bg-white px-1"
        style={{ height: CONTAINER_HEIGHT }}
      >
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={typedValue}
          onChange={(e) => setTypedValue(e.target.value)}
          onBlur={commitTypedValue}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitTypedValue();
            if (e.key === 'Escape') setIsTyping(false);
          }}
          autoFocus
          className="w-14 px-1 py-0.5 text-sm text-center border-none outline-none bg-transparent"
        />
        <span className="text-xs text-gray-400">{suffix}</span>
      </div>
    );
  }

  return (
    <div
      className="relative w-[80px] overflow-hidden rounded-lg border border-gray-200 bg-white cursor-pointer"
      style={{ height: CONTAINER_HEIGHT }}
      onClick={startTyping}
    >
      {/* Gradient masks */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-white to-transparent z-10" />

      {/* Center highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 z-[5] border-y border-blue-200 bg-blue-50/50"
        style={{ top: ITEM_HEIGHT, height: ITEM_HEIGHT }}
      />

      {/* Scrollable list */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="h-full overflow-y-hidden hide-scrollbar outline-none"
        style={{ paddingTop: ITEM_HEIGHT, paddingBottom: ITEM_HEIGHT }}
        onClick={(e) => e.stopPropagation()}
      >
        {values.map((v, i) => {
          const isCurrent = i === currentIndex;
          return (
            <div
              key={v}
              className={`flex items-center justify-center select-none transition-all ${
                isCurrent
                  ? 'text-sm font-semibold text-gray-900'
                  : 'text-xs text-gray-400'
              }`}
              style={{ height: ITEM_HEIGHT }}
              onClick={(e) => {
                e.stopPropagation();
                startTyping();
              }}
            >
              {v.toFixed(Math.max(resolvedDecimals, (String(v).split('.')[1] || '').length))}{suffix}
            </div>
          );
        })}
      </div>
    </div>
  );
}
