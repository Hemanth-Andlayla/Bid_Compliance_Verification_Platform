import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Building2, FileText, Send, Compass } from 'lucide-react';
import { tenderApi } from '../../api/tenderApi';
import Card, { CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { TableSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { formatDate, getStatusBadgeVariant } from '../../utils/formatters';

export function BidderTendersPage() {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchTenders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tenderApi.getAllTenders();
      setTenders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load tenders:', err);
      setError(err.message || 'Unable to retrieve tender notices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  const filteredTenders = tenders.filter((t) => {
    const matchesSearch =
      (t.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.organization || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || (t.status || 'OPEN').toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Available Tenders
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Explore active procurement notices and statutory submission requirements
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8 lg:col-span-9">
              <Input
                placeholder="Search tenders by keyword, description, or issuing agency..."
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
                  { value: 'OPEN', label: 'Open for Bidding' },
                  { value: 'CLOSED', label: 'Closed' },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tenders Listing */}
      {loading ? (
        <Card>
          <CardContent className="p-6">
            <TableSkeleton rows={4} cols={4} />
          </CardContent>
        </Card>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchTenders} />
      ) : filteredTenders.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No Matching Tenders Found"
          description={
            searchTerm || statusFilter !== 'ALL'
              ? 'Try modifying your search filter criteria.'
              : 'There are currently no active tenders published in the system.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTenders.map((tender) => (
            <Card key={tender.id} className="hover:border-orange-300 dark:hover:border-orange-800 transition-colors">
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      to={`/bidder/tenders/${tender.id}`}
                      className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      {tender.title}
                    </Link>
                    <Badge variant={getStatusBadgeVariant(tender.status)} size="sm">
                      {tender.status || 'OPEN'}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {tender.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-2xs text-slate-500 dark:text-slate-400 pt-1">
                    {tender.organization && (
                      <span className="flex items-center gap-1 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {tender.organization}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Deadline: <strong>{formatDate(tender.submissionDeadline, { includeTime: true })}</strong>
                    </span>
                    {tender.requirements && (
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        {tender.requirements.length} Requirements
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                  <Link to={`/bidder/tenders/${tender.id}`}>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </Link>
                  <Link to={`/bidder/submit-bid?tenderId=${tender.id}`}>
                    <Button variant="primary" size="sm" icon={Send}>
                      Submit Bid
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default BidderTendersPage;
