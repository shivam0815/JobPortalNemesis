import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
};

export default function ComboBox({
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(value);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => setQ(value), [value]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current && !ref.current.contains(t)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return options.slice(0, 10);
    return options
      .filter((x) => x.toLowerCase().includes(s))
      .slice(0, 10);
  }, [q, options]);

  return (
    <div ref={ref} className="relative">
      <input
        value={q}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQ(e.target.value);
          onChange(e.target.value); // free text allowed
          setOpen(true);
        }}
        className="h-11 w-full rounded-2xl bg-white border border-white/20 px-4 text-sm text-[#061433] outline-none focus:border-white/60 focus:ring-2 focus:ring-white/25 disabled:opacity-60"
      />

      {open && !disabled && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl bg-white border border-black/10 shadow-lg overflow-hidden">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-black/60">No suggestions</div>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setQ(opt);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-black/5"
              >
                {opt}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
