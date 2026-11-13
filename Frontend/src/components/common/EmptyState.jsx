import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items to display at this moment.',
  actionLabel,
  onAction,
  actionIcon,
  actionTo,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
      <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4 ring-8 ring-orange-50/50 dark:ring-orange-950/20">
        <Icon className="w-7 h-7" />
      </div>

      <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>

      {actionLabel && (
        <Button
          onClick={onAction}
          icon={actionIcon}
          variant="primary"
          size="sm"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
