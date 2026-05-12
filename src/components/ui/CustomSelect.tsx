"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "../../lib/utils";

type SelectOption = {
  label: string;
  value: string;
};

interface CustomSelectProps {
  options: SelectOption[];
  name?: string;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  panelClassName?: string;
  onChange?: (value: string) => void;
}

export default function CustomSelect({
  options,
  name,
  defaultValue,
  value,
  placeholder,
  className,
  buttonClassName,
  panelClassName,
  onChange,
}: CustomSelectProps) {
  const fallbackValue = defaultValue ?? options[0]?.value ?? "";
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(fallbackValue);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonId = useId();
  const listboxId = useId();

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const currentValue = value ?? selectedValue;
  const selectedOption = options.find((option) => option.value === currentValue);

  function handleSelect(nextValue: string) {
    setSelectedValue(nextValue);
    onChange?.(nextValue);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {name ? <input type="hidden" name={name} value={currentValue} /> : null}

      <button
        id={buttonId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "input-field flex w-full items-center justify-between rounded-[22px] border border-rose-200 bg-white px-5 py-4 text-left text-[15px] font-medium text-[#5a4545] shadow-[0_8px_24px_rgba(214,156,161,0.08)] transition-all duration-200 focus:border-rose-300 focus:outline-none focus:ring-rose-200",
          buttonClassName,
        )}
      >
        <span>{selectedOption?.label ?? placeholder ?? ""}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 flex-none text-rose-300 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={buttonId}
          className={cn(
            "absolute z-50 mt-2 w-full overflow-hidden rounded-[20px] border border-rose-100 bg-white shadow-[0_16px_40px_rgba(214,156,161,0.22)] ring-1 ring-rose-50",
            panelClassName,
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === currentValue;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                className="flex w-full items-center justify-between px-5 py-3.5 text-left text-[14px] font-medium text-[#5a4545] transition-colors duration-150 hover:bg-rose-50 hover:text-rose-400"
              >
                <span>{option.label}</span>
                {isSelected ? (
                  <Check className="h-4 w-4 flex-none text-rose-300" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
