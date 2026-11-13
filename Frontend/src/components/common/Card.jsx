import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs transition-shadow',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '', children }) {
  return (
    <div
      className={twMerge(
        clsx('px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4', className)
      )}
    >
      {children || (
        <>
          <div>
            {title && <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </>
      )}
    </div>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={twMerge(clsx('p-6', className))} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div
      className={twMerge(
        clsx('px-6 py-3.5 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 rounded-b-xl flex items-center justify-between gap-4', className)
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
