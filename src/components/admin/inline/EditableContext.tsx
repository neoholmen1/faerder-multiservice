"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

export type EditableValues = Record<string, string | null>;

type Ctx = {
  initial: EditableValues;
  values: EditableValues;
  get: (key: string) => string | null;
  set: (key: string, value: string | null) => void;
  reset: () => void;
  dirty: boolean;
  diff: EditableValues;
};

const EditableContextInternal = createContext<Ctx | null>(null);

export function EditableProvider({
  initial,
  onAutoSave,
  children,
}: {
  initial: EditableValues;
  onAutoSave?: (key: string, value: string | null) => Promise<void> | void;
  children: ReactNode;
}) {
  const [values, setValues] = useState<EditableValues>(initial);
  const onAutoSaveRef = useRef(onAutoSave);
  onAutoSaveRef.current = onAutoSave;

  const get = useCallback((key: string) => values[key] ?? null, [values]);

  const set = useCallback((key: string, value: string | null) => {
    setValues((prev) => {
      if ((prev[key] ?? null) === (value ?? null)) return prev;
      return { ...prev, [key]: value };
    });
    if (onAutoSaveRef.current) {
      void onAutoSaveRef.current(key, value);
    }
  }, []);

  const reset = useCallback(() => setValues(initial), [initial]);

  const diff = useMemo<EditableValues>(() => {
    const changed: EditableValues = {};
    for (const key of Object.keys(values)) {
      if ((values[key] ?? null) !== (initial[key] ?? null)) {
        changed[key] = values[key] ?? null;
      }
    }
    return changed;
  }, [values, initial]);

  const dirty = Object.keys(diff).length > 0;

  const value = useMemo<Ctx>(
    () => ({ initial, values, get, set, reset, dirty, diff }),
    [initial, values, get, set, reset, dirty, diff],
  );

  return <EditableContextInternal.Provider value={value}>{children}</EditableContextInternal.Provider>;
}

export function useEditable() {
  const ctx = useContext(EditableContextInternal);
  if (!ctx) throw new Error("useEditable må brukes inne i <EditableProvider>");
  return ctx;
}
