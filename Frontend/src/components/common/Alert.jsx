import React from 'react';
import { Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Alert({
  variant = 'info',
  title,
  children,
  className = '',
  icon: CustomIcon,
  action,
}) {
  const variants = {
    info: {
      container: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200',
      icon: Info,
      iconColor: 'text-sky-600 dark:text-sky-400',
    },
    success: {
      container: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    warning: {
      container: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    error: {
      container: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200',
      icon: XCircle,
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
  };

  const current = variants[variant] || variants.info;
  const IconComponent = CustomIcon || current.icon;

  return (
    <div className={twMerge(clsx('flex items-start gap-3 p-4 rounded-xl border text-sm', current.container, className))} role="alert">
      <IconComponent className={clsx('w-5 h-5 shrink-0 mt-0.5', current.iconColor)} />
      <div className="flex-1 min-w-0">
        {title && <h5 className="font-semibold mb-0.5">{title}</h5>}
        <div className="opacity-90">{children}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default Alert;
