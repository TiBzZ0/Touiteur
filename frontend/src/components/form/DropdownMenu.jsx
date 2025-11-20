"use client";

import { useState, useRef, useEffect } from "react";

export default function DropdownMenu({ options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 rounded-lg bg-[color:var(--toggle-background)] text-[color:var(--toggle-text)] font-semibold shadow-sm hover:shadow-md transition"
      >
        {options.find(opt => opt.value === selected)?.label}
      </button>

      {open && (
        <div className="absolute mt-2 w-full bg-[color:var(--color-background)] rounded-lg shadow-xl z-50 py-2 border border-gray-200 dark:border-gray-700 transition-all">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 transition-colors rounded-md mx-1 my-0.5 
                ${selected === option.value 
                  ? "bg-[color:var(--color-brand-light)] text-[color:var(--color-brand)] font-semibold"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-[color:var(--toggle-text)]"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
