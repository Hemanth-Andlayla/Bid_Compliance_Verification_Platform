import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Send,
  History,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  DollarSign,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { tenderApi } from '../../api/tenderApi';
import { bidApi } from '../../api/bidApi';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Skeleton, { CardSkeleton, TableSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { formatDate, formatCurrency, getStatusBadgeVariant } from '../../utils/formatters';

export function BidderDashboard() {
  const { user } = useAuth();
  const [tenders, setTenders] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
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
        const allBids = Array.isArray(bidsRes.value) ? bidsRes.value : [];
        setBids(allBids);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hasBids = bids.length > 0;
  const underReviewBids = bids.filter((b) => b.status === 'UNDER_REVIEW' || b.status === 'SUBMITTED');
  const acceptedBids = bids.filter((b) => b.status === 'ACCEPTED');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-2xs font-semibold backdrop-blur-xs">
            Bidder Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Bidder'}
          </h1>
          <p className="text-sm text-orange-100 leading-relaxed">
            Discover active tenders, prepare compliance-verified submissions, and monitor proposal reviews in real time.
          </p>

          <div className="pt-3 flex flex-wrap gap-3">
            <Link to="/bidder/tenders">
              <Button variant="secondary" size="sm" icon={Compass} className="bg-white text-orange-700 hover:bg-orange-50 border-transparent shadow-xs">
                Browse Tenders
              </Button>
            </Link>
            <Link to="/bidder/submit-bid">
              <Button variant="outline" size="sm" icon={Send} className="text-white border-white/40 hover:bg-white/10">
                Submit a Bid
              </Button>
            </Link>
          </div>
        </div>

        {/* Subtle decorative background circles */}
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Metrics Row (shown when user has bids or active activity) */}
      {hasBids && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Bids</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{bids.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Available Tenders</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{tenders.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Under Review</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{underReviewBids.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Accepted</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{acceptedBids.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Getting Started Guide (Always useful, especially for first-time bidders) */}
      <Card>
        <CardHeader title="Getting Started Guide" subtitle="Follow these three structured steps to participate in procurement" />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm shrink-0">
                1
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">Explore Tenders</h4>
                <p className="text-2xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Review open procurement notices and inspect mandatory certification requirements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">Submit Your Bid</h4>
                <p className="text-2xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Provide commercial pricing and upload required statutory certificates (PAN, GST, MSME).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">Track Submission</h4>
                <p className="text-2xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Monitor document processing, compliance checks, and final Tender Officer decisions.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: Available Tenders & My Recent Bids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Tenders */}
        <Card>
          <CardHeader
            title="Available Tenders"
            subtitle="Open procurement requests open for bidding"
            action={
              <Link to="/bidder/tenders" className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }
          />
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6">
                <TableSkeleton rows={3} cols={3} />
              </div>
            ) : error ? (
              <div className="p-6">
                <ErrorState message={error} onRetry={fetchData} />
              </div>
            ) : tenders.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="No Open Tenders"
                  description="There are currently no active tenders published by procurement officers."
                />
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {tenders.slice(0, 4).map((tender) => (
                  <div key={tender.id} className="p-5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/bidder/tenders/${tender.id}`}
                          className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-orange-600 dark:hover:text-orange-400 transition-colors truncate block"
                        >
                          {tender.title}
                        </Link>
                        <Badge variant={getStatusBadgeVariant(tender.status)} size="sm">
                          {tender.status || 'OPEN'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-2xs text-slate-500 dark:text-slate-400">
                        {tender.organization && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {tender.organization}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Deadline: {formatDate(tender.submissionDeadline)}
                        </span>
                      </div>
                    </div>

                    <Link to={`/bidder/submit-bid?tenderId=${tender.id}`} className="shrink-0">
                      <Button variant="outline" size="sm" icon={Send}>
                        Bid
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Recent Bids */}
        <Card>
          <CardHeader
            title="My Recent Bids"
            subtitle="Status of your submitted proposals"
            action={
              hasBids ? (
                <Link to="/bidder/bids" className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ) : null
            }
          />
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6">
                <TableSkeleton rows={3} cols={3} />
              </div>
            ) : error ? (
              <div className="p-6">
                <ErrorState message={error} onRetry={fetchData} />
              </div>
            ) : !hasBids ? (
              <div className="p-8">
                <EmptyState
                  icon={History}
                  title="You haven't submitted any bids yet"
                  description="Explore currently available tenders to prepare and submit your first verified bid proposal."
                  actionLabel="Explore Tenders"
                  actionIcon={Compass}
                  onAction={() => window.location.assign('/bidder/tenders')}
                />
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {bids.slice(0, 4).map((bid) => (
                  <div key={bid.id} className="p-5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/bidder/bids/${bid.id}`}
                          className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                        >
                          Bid #{bid.id}
                        </Link>
                        <Badge variant={getStatusBadgeVariant(bid.status)} size="sm">
                          {bid.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-2xs text-slate-500 dark:text-slate-400">
                        <span>Tender ID: #{bid.tenderId}</span>
                        <span>Quoted: <strong>{formatCurrency(bid.quotedPrice)}</strong></span>
                        <span>Submitted: {formatDate(bid.submittedAt)}</span>
                      </div>
                    </div>

                    <Link to={`/bidder/bids/${bid.id}`} className="shrink-0">
                      <Button variant="ghost" size="sm" icon={ChevronRight}>
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default BidderDashboard;
