import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function AiDisclaimer({ className = '', variant = 'card' }) {
  if (variant === 'inline') {
    return (
      <div className={twMerge(clsx('flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-200/80 dark:border-amber-800/60', className))}>
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span>
          <strong>Decision Support:</strong> AI-generated analysis is provided as assistive decision support. The final decision is made by the Tender Officer.
        </span>
      </div>
    );
  }

  return (
    <div
      className={twMerge(
        clsx(
          'flex items-start gap-3.5 p-4 rounded-xl border border-amber-200/90 dark:border-amber-800/70 bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-amber-50/90 dark:from-amber-950/40 dark:via-slate-900 dark:to-amber-950/40 shadow-xs',
          className
        )
      )}
      role="note"
      aria-label="AI Decision Support Notice"
    >
      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles className="w-4 h-4" />
      </div>

      <div className="flex-1 text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100 mb-0.5">
          <span>AI Assistive Notice</span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-2xs bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-medium">
            <ShieldCheck className="w-3 h-3" /> Human-in-the-Loop
          </span>
        </div>
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          AI-generated analysis is provided as decision support. The final decision is made by the Tender Officer.
        </p>
      </div>
    </div>
  );
}

export default AiDisclaimer;
