import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Shield,
  Download,
  File,
} from 'lucide-react';
import { bidApi } from '../../api/bidApi';
import { tenderApi } from '../../api/tenderApi';
import { documentApi } from '../../api/documentApi';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { TableSkeleton } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';
import { formatDate, formatCurrency, formatFileSize, getStatusBadgeVariant } from '../../utils/formatters';

export function BidderBidDetailPage() {
  const { id } = useParams();
  const [bid, setBid] = useState(null);
  const [tender, setTender] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBidDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const bidData = await bidApi.getBidById(id);
      setBid(bidData);

      // Fetch tender details & documents in parallel
      const [tenderRes, docsRes] = await Promise.allSettled([
        bidData.tenderId ? tenderApi.getTenderById(bidData.tenderId) : Promise.reject(),
        documentApi.getDocumentsByBidId(id),
      ]);

      if (tenderRes.status === 'fulfilled') {
        setTender(tenderRes.value);
      }
      if (docsRes.status === 'fulfilled' && Array.isArray(docsRes.value)) {
        setDocuments(docsRes.value);
      } else if (Array.isArray(bidData.documents)) {
        setDocuments(bidData.documents);
      }
    } catch (err) {
      console.error('Failed to load bid details:', err);
      setError(err.message || 'Unable to retrieve bid submission details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBidDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Link to="/bidder/bids" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Bids
        </Link>
        <Card>
          <CardContent className="p-8">
            <TableSkeleton rows={4} cols={3} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !bid) {
    return (
      <div className="space-y-6">
        <Link to="/bidder/bids" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Bids
        </Link>
        <ErrorState message={error || 'Bid submission was not found.'} onRetry={fetchBidDetails} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/bidder/bids"
          className="text-xs font-semibold text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Bids
        </Link>
      </div>

      {/* Header Card */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500">Submission Reference</span>
                <Badge variant={getStatusBadgeVariant(bid.status)} size="md">
                  {bid.status}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Bid Submission #{bid.id}
              </h1>
              {tender && (
                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                  <FileText className="w-4 h-4 text-orange-600" />
                  Target Tender:{' '}
                  <Link to={`/bidder/tenders/${tender.id}`} className="text-orange-600 hover:underline">
                    {tender.title} (#{tender.id})
                  </Link>
                </p>
              )}
            </div>

            <div className="text-right p-4 rounded-xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-900/50">
              <span className="text-2xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
                Total Quoted Price
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {formatCurrency(bid.quotedPrice)}
              </span>
            </div>
          </div>

          {/* Submission Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <Calendar className="w-3.5 h-3.5 text-orange-600" />
                <span>Submitted At</span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {formatDate(bid.submittedAt, { includeTime: true })}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span>Last Updated</span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {formatDate(bid.updatedAt, { includeTime: true })}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <FileCheck className="w-3.5 h-3.5 text-orange-600" />
                <span>Documents Uploaded</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {documents.length} Files Attached
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Documents List */}
      <Card>
        <CardHeader
          title="Attached Compliance Documents"
          subtitle="Official certificates and declarations submitted for automated OCR parsing and validation"
        />
        <CardContent className="p-0">
          {documents.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No document records returned for this bid.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                      <File className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {doc.documentType}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {doc.fileName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-2xs text-slate-500 dark:text-slate-400">
                        <span>Size: {formatFileSize(doc.fileSize)}</span>
                        <span>MIME: {doc.mimeType || 'application/octet-stream'}</span>
                        <span>Uploaded: {formatDate(doc.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <Badge variant="success" size="sm">
                    Ingested
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default BidderBidDetailPage;
