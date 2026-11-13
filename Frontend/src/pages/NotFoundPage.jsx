import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../auth/AuthContext';

export function NotFoundPage() {
  const { isAuthenticated, getDashboardRoute } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-center">
      <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-6">
        <FileQuestion className="w-8 h-8" />
      </div>

      <span className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest font-mono">
        404 Not Found
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-3">
        Page Not Located
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8">
        The requested resource or page does not exist on the Bid Compliance Platform.
      </p>

      <div className="flex gap-3">
        {isAuthenticated ? (
          <Link to={getDashboardRoute()}>
            <Button variant="primary" icon={Home}>
              Go to Dashboard
            </Button>
          </Link>
        ) : (
          <Link to="/">
            <Button variant="primary" icon={Home}>
              Return to Home
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default NotFoundPage;
