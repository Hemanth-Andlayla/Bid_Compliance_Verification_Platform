import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Bid Compliance Platform
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI-assisted bid compliance and verification.
              </p>
            </div>
          </div>

          {/* <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400">
            <a href="/#home" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              Home
            </a>
            <a href="/#about" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              About Us
            </a>
            <a href="/#features" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              Features
            </a>
            <a href="/#how-it-works" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              How It Works
            </a>
            <Link to="/login" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              Login
            </Link>
            <Link to="/register" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              Register
            </Link>
          </nav> */}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-900 text-center text-xs text-slate-400 dark:text-slate-500">
          © 2026 Bid Compliance Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
