import { SelectHTMLAttributes, ReactNode } from 'react';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  children: ReactNode;
};

export function Select({
  label,
  error,
  className = '',
  children,
  ...props
}: SelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-gray-300 text-sm font-medium">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-2 bg-gray-900 border ${
          error ? 'border-red-600' : 'border-gray-800'
        } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
