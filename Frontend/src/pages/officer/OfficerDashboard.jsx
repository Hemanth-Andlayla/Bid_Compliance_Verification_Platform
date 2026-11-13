import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Send,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar,
  History,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { tenderApi } from '../../api/tenderApi';
import { bidApi } from '../../api/bidApi';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { formatDate, formatCurrency, getStatusBadgeVariant } from '../../utils/formatters';

export function OfficerDashboard() {
  const { user } = useAuth();
  const [tenders, setTenders] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tendersRes, bidsRes] = await Promise.allSettled([
        tenderApi.getAllTenders(),
        bidApi.getAllBids(),
      ]);

      if (tendersRes.status === 'fulfilled') {
        setTenders(Array.isArray(tendersRes.value) ? tendersRes.value : []);
      }
      if (bidsRes.status === 'fulfilled') {
        setBids(Array.isArray(bidsRes.value) ? bidsRes.value : []);
      }
    } catch (err) {
      console.error('Failed to load officer dashboard:', err);
      setError(err.message || 'Unable to retrieve officer workspace records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const activeTenders = tenders.filter((t) => (t.status || 'OPEN').toUpperCase() === 'OPEN');
  const pendingDecisions = bids.filter((b) => b.status === 'SUBMITTED' || b.status === 'UNDER_REVIEW');
  const decidedBids = bids.filter((b) => b.status === 'ACCEPTED' || b.status === 'REJECTED');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-2xs font-semibold backdrop-blur-xs">
            Procurement Authority
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Tender Officer Workspace
          </h1>
          <p className="text-sm text-orange-100 leading-relaxed">
            Welcome, {user?.name || 'Officer'}. Publish tender notices, oversee automated document compliance checks, and record binding procurement decisions.
          </p>

          <div className="pt-3 flex flex-wrap gap-3">
            <Link to="/officer/tenders/create">
              <Button variant="secondary" size="sm" icon={PlusCircle} className="bg-white text-orange-700 hover:bg-orange-50 border-transparent shadow-xs">
                Create New Tender
              </Button>
            </Link>
            <Link to="/officer/bids">
              <Button variant="outline" size="sm" icon={FileCheck} className="text-white border-white/40 hover:bg-white/10">
                Review Submitted Bids
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Tenders</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{activeTenders.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Bids Received</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{bids.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Decisions</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{pendingDecisions.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Decided Bids</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{decidedBids.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Review Section: Pending Reviews Table */}
      <Card>
        <CardHeader
          title="Pending Bid Reviews"
          subtitle="Bids awaiting Tender Officer verification review and final decision"
          action={
            <Link to="/officer/bids" className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
              View All Bids <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={4} cols={5} />
            </div>
          ) : error ? (
            <div className="p-6">
              <ErrorState message={error} onRetry={fetchDashboardData} />
            </div>
          ) : pendingDecisions.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={CheckCircle2}
                title="All Current Bids Reviewed"
                description="There are no pending submissions requiring your review decision at this time."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    <th className="py-3 px-5">Bid Reference</th>
                    <th className="py-3 px-5">Target Tender</th>
                    <th className="py-3 px-5">Quoted Price</th>
                    <th className="py-3 px-5">Submission Date</th>
                    <th className="py-3 px-5 text-center">Status</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pendingDecisions.slice(0, 6).map((bid) => (
                    <tr key={bid.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-5 font-bold text-slate-900 dark:text-slate-100">
                        #{bid.id}
                      </td>
                      <td className="py-4 px-5 font-medium text-slate-700 dark:text-slate-300">
                        Tender #{bid.tenderId}
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-900 dark:text-slate-100">
                        {formatCurrency(bid.quotedPrice)}
                      </td>
                      <td className="py-4 px-5 text-slate-500 dark:text-slate-400">
                        {formatDate(bid.submittedAt, { includeTime: true })}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <Badge variant={getStatusBadgeVariant(bid.status)} size="sm">
                          {bid.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <Link to={`/officer/bids/${bid.id}/review`}>
                          <Button variant="primary" size="sm">
                            Review Bid
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two Column Grid: My Tenders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Tenders */}
        <Card>
          <CardHeader
            title="Managed Tenders"
            subtitle="Procurement notices published on the platform"
            action={
              <Link to="/officer/tenders" className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }
          />
          <CardContent className="p-0">
            {tenders.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="No Tenders Published"
                  description="Publish your first procurement notice with mandatory document criteria."
                  actionLabel="Create Tender"
                  actionIcon={PlusCircle}
                  onAction={() => window.location.assign('/officer/tenders/create')}
                />
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {tenders.slice(0, 4).map((tender) => (
                  <div key={tender.id} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/officer/tenders/${tender.id}`}
                          className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-orange-600 truncate block"
                        >
                          {tender.title}
                        </Link>
                        <Badge variant={getStatusBadgeVariant(tender.status)} size="sm">
                          {tender.status || 'OPEN'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-2xs text-slate-500 dark:text-slate-400">
                        <span>Agency: {tender.organization || 'Procurement Board'}</span>
                        <span>Deadline: {formatDate(tender.submissionDeadline)}</span>
                      </div>
                    </div>

                    <Link to={`/officer/tenders/${tender.id}`} className="shrink-0">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader title="Officer Quick Actions" subtitle="Standard procurement administration workflows" />
          <CardContent className="p-6 space-y-3">
            <Link
              to="/officer/tenders/create"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-orange-500 hover:bg-orange-50/40 dark:hover:bg-orange-950/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Create New Tender</h4>
                  <p className="text-2xs text-slate-500 dark:text-slate-400">Define criteria, submission deadline, and mandatory documents</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
            </Link>

            <Link
              to="/officer/bids"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-orange-500 hover:bg-orange-50/40 dark:hover:bg-orange-950/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Review Submitted Bids</h4>
                  <p className="text-2xs text-slate-500 dark:text-slate-400">Inspect unified evidence and record binding decisions</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
            </Link>

            <Link
              to="/officer/tenders"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-orange-500 hover:bg-orange-50/40 dark:hover:bg-orange-950/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Manage All Tenders</h4>
                  <p className="text-2xs text-slate-500 dark:text-slate-400">View active notices, requirements, and submissions count</p>
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

export default OfficerDashboard;
