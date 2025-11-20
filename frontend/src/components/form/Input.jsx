"use client";

export default function Input({ label, type = "text", placeholder, id, name, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm text-[color:var(--color-brand)]">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        id={id}
        name={name}
        className="border border-[color:var(--color-brand-light)] w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand)] focus:border-[color:var(--color-brand)] focus:ring-opacity-50 transition duration-200 ease-in-out text-[color:var(--foreground)]"
        {...props}
      />
    </div>
  );
}
