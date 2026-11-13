import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  FileText,
  Send,
  History,
  Settings,
  ChevronRight,
  TrendingUp,
  Activity,
  UserCheck,
  Building2,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { adminApi } from '../../api/adminApi';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';
import { formatDate } from '../../utils/formatters';

export function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, tendersRes, bidsRes] = await Promise.allSettled([
        adminApi.getAllUsers(),
        adminApi.getAllTenders(),
        adminApi.getAllBids(),
      ]);

      if (usersRes.status === 'fulfilled') {
        setUsers(Array.isArray(usersRes.value) ? usersRes.value : []);
      }
      if (tendersRes.status === 'fulfilled') {
        setTenders(Array.isArray(tendersRes.value) ? tendersRes.value : []);
      }
      if (bidsRes.status === 'fulfilled') {
        setBids(Array.isArray(bidsRes.value) ? bidsRes.value : []);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      setError(err.message || 'Unable to load administration telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-2xs font-semibold backdrop-blur-xs">
            System Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Governance & Audit Dashboard
          </h1>
          <p className="text-sm text-orange-100 leading-relaxed">
            Welcome, Administrator. Monitor user registrations, active procurement tenders, incoming bid volume, and compliance logs across the enterprise.
          </p>

          <div className="pt-3 flex flex-wrap gap-3">
            <Link to="/admin/users">
              <Button variant="secondary" size="sm" icon={Users} className="bg-white text-orange-700 hover:bg-orange-50 border-transparent shadow-xs">
                Manage Users
              </Button>
            </Link>
            <Link to="/admin/audit-logs">
              <Button variant="outline" size="sm" icon={History} className="text-white border-white/40 hover:bg-white/10">
                View Audit Logs
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Users Registered</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{users.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Tenders</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{tenders.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Bid Submissions</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{bids.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">System Telemetry</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">Operational</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: User Overview & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Accounts Overview */}
        <Card>
          <CardHeader
            title="Registered Application Users"
            subtitle="Suppliers, evaluation officers, and platform accounts"
            action={
              <Link to="/admin/users" className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
                View All Users <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }
          />
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6">
                <TableSkeleton rows={4} cols={3} />
              </div>
            ) : error ? (
              <div className="p-6">
                <ErrorState message={error} onRetry={fetchAdminData} />
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No users found.</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.slice(0, 5).map((u) => (
                  <div key={u.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-xs shrink-0">
                        {u.name?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{u.name}</p>
                        <p className="text-2xs text-slate-500 dark:text-slate-400 truncate">{u.email}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-2xs text-slate-500 dark:text-slate-400 block">{u.organization || '—'}</span>
                      <span className="text-2xs text-slate-400">{formatDate(u.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Admin Controls */}
        <Card>
          <CardHeader title="Administration Tools" subtitle="Governance shortcuts and audit utilities" />
          <CardContent className="p-6 space-y-3">
            <Link
              to="/admin/users"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-orange-500 hover:bg-orange-50/40 dark:hover:bg-orange-950/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">User Management</h4>
                  <p className="text-2xs text-slate-500 dark:text-slate-400">Inspect registered users, Keycloak IDs, and organizations</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
            </Link>

            <Link
              to="/admin/audit-logs"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-orange-500 hover:bg-orange-50/40 dark:hover:bg-orange-950/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Audit Logs Query</h4>
                  <p className="text-2xs text-slate-500 dark:text-slate-400">Examine event logs for tenders, bids, and officer decisions</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
            </Link>

            <Link
              to="/admin/settings"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-orange-500 hover:bg-orange-50/40 dark:hover:bg-orange-950/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">System Environment</h4>
                  <p className="text-2xs text-slate-500 dark:text-slate-400">View Keycloak realm settings, backend endpoints, and services</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
