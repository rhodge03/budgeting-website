import { useRef, useEffect, useCallback } from 'react';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  debounceMs?: number;
  enabled?: boolean;
  key?: string; // When key changes (e.g. earner switch), flush pending save and reset
}

export function useAutoSave<T>({
  data,
  onSave,
  debounceMs = 800,
  enabled = true,
  key = '',
}: UseAutoSaveOptions<T>) {
  const statusRef = useRef<SaveStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');
  const isHydrated = useRef(false);
  const latestData = useRef(data);
  const onSaveRef = useRef(onSave);
  // Captures the onSave callback at the time data last changed,
  // so flushing on earner switch saves with the correct earner's callback
  const pendingOnSaveRef = useRef(onSave);

  // Keep refs current
  latestData.current = data;
  onSaveRef.current = onSave;

  const serialized = JSON.stringify(data);

  const flushPending = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const current = JSON.stringify(latestData.current);
    if (current !== lastSavedRef.current && isHydrated.current) {
      try {
        await pendingOnSaveRef.current(latestData.current);
        lastSavedRef.current = current;
      } catch {
        // ignore flush errors
      }
    }
  }, []);

  // When key changes, flush pending save for the OLD key, then reset hydration
  const prevKeyRef = useRef(key);
  useEffect(() => {
    if (prevKeyRef.current !== key && prevKeyRef.current !== '') {
      flushPending();
      isHydrated.current = false;
      lastSavedRef.current = '';
    }
    prevKeyRef.current = key;
  }, [key, flushPending]);

  // Flush on unmount
  useEffect(() => {
    return () => { flushPending(); };
  }, [flushPending]);

  useEffect(() => {
    if (!isHydrated.current) {
      isHydrated.current = true;
      lastSavedRef.current = serialized;
      return;
    }

    if (serialized === lastSavedRef.current) return;
    if (!enabled) return;

    // Capture onSave at the time data changes (correct earner in closure)
    pendingOnSaveRef.current = onSaveRef.current;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const current = JSON.stringify(latestData.current);
      if (current === lastSavedRef.current) return;
      statusRef.current = 'saving';
      try {
        await pendingOnSaveRef.current(latestData.current);
        lastSavedRef.current = current;
        statusRef.current = 'saved';
      } catch {
        statusRef.current = 'error';
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [serialized, debounceMs, enabled]);

  return { status: statusRef.current };
}
