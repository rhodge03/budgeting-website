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
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [isTyping, setIsTyping] = useState(false);
  const [typedValue, setTypedValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate values array
  const values = useMemo(() => {
    const arr: number[] = [];
    // Use epsilon-safe iteration
    const count = Math.round((max - min) / step);
    for (let i = 0; i <= count; i++) {
      const v = min + i * step;
      arr.push(Number(v.toFixed(resolvedDecimals)));
    }
    return arr;
  }, [min, max, step, resolvedDecimals]);

  // Find index of current value
  const currentIndex = useMemo(() => {
    const idx = values.findIndex((v) => Math.abs(v - value) < step / 2);
    return idx >= 0 ? idx : 0;
  }, [values, value, step]);

  // Scroll to value on mount and when value changes externally
  useEffect(() => {
    const el = containerRef.current;
    if (!el || isScrollingRef.current) return;
    const targetScroll = currentIndex * ITEM_HEIGHT;
    el.scrollTop = targetScroll;
  }, [currentIndex]);

  // Handle scroll end — detect which value is centered
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    isScrollingRef.current = true;

    scrollTimeoutRef.current = setTimeout(() => {
      const el = containerRef.current;
      if (!el) return;
      const scrollTop = el.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(values.length - 1, index));

      // Snap to nearest item
      el.scrollTop = clampedIndex * ITEM_HEIGHT;

      const newValue = values[clampedIndex];
      if (newValue !== undefined && Math.abs(newValue - value) >= step / 2) {
        onChange(newValue);
      }
      isScrollingRef.current = false;
    }, 80);
  }, [values, value, step, onChange]);

  // Mouse wheel handler for finer control
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
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

  // Switch to typing mode
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
      // Snap to nearest step
      const snapped = Math.round((parsed - min) / step) * step + min;
      const clamped = Math.max(min, Math.min(max, Number(snapped.toFixed(resolvedDecimals))));
      onChange(clamped);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  return (
    <div className="inline-flex flex-col items-center gap-1">
      {/* Scroll drum */}
      <div
        className="relative w-[80px] overflow-hidden rounded-lg border border-gray-200 bg-white"
        style={{ height: CONTAINER_HEIGHT }}
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
          onScroll={handleScroll}
          onWheel={handleWheel}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className="h-full overflow-y-auto scroll-snap-y hide-scrollbar outline-none"
          style={{ paddingTop: ITEM_HEIGHT, paddingBottom: ITEM_HEIGHT }}
        >
          {values.map((v, i) => {
            const isCurrent = i === currentIndex;
            return (
              <div
                key={v}
                className={`snap-center flex items-center justify-center select-none transition-all ${
                  isCurrent
                    ? 'text-sm font-semibold text-gray-900'
                    : 'text-xs text-gray-400'
                }`}
                style={{ height: ITEM_HEIGHT }}
              >
                {v.toFixed(resolvedDecimals)}{suffix}
              </div>
            );
          })}
        </div>
      </div>

      {/* Type-in fallback */}
      {isTyping ? (
        <div className="flex items-center gap-0.5">
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
            className="w-16 px-1.5 py-0.5 text-xs text-center border border-blue-300 rounded focus:outline-none"
          />
          <span className="text-xs text-gray-400">{suffix}</span>
        </div>
      ) : (
        <button
          onClick={startTyping}
          className="text-[10px] text-blue-500 hover:text-blue-700 transition-colors"
        >
          type a value
        </button>
      )}
    </div>
  );
}
