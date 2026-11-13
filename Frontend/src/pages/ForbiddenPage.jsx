import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../auth/AuthContext';
import { ROLE_LABELS } from '../utils/constants';

export function ForbiddenPage() {
  const { primaryRole, getDashboardRoute } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <span className="text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest font-mono">
        403 Access Forbidden
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-3">
        Unauthorized Portal Access
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8">
        Your current account is authenticated as <strong className="text-slate-800 dark:text-slate-200">{ROLE_LABELS[primaryRole] || 'User'}</strong>, which does not have permission to access this protected area.
      </p>

      <Link to={getDashboardRoute()}>
        <Button variant="primary" icon={Home}>
          Return to My Dashboard
        </Button>
      </Link>
    </div>
  );
}

export default ForbiddenPage;
