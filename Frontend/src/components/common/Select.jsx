import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Select = forwardRef(function Select(
  {
    label,
    error,
    helperText,
    required = false,
    options = [],
    className = '',
    id,
    placeholder = 'Select an option...',
    ...props
  },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
          {required && <span className="text-orange-500 ml-1">*</span>}
        </label>
      )}

      <select
        ref={ref}
        id={selectId}
        className={twMerge(
          clsx(
            'w-full rounded-lg text-sm bg-white dark:bg-slate-900 border transition-colors',
            'text-slate-900 dark:text-slate-100',
            'focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500',
            'disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:opacity-75 disabled:cursor-not-allowed',
            'px-3.5 py-2',
            error
              ? 'border-rose-300 dark:border-rose-700 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-300 dark:border-slate-700',
            className
          )
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>

      {error ? (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Select;
