import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function RoleRoute({ allowedRoles = [], children }) {
  const { hasRole, primaryRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Checking permissions...</p>
        </div>
      </div>
    );
  }

  const hasPermission = allowedRoles.some((role) => hasRole(role));

  if (!hasPermission) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}

export default RoleRoute;
