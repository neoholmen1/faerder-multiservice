"use client";

import { useEffect, useRef, useState, createElement, type CSSProperties } from "react";

type Tag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div" | "footer" | "blockquote" | "li";

/**
 * Standalone contenteditable-felt med callback-basert lagring.
 * Brukes når vi IKKE har et EditableProvider rundt (f.eks. liste-kort
 * der hver rad eier sin egen lagring).
 *
 * Lagring fyrer automatisk på blur når innholdet har endret seg.
 */
export function EditableField({
  value,
  onSave,
  as = "span",
  className = "",
  multiline = false,
  placeholder,
  style,
}: {
  value: string;
  onSave: (next: string) => Promise<void> | void;
  as?: Tag;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing && ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  }, [value, editing]);

  async function handleBlur() {
    setEditing(false);
    const next = (ref.current?.textContent ?? "").trim();
    if (next === value.trim()) return;
    setSaving(true);
    try {
      await onSave(next);
    } finally {
      setSaving(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      if (ref.current) ref.current.textContent = value;
      ref.current?.blur();
    } else if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      ref.current?.blur();
    }
  }

  const editableClasses = "inline-editable";

  return createElement(
    as,
    {
      ref,
      contentEditable: true,
      suppressContentEditableWarning: true,
      role: "textbox",
      onFocus: () => setEditing(true),
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      "data-placeholder": placeholder,
      "data-saving": saving ? "true" : "false",
      className: `${className} ${editableClasses} cursor-text`,
      style,
    },
    value || placeholder || "",
  );
}
