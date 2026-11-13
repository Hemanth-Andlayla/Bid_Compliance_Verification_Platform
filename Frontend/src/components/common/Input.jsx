import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    required = false,
    className = '',
    id,
    type = 'text',
    prefixIcon: PrefixIcon,
    suffixIcon: SuffixIcon,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
          {required && <span className="text-orange-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {PrefixIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <PrefixIcon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={twMerge(
            clsx(
              'w-full rounded-lg text-sm bg-white dark:bg-slate-900 border transition-colors',
              'text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500',
              'focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500',
              'disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:opacity-75 disabled:cursor-not-allowed',
              PrefixIcon ? 'pl-9' : 'pl-3.5',
              SuffixIcon ? 'pr-9' : 'pr-3.5',
              'py-2',
              error
                ? 'border-rose-300 dark:border-rose-700 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-300 dark:border-slate-700',
              className
            )
          )}
          {...props}
        />

        {SuffixIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <SuffixIcon className="w-4 h-4" />
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
