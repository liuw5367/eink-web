import type { ReactNode } from 'react';

interface SettingRowProps {
  label: string;
  sub?: string;
  children: ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

export function SettingRow({ label, sub, children, onClick, danger }: SettingRowProps) {
  return (
    <div
      className={`flex items-center justify-between px-3.5 py-[11px] border-b border-gray-100 gap-3 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex-1">
        <div
          className={`text-[13px] font-semibold ${danger ? 'text-red-600' : ''}`}
        >
          {label}
        </div>
        {sub && (
          <div className="text-[10px] mt-0.5" style={{ color: 'var(--light-gray)' }}>
            {sub}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <label className="toggle" onClick={(e) => e.stopPropagation()}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="t-slider" />
    </label>
  );
}

interface SelectProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export function Select({ value, options, onChange }: SelectProps) {
  return (
    <select
      className="border-2 border-black bg-white px-2 py-[5px] text-[12px] font-semibold cursor-pointer outline-none min-w-[80px]"
      style={{ fontFamily: "'Noto Serif SC', serif" }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

interface InputProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function Input({ value, placeholder, onChange }: InputProps) {
  return (
    <input
      className="border-2 border-black px-2 py-[5px] text-[12px] outline-none min-w-[100px]"
      style={{ fontFamily: "'Noto Serif SC', serif" }}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
    />
  );
}

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimeInput({ value, onChange }: TimeInputProps) {
  return (
    <input
      type="time"
      className="border-2 border-black px-2 py-[5px] text-[12px] font-mono w-[78px] outline-none text-center"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
    />
  );
}
