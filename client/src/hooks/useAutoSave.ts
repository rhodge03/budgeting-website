import { useRef, useEffect, useCallback } from 'react';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  debounceMs?: number;
  enabled?: boolean;
}

export function useAutoSave<T>({
  data,
  onSave,
  debounceMs = 800,
  enabled = true,
}: UseAutoSaveOptions<T>) {
  const statusRef = useRef<SaveStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialMount = useRef(true);
  const latestData = useRef(data);
  const onSaveRef = useRef(onSave);

  // Keep refs current
  latestData.current = data;
  onSaveRef.current = onSave;

  const save = useCallback(async () => {
    statusRef.current = 'saving';
    try {
      await onSaveRef.current(latestData.current);
      statusRef.current = 'saved';
    } catch {
      statusRef.current = 'error';
    }
  }, []);

  useEffect(() => {
    // Skip the initial hydration render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!enabled) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, debounceMs, enabled, save]);

  return { status: statusRef.current };
}
