import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface EditableProps {
  value: string;
  onChange: (val: string) => void;
  onCommit?: () => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  as?: "div" | "span" | "h1" | "h2" | "h3" | "p";
  dir?: "ltr" | "rtl" | "auto";
}

export const Editable = ({
  value,
  onChange,
  onCommit,
  placeholder,
  className,
  multiline = false,
  as: Tag = "div",
  dir,
}: EditableProps) => {
  const ref = useRef<HTMLElement>(null);

  // Sync external value into DOM only when it differs and field isn't focused
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.activeElement !== el && el.innerText !== value) {
      el.innerText = value;
    }
  }, [value]);

  return (
    <Tag
      ref={ref as any}
      contentEditable
      suppressContentEditableWarning
      dir={dir}
      data-empty={!value}
      data-placeholder={placeholder}
      className={cn("editable", className)}
      onInput={(e) => onChange((e.target as HTMLElement).innerText)}
      onBlur={() => onCommit?.()}
      onKeyDown={(e) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          (e.target as HTMLElement).blur();
        }
      }}
    />
  );
};
