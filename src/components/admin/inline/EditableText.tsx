"use client";

import { createElement, useEffect, useRef, useState, type CSSProperties } from "react";
import { useEditable } from "./EditableContext";

type Tag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

export default function EditableText({
  fieldKey,
  fallback,
  as = "span",
  className,
  style,
  multiline = false,
  preserveLineBreaks = false,
}: {
  fieldKey: string;
  fallback?: string;
  as?: Tag;
  className?: string;
  style?: CSSProperties;
  multiline?: boolean;
  preserveLineBreaks?: boolean;
}) {
  const { get, set } = useEditable();
  const value = get(fieldKey);
  const ref = useRef<HTMLElement>(null);
  const [editing, setEditing] = useState(false);

  const displayValue = value ?? fallback ?? "";

  useEffect(() => {
    if (!editing && ref.current && ref.current.textContent !== displayValue) {
      ref.current.textContent = displayValue;
    }
  }, [displayValue, editing]);

  function handleFocus() {
    setEditing(true);
  }

  function handleBlur() {
    if (!ref.current) return;
    const next = (ref.current.textContent ?? "").trim();
    setEditing(false);
    const cleanValue = next === "" || next === fallback?.trim() ? null : next;
    set(fieldKey, cleanValue);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      if (ref.current) ref.current.textContent = displayValue;
      ref.current?.blur();
    } else if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      ref.current?.blur();
    }
  }

  const editableClasses =
    "outline-none rounded-md transition-[box-shadow,background-color] duration-150 " +
    "ring-0 ring-offset-0 " +
    "hover:bg-orange-50/50 hover:shadow-[inset_0_0_0_1px_rgba(232,114,28,0.25)] " +
    "focus:bg-white focus:shadow-[inset_0_0_0_1.5px_#E8721C] " +
    "data-[empty=true]:text-[#a3a3a3] data-[empty=true]:italic";

  const styleWithBreaks: CSSProperties | undefined = preserveLineBreaks
    ? { ...style, whiteSpace: "pre-line" }
    : style;

  return createElement(
    as,
    {
      ref,
      contentEditable: true,
      suppressContentEditableWarning: true,
      role: "textbox",
      "aria-label": `Rediger ${fieldKey}`,
      "data-empty": displayValue === "" ? "true" : "false",
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      className: `${className ?? ""} ${editableClasses} cursor-text`,
      style: styleWithBreaks,
    },
    displayValue,
  );
}
