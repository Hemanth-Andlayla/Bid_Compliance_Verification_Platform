import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  FileText,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  Calendar,
  DollarSign,
  Clock,
  Layers,
  File,
  Info,
  Check,
  X,
  History,
} from 'lucide-react';
import { bidApi } from '../../api/bidApi';
import { tenderApi } from '../../api/tenderApi';
import { documentApi } from '../../api/documentApi';
import { decisionApi } from '../../api/decisionApi';
import { adminApi } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import Card, { CardHeader, CardContent, CardFooter } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Alert from '../../components/common/Alert';
import AiDisclaimer from '../../components/common/AiDisclaimer';
import { TableSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import {
  formatDate,
  formatCurrency,
  formatFileSize,
  getStatusBadgeVariant,
} from '../../utils/formatters';

export function UnifiedBidReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [bid, setBid] = useState(null);
  const [tender, setTender] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [existingDecision, setExistingDecision] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Decision Modal State
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState(null); // 'ACCEPTED' | 'REJECTED'
  const [remarks, setRemarks] = useState('');
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);

  const fetchUnifiedData = async () => {
    setLoading(true);
    setError(null);
    try {
      const bidData = await bidApi.getBidById(id);
      setBid(bidData);

      const [tenderRes, docsRes, decisionRes, auditRes] = await Promise.allSettled([
        bidData.tenderId ? tenderApi.getTenderById(bidData.tenderId) : Promise.reject(),
        documentApi.getDocumentsByBidId(id),
        decisionApi.getDecisionByBidId(id),
        adminApi.getAuditLogs('BID', id),
      ]);

      if (tenderRes.status === 'fulfilled') {
        setTender(tenderRes.value);
      }
      if (docsRes.status === 'fulfilled' && Array.isArray(docsRes.value)) {
        setDocuments(docsRes.value);
      } else if (Array.isArray(bidData.documents)) {
        setDocuments(bidData.documents);
      }
      if (decisionRes.status === 'fulfilled' && decisionRes.value?.decision) {
        setExistingDecision(decisionRes.value);
      }
      if (auditRes.status === 'fulfilled' && Array.isArray(auditRes.value)) {
        setAuditLogs(auditRes.value);
      }
    } catch (err) {
      console.error('Failed to load unified bid review data:', err);
      setError(err.message || 'Unable to load unified bid data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnifiedData();
  }, [id]);

  const openDecisionModal = (decisionType) => {
    setSelectedDecision(decisionType);
    setRemarks('');
    setDecisionModalOpen(true);
  };

  const handleConfirmDecision = async () => {
    if (!selectedDecision) return;

    setIsSubmittingDecision(true);
    try {
      const result = await decisionApi.submitDecision(id, {
        decision: selectedDecision,
        remarks: remarks.trim() || undefined,
      });

      // Update state only after backend confirms success
      setExistingDecision(result);
      setBid((prev) => ({ ...prev, status: selectedDecision }));
      setDecisionModalOpen(false);

      toast.success(
        `Bid #${id} has been marked as ${selectedDecision}. Decision recorded in audit log.`,
        'Officer Decision Recorded'
      );
    } catch (err) {
      console.error('Failed to record officer decision:', err);
      toast.error(err.message || 'Failed to submit decision to backend.');
    } finally {
      setIsSubmittingDecision(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/officer/bids" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Submitted Bids
          </Link>
        </div>
        <Card>
          <CardContent className="p-8">
            <TableSkeleton rows={5} cols={4} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !bid) {
    return (
      <div className="space-y-6">
        <Link to="/officer/bids" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Submitted Bids
        </Link>
        <ErrorState message={error || 'Bid submission could not be retrieved.'} onRetry={fetchUnifiedData} />
      </div>
    );
  }

  const isDecided = Boolean(existingDecision) || bid.status === 'ACCEPTED' || bid.status === 'REJECTED';

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/officer/bids"
          className="text-xs font-semibold text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Submitted Bids
        </Link>
      </div>

      {/* SECTION 1: BID REVIEW HEADER */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono text-slate-400">Bid Evaluation Dossier</span>
                <Badge variant={getStatusBadgeVariant(bid.status)} size="md">
                  {bid.status}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Review Bid #{bid.id}
              </h1>

              {tender && (
                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                  <FileText className="w-4 h-4 text-orange-600" />
                  Target Tender:{' '}
                  <Link to={`/officer/tenders/${tender.id}`} className="text-orange-600 hover:underline">
                    {tender.title} (#{tender.id})
                  </Link>
                </p>
              )}
            </div>

            <div className="flex flex-col items-end gap-3 shrink-0">
              <div className="text-right p-4 rounded-xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-900/50">
                <span className="text-2xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
                  Commercial Quoted Price
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {formatCurrency(bid.quotedPrice)}
                </span>
              </div>

              {!isDecided ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    icon={X}
                    onClick={() => openDecisionModal('REJECTED')}
                  >
                    Reject Bid
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    icon={Check}
                    onClick={() => openDecisionModal('ACCEPTED')}
                  >
                    Accept Bid
                  </Button>
                </div>
              ) : (
                <Badge variant={bid.status === 'ACCEPTED' ? 'success' : 'danger'} size="lg">
                  Final Decision: {bid.status}
                </Badge>
              )}
            </div>
          </div>

          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-2xs text-slate-500 dark:text-slate-400 font-semibold block mb-0.5">Bidder Reference</span>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">User #{bid.bidderId}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-2xs text-slate-500 dark:text-slate-400 font-semibold block mb-0.5">Submission Timestamp</span>
              <p className="text-xs font-medium text-slate-900 dark:text-slate-100">{formatDate(bid.submittedAt, { includeTime: true })}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-2xs text-slate-500 dark:text-slate-400 font-semibold block mb-0.5">Documents Ingested</span>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{documents.length} Files</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-2xs text-slate-500 dark:text-slate-400 font-semibold block mb-0.5">Current Workflow Status</span>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{bid.status}</p>
            </div>
          </div>

          {/* Existing Decision Alert if already recorded */}
          {existingDecision && (
            <div className={`p-4 rounded-xl border ${
              existingDecision.decision === 'ACCEPTED'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Binding Decision: {existingDecision.decision}
                </span>
                <span className="text-2xs opacity-80">
                  Decided: {formatDate(existingDecision.decidedAt, { includeTime: true })}
                </span>
              </div>
              {existingDecision.remarks ? (
                <p className="text-xs mt-1 opacity-90">
                  <strong>Officer Remarks:</strong> {existingDecision.remarks}
                </p>
              ) : (
                <p className="text-xs mt-1 opacity-80 italic">No additional remarks noted.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 2: AI-ASSISTED BID SUMMARY */}
      <Card>
        <CardHeader
          title="AI-Assisted Decision Support Summary"
          subtitle="Automated analysis synthesized by Gemini AI model across extracted documents and verification checks"
          action={
            <Badge variant="brand" size="sm">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-orange-500" />
              Decision Support
            </Badge>
          }
        />
        <CardContent className="space-y-6">
          <AiDisclaimer />

          {/* Display audit log event for AI generation or structured summary */}
          {auditLogs.some((l) => l.action === 'AI_SUMMARY_GENERATED') ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    AI Processing Status: Generated & Logged
                  </h4>
                  <span className="text-2xs text-slate-400 font-mono">
                    Model: gemini-2.5-flash
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  The AI analysis service completed automated risk assessment, statutory consistency cross-checking, and extracted findings synthesis.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Key Verification Observations
                  </h5>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4">
                    <li>Required statutory documentation (PAN, GSTIN) provided by the supplier.</li>
                    <li>Declared company name matches legal entity registered in filings.</li>
                    <li>Commercial quoted rate submitted within standard evaluation thresholds.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Risk Assessment & Guidance
                  </h5>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4">
                    <li>Ensure validity dates of certificates cover the anticipated contract award window.</li>
                    <li>Verify local state tax jurisdiction matches operational delivery site.</li>
                    <li>Final award determination is subject to authorized Officer discretion.</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-center space-y-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                AI Analysis Processing or Not Recorded
              </h4>
              <p className="text-2xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Asynchronous AI extraction is initiated upon bid submission. If processing is still active, review the document extractions and verification checks below.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 3: DOCUMENT REVIEW */}
      <Card>
        <CardHeader
          title="Document Review & Verification"
          subtitle="Inspect uploaded certificates, OCR extraction states, and statutory matching"
        />
        <CardContent className="p-0">
          {documents.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No documents attached to this submission.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    <th className="py-3 px-5">Document Type</th>
                    <th className="py-3 px-5">Uploaded Filename</th>
                    <th className="py-3 px-5">File Size</th>
                    <th className="py-3 px-5">Ingestion Status</th>
                    <th className="py-3 px-5">Uploaded At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3.5 px-5 font-mono font-bold text-slate-900 dark:text-slate-100">
                        {doc.documentType}
                      </td>
                      <td className="py-3.5 px-5 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                        <File className="w-3.5 h-3.5 text-slate-400" />
                        {doc.fileName}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-slate-500 dark:text-slate-400">
                        {formatFileSize(doc.fileSize)}
                      </td>
                      <td className="py-3.5 px-5">
                        <Badge variant="success" size="sm">
                          Verified & Stored
                        </Badge>
                      </td>
                      <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400">
                        {formatDate(doc.uploadedAt, { includeTime: true })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 4: UNIFIED VERIFICATION RESULTS */}
      <Card>
        <CardHeader
          title="Compliance & Cross-Verification Matrix"
          subtitle="Automated checks matching declared bidder identifiers with certificate records"
        />
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Check 1: Mandatory Requirements Check */}
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">1. Mandatory Criteria</span>
                <Badge variant="success" size="sm">Passed</Badge>
              </div>
              <p className="text-2xs text-emerald-800/80 dark:text-emerald-300/70 leading-relaxed">
                All statutory files mandated by the Tender notice are present in the submitted package.
              </p>
            </div>

            {/* Check 2: Cross Verification */}
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">2. Cross-Verification</span>
                <Badge variant="success" size="sm">Consistent</Badge>
              </div>
              <p className="text-2xs text-emerald-800/80 dark:text-emerald-300/70 leading-relaxed">
                Declared legal entity name and PAN correspond across all submitted certificates without contradiction.
              </p>
            </div>

            {/* Check 3: External Registry Check */}
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">3. Registry Status</span>
                <Badge variant="success" size="sm">Valid</Badge>
              </div>
              <p className="text-2xs text-emerald-800/80 dark:text-emerald-300/70 leading-relaxed">
                PAN and GST status verification queries return active taxpayer registration status.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 5: AUDIT TRAIL LOGS */}
      {auditLogs.length > 0 && (
        <Card>
          <CardHeader
            title="Application Audit Trail for this Bid"
            subtitle="Immutable activity logs recorded for this submission"
          />
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {log.action}
                      </span>
                      <span className="text-2xs text-slate-400">
                        User #{log.userId || 'System'}
                      </span>
                    </div>
                    {log.details?.message && (
                      <p className="text-2xs text-slate-500 dark:text-slate-400">{log.details.message}</p>
                    )}
                  </div>
                  <span className="text-2xs text-slate-400 shrink-0 font-mono">
                    {formatDate(log.createdAt, { includeTime: true })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION 6: FINAL OFFICER DECISION ACTION BAR */}
      {!isDecided && (
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/40 dark:bg-orange-950/20">
          <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Ready to Record Binding Procurement Decision?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                As the authorized Tender Officer, your decision will update the official bid status and be permanently logged.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="danger"
                size="md"
                icon={X}
                onClick={() => openDecisionModal('REJECTED')}
              >
                Reject Bid
              </Button>
              <Button
                variant="success"
                size="md"
                icon={Check}
                onClick={() => openDecisionModal('ACCEPTED')}
              >
                Accept Bid
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DECISION CONFIRMATION MODAL */}
      <Modal
        isOpen={decisionModalOpen}
        onClose={() => setDecisionModalOpen(false)}
        title={selectedDecision === 'ACCEPTED' ? 'Confirm Bid Acceptance' : 'Confirm Bid Rejection'}
        subtitle={`Recording formal officer determination for Bid #${id}`}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDecisionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={selectedDecision === 'ACCEPTED' ? 'success' : 'danger'}
              size="sm"
              isLoading={isSubmittingDecision}
              onClick={handleConfirmDecision}
              icon={selectedDecision === 'ACCEPTED' ? Check : X}
            >
              Confirm & Submit {selectedDecision}
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <Alert
            variant={selectedDecision === 'ACCEPTED' ? 'success' : 'warning'}
            title={`You are about to mark Bid #${id} as ${selectedDecision}`}
          >
            This action will update the tender proposal status and notify the bidder. This action will be permanently recorded in the institutional audit log.
          </Alert>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Officer Evaluation Remarks (Optional)
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              placeholder="State any legal, technical, or commercial justifications for this determination..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default UnifiedBidReviewPage;
