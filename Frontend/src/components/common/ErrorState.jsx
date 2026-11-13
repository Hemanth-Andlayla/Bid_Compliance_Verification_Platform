import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({
  title = 'Failed to load content',
  message = 'An unexpected error occurred while communicating with the server.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl">
      <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h4 className="text-base font-semibold text-rose-900 dark:text-rose-200 mb-1">{title}</h4>
      <p className="text-sm text-rose-700/80 dark:text-rose-300/70 max-w-md mb-5">{message}</p>

      {onRetry && (
        <Button onClick={onRetry} variant="secondary" size="sm" icon={RefreshCw}>
          Retry Request
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
