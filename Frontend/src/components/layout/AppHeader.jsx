import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LogOut,
  User,
  ChevronDown,
  LayoutDashboard,
  FileText,
  Send,
  PlusCircle,
  Users,
  History,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { Badge } from '../common/Badge';
import { ROLES, ROLE_LABELS } from '../../utils/constants';

export function AppHeader() {
  const { user, primaryRole, logout, getDashboardRoute } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    logout();
  };

  // Role-specific navigation links
  const getNavLinks = () => {
    if (primaryRole === ROLES.BIDDER) {
      return [
        { name: 'Dashboard', path: '/bidder/dashboard', icon: LayoutDashboard },
        { name: 'Browse Tenders', path: '/bidder/tenders', icon: FileText },
        { name: 'Submit Bid', path: '/bidder/submit-bid', icon: Send },
        { name: 'My Bids', path: '/bidder/bids', icon: History },
      ];
    }
    if (primaryRole === ROLES.OFFICER) {
      return [
        { name: 'Dashboard', path: '/officer/dashboard', icon: LayoutDashboard },
        { name: 'Tenders', path: '/officer/tenders', icon: FileText },
        { name: 'Create Tender', path: '/officer/tenders/create', icon: PlusCircle },
        { name: 'Submitted Bids', path: '/officer/bids', icon: Send },
      ];
    }
    if (primaryRole === ROLES.ADMIN) {
      return [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Audit Logs', path: '/admin/audit-logs', icon: History },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  const isCurrentPath = (path) => {
    return location.pathname === path || (path !== getDashboardRoute() && location.pathname.startsWith(path));
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Branding & Role Portal */}
          <div className="flex items-center gap-6">
            <Link to={getDashboardRoute()} className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-sm shadow-orange-600/30 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 block leading-tight">
                  Bid<span className="text-orange-600">Compliance</span>
                </span>
                <span className="text-2xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  {ROLE_LABELS[primaryRole] || 'Portal'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const active = isCurrentPath(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      active
                        ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions, Theme, Profile */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors focus:outline-none"
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs ring-1 ring-slate-300 dark:ring-slate-700">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                    {user?.name || 'Account'}
                  </div>
                  <div className="text-2xs text-slate-500 dark:text-slate-400">
                    {ROLE_LABELS[primaryRole] || 'User'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
                    <p className="text-2xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
                    {user?.organization && (
                      <p className="text-2xs text-slate-500 dark:text-slate-400 truncate">
                        Org: <span className="font-medium text-slate-700 dark:text-slate-300">{user.organization}</span>
                      </p>
                    )}
                    <div className="mt-2">
                      <Badge variant="brand" size="sm">
                        {ROLE_LABELS[primaryRole] || primaryRole}
                      </Badge>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Profile Details
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-5 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isCurrentPath(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

export default AppHeader;
