import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, LogIn, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import Button from '../../components/common/Button';
import PublicNavbar from '../../components/layout/PublicNavbar';
import Footer from '../../components/layout/Footer';

export function LoginPage() {
  const { isAuthenticated, login, getDashboardRoute, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || getDashboardRoute();
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location, getDashboardRoute]);

  const handleLogin = () => {
    const returnUrl = location.state?.from?.pathname || window.location.origin;
    login({ redirectUri: returnUrl });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Platform Login
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Single Sign-On authentication powered by Keycloak OIDC
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                <Lock className="w-4 h-4 text-orange-600" />
                <span>Unified Role Authentication</span>
              </div>
              <p className="text-2xs text-slate-500 dark:text-slate-400">
                Bidders, Tender Officers, and Administrators log in through our central identity provider with role-based routing.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleLogin}
                variant="primary"
                size="lg"
                className="w-full"
                icon={LogIn}
                isLoading={isLoading}
              >
                Sign In with Keycloak
              </Button>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-orange-600 dark:text-orange-400 hover:underline">
                Register as Bidder or Officer
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LoginPage;
