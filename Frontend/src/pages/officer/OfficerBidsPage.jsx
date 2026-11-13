import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Send, FileText, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { bidApi } from '../../api/bidApi';
import Card, { CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { TableSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { formatDate, formatCurrency, getStatusBadgeVariant } from '../../utils/formatters';

export function OfficerBidsPage() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchBids = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bidApi.getAllBids();
      setBids(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load bids:', err);
      setError(err.message || 'Unable to load bids.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, []);

  const filteredBids = bids.filter((b) => {
    const matchesSearch =
      String(b.id).includes(searchTerm) ||
      String(b.tenderId).includes(searchTerm) ||
      String(b.bidderId).includes(searchTerm) ||
      (b.status || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || (b.status || '').toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Submitted Bids for Review
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Conduct unified compliance verification and submit formal procurement decisions
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8 lg:col-span-9">
              <Input
                placeholder="Search by Bid ID, Tender ID, or Bidder ID..."
                prefixIcon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="sm:col-span-4 lg:col-span-3">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                placeholder=""
                options={[
                  { value: 'ALL', label: 'All Statuses' },
                  { value: 'SUBMITTED', label: 'Submitted (Pending)' },
                  { value: 'UNDER_REVIEW', label: 'Under Review' },
                  { value: 'ACCEPTED', label: 'Accepted' },
                  { value: 'REJECTED', label: 'Rejected' },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bids Listing */}
      {loading ? (
        <Card>
          <CardContent className="p-6">
            <TableSkeleton rows={5} cols={6} />
          </CardContent>
        </Card>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchBids} />
      ) : filteredBids.length === 0 ? (
        <EmptyState
          icon={Send}
          title={searchTerm || statusFilter !== 'ALL' ? 'No Matching Bids Found' : 'No Bids Received Yet'}
          description={
            searchTerm || statusFilter !== 'ALL'
              ? 'Try modifying your search or status filter.'
              : 'When suppliers submit proposals for your published tenders, they will appear here.'
          }
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  <th className="py-3 px-5">Bid Reference</th>
                  <th className="py-3 px-5">Target Tender</th>
                  <th className="py-3 px-5">Bidder Reference</th>
                  <th className="py-3 px-5">Quoted Price</th>
                  <th className="py-3 px-5">Submitted At</th>
                  <th className="py-3 px-5 text-center">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBids.map((bid) => (
                  <tr key={bid.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-900 dark:text-slate-100">
                      #{bid.id}
                    </td>
                    <td className="py-4 px-5">
                      <Link
                        to={`/officer/tenders/${bid.tenderId}`}
                        className="text-slate-700 dark:text-slate-300 hover:text-orange-600 font-medium flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        Tender #{bid.tenderId}
                      </Link>
                    </td>
                    <td className="py-4 px-5 font-mono text-slate-600 dark:text-slate-400">
                      Bidder #{bid.bidderId}
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
                        <Button
                          variant={bid.status === 'ACCEPTED' || bid.status === 'REJECTED' ? 'outline' : 'primary'}
                          size="sm"
                        >
                          {bid.status === 'ACCEPTED' || bid.status === 'REJECTED' ? 'View Review' : 'Review & Decide'}
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

export default OfficerBidsPage;
