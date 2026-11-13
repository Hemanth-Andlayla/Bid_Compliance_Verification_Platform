import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Building2, FileCheck, Send, CheckCircle2, AlertCircle, Clock, Shield } from 'lucide-react';
import { tenderApi } from '../../api/tenderApi';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';
import { formatDate, getStatusBadgeVariant } from '../../utils/formatters';

export function BidderTenderDetailPage() {
  const { id } = useParams();
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTender = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tenderApi.getTenderById(id);
      setTender(data);
    } catch (err) {
      console.error('Failed to load tender details:', err);
      setError(err.message || 'Unable to retrieve tender specifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTender();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/bidder/tenders" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Tenders
          </Link>
        </div>
        <Card>
          <CardContent className="p-8">
            <TableSkeleton rows={4} cols={3} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !tender) {
    return (
      <div className="space-y-6">
        <Link to="/bidder/tenders" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Tenders
        </Link>
        <ErrorState message={error || 'Tender was not found.'} onRetry={fetchTender} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/bidder/tenders"
          className="text-xs font-semibold text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tenders
        </Link>
      </div>

      {/* Tender Header Card */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-2xs font-mono text-slate-400 dark:text-slate-500">Tender #{tender.id}</span>
                <Badge variant={getStatusBadgeVariant(tender.status)} size="sm">
                  {tender.status || 'OPEN'}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {tender.title}
              </h1>
              {tender.organization && (
                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                  <Building2 className="w-4 h-4 text-orange-600" />
                  Issuing Agency: <span className="text-slate-800 dark:text-slate-200">{tender.organization}</span>
                </p>
              )}
            </div>

            <Link to={`/bidder/submit-bid?tenderId=${tender.id}`} className="shrink-0">
              <Button variant="primary" size="lg" icon={Send}>
                Submit Bid Proposal
              </Button>
            </Link>
          </div>

          {/* Metadata badges row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <Calendar className="w-3.5 h-3.5 text-orange-600" />
                <span>Submission Deadline</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {formatDate(tender.submissionDeadline, { includeTime: true })}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span>Published Date</span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {formatDate(tender.createdAt)}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <FileCheck className="w-3.5 h-3.5 text-orange-600" />
                <span>Document Criteria</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {tender.requirements?.length || 0} Mandated Items
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tender Overview</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
              {tender.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Requirements Card */}
      <Card>
        <CardHeader
          title="Mandatory Compliance & Document Requirements"
          subtitle="All submissions will be automatically validated and cross-checked against these criteria"
        />
        <CardContent className="p-0">
          {!tender.requirements || tender.requirements.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
              No specific document requirements specified for this tender. Standard statutory files (PAN, GST) apply.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    <th className="py-3 px-5">Requirement Type</th>
                    <th className="py-3 px-5">Description & Criteria</th>
                    <th className="py-3 px-5 text-center">Mandatory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {tender.requirements.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3.5 px-5 font-mono font-bold text-slate-900 dark:text-slate-100">
                        {req.requirementType}
                      </td>
                      <td className="py-3.5 px-5 text-slate-700 dark:text-slate-300">
                        {req.description}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        {req.mandatory ? (
                          <Badge variant="danger" size="sm">
                            Required
                          </Badge>
                        ) : (
                          <Badge variant="neutral" size="sm">
                            Optional
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default BidderTenderDetailPage;
