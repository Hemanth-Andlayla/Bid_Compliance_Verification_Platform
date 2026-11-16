
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  File,
  Check,
  X,
  Eye,
} from 'lucide-react';

import { bidApi } from '../../api/bidApi';
import { tenderApi } from '../../api/tenderApi';
import { documentApi } from '../../api/documentApi';
import { decisionApi } from '../../api/decisionApi';
import { aiApi } from '../../api/aiApi';

import { useToast } from '../../context/ToastContext';

import Card, {
  CardHeader,
  CardContent,
} from '../../components/common/Card';

import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import AiDisclaimer from '../../components/common/AiDisclaimer';
import { TableSkeleton } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';

import {
  formatDate,
  formatCurrency,
  formatFileSize,
  getStatusBadgeVariant,
} from '../../utils/formatters';


export function UnifiedBidReviewPage() {

  const { id } = useParams();

  const toast = useToast();


  // --------------------------------------------------
  // Page State
  // --------------------------------------------------

  const [bid, setBid] = useState(null);

  const [tender, setTender] = useState(null);

  const [documents, setDocuments] = useState([]);

  const [existingDecision, setExistingDecision] =
    useState(null);

  const [aiSummary, setAiSummary] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  // --------------------------------------------------
  // Decision Modal State
  // --------------------------------------------------

  const [decisionModalOpen, setDecisionModalOpen] =
    useState(false);

  const [selectedDecision, setSelectedDecision] =
    useState(null);

  const [remarks, setRemarks] =
    useState('');

  const [isSubmittingDecision, setIsSubmittingDecision] =
    useState(false);


  // --------------------------------------------------
  // Document State
  // --------------------------------------------------

  const [openingDocumentId, setOpeningDocumentId] =
    useState(null);


  // --------------------------------------------------
  // Load Page Data
  // --------------------------------------------------

  const fetchUnifiedData = async () => {

    setLoading(true);
    setError(null);

    try {

      const bidData =
        await bidApi.getBidById(id);

      setBid(bidData);


      const [
        tenderRes,
        docsRes,
        decisionRes,
        aiRes
      ] =
        await Promise.allSettled([

          bidData.tenderId
            ? tenderApi.getTenderById(
                bidData.tenderId
              )
            : Promise.reject(),

          documentApi.getDocumentsByBidId(id),

          decisionApi.getDecisionByBidId(id),

          aiApi.getSummaryByBidId(id),

        ]);


      // --------------------------------------------------
      // Tender
      // --------------------------------------------------

      if (
        tenderRes.status === 'fulfilled'
      ) {

        setTender(
          tenderRes.value
        );

      }


      // --------------------------------------------------
      // Documents
      // --------------------------------------------------

      if (
        docsRes.status === 'fulfilled' &&
        Array.isArray(docsRes.value)
      ) {

        setDocuments(
          docsRes.value
        );

      } else if (
        Array.isArray(bidData.documents)
      ) {

        setDocuments(
          bidData.documents
        );

      }


      // --------------------------------------------------
      // Existing Officer Decision
      // --------------------------------------------------

      if (
        decisionRes.status === 'fulfilled' &&
        decisionRes.value?.decision
      ) {

        setExistingDecision(
          decisionRes.value
        );

      }


      // --------------------------------------------------
      // AI Summary
      // --------------------------------------------------

      if (
        aiRes.status === 'fulfilled' &&
        aiRes.value
      ) {

        setAiSummary(
          aiRes.value
        );

      }

    } catch (err) {

      console.error(
        'Failed to load unified bid review data:',
        err
      );

      setError(
        err.message ||
        'Unable to load bid review data.'
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchUnifiedData();

  }, [id]);


  // --------------------------------------------------
  // Decision Modal
  // --------------------------------------------------

  const openDecisionModal =
    (decisionType) => {

      setSelectedDecision(
        decisionType
      );

      setRemarks('');

      setDecisionModalOpen(true);

    };


  // --------------------------------------------------
  // Submit Officer Decision
  // --------------------------------------------------

  const handleConfirmDecision =
    async () => {

      if (!selectedDecision) {
        return;
      }

      setIsSubmittingDecision(true);

      try {

        const result =
          await decisionApi.submitDecision(
            id,
            {
              decision:
                selectedDecision,

              remarks:
                remarks.trim() ||
                undefined,
            }
          );


        setExistingDecision(
          result
        );


        setBid(
          (previous) => ({
            ...previous,
            status:
              selectedDecision,
          })
        );


        setDecisionModalOpen(
          false
        );


        toast.success(
          `Bid has been marked as ${selectedDecision}.`,
          'Officer Decision Recorded'
        );

      } catch (err) {

        console.error(
          'Failed to record officer decision:',
          err
        );

        toast.error(
          err.message ||
          'Failed to submit officer decision.'
        );

      } finally {

        setIsSubmittingDecision(
          false
        );

      }

    };


  // --------------------------------------------------
  // View Uploaded Document
  // --------------------------------------------------

  const handleViewDocument =
    async (document) => {

      setOpeningDocumentId(
        document.id
      );

      try {

        const response =
          await documentApi.getDocumentFile(
            document.id
          );


        let blob;


        if (
          response instanceof Blob
        ) {

          blob = response;

        } else if (
          response?.data instanceof Blob
        ) {

          blob = response.data;

        } else {

          throw new Error(
            'The document could not be loaded.'
          );

        }


        const fileUrl =
          window.URL.createObjectURL(
            blob
          );


        window.open(
          fileUrl,
          '_blank',
          'noopener,noreferrer'
        );


        setTimeout(() => {

          window.URL.revokeObjectURL(
            fileUrl
          );

        }, 60000);

      } catch (err) {

        console.error(
          'Failed to open document:',
          err
        );

        toast.error(
          err.message ||
          'Unable to open the document.'
        );

      } finally {

        setOpeningDocumentId(
          null
        );

      }

    };


  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {

    return (

      <div className="space-y-6">

        <div className="flex items-center gap-2">

          <Link
            to="/officer/bids"
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >

            <ArrowLeft className="w-3.5 h-3.5" />

            Back to Submitted Bids

          </Link>

        </div>


        <Card>

          <CardContent className="p-8">

            <TableSkeleton
              rows={5}
              cols={4}
            />

          </CardContent>

        </Card>

      </div>

    );

  }


  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error || !bid) {

    return (

      <div className="space-y-6">

        <Link
          to="/officer/bids"
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
        >

          <ArrowLeft className="w-3.5 h-3.5" />

          Back to Submitted Bids

        </Link>


        <ErrorState
          message={
            error ||
            'Bid submission could not be retrieved.'
          }
          onRetry={
            fetchUnifiedData
          }
        />

      </div>

    );

  }


  const isDecided =
    Boolean(existingDecision) ||
    bid.status === 'ACCEPTED' ||
    bid.status === 'REJECTED';


  return (

    <div className="space-y-8">


      {/* ==================================================
          BACK
      ================================================== */}

      <div>

        <Link
          to="/officer/bids"
          className="text-xs font-semibold text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 transition-colors"
        >

          <ArrowLeft className="w-4 h-4" />

          Back to Submitted Bids

        </Link>

      </div>


      {/* ==================================================
          SECTION 1 — BID REVIEW HEADER
      ================================================== */}

      <Card>

        <CardContent className="p-6 sm:p-8 space-y-6">


          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">


            <div className="space-y-2">


              <div className="flex items-center gap-2.5">

                <span className="text-xs font-mono text-slate-400">

                  Bid Evaluation Dossier

                </span>


                <Badge
                  variant={
                    getStatusBadgeVariant(
                      bid.status
                    )
                  }
                  size="md"
                >

                  {bid.status}

                </Badge>

              </div>


              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">

                Bid Review

              </h1>


              {tender && (

                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">

                  <FileText className="w-4 h-4 text-orange-600" />

                  Target Tender:

                  <Link
                    to={`/officer/tenders/${tender.id}`}
                    className="text-orange-600 hover:underline"
                  >

                    {tender.title}

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

                  {formatCurrency(
                    bid.quotedPrice
                  )}

                </span>

              </div>


              {!isDecided ? (

                <div className="flex items-center gap-2">

                  <Button
                    variant="danger"
                    size="sm"
                    icon={X}
                    onClick={() =>
                      openDecisionModal(
                        'REJECTED'
                      )
                    }
                  >

                    Reject Bid

                  </Button>


                  <Button
                    variant="success"
                    size="sm"
                    icon={Check}
                    onClick={() =>
                      openDecisionModal(
                        'ACCEPTED'
                      )
                    }
                  >

                    Accept Bid

                  </Button>

                </div>

              ) : (

                <Badge
                  variant={
                    bid.status === 'ACCEPTED'
                      ? 'success'
                      : 'danger'
                  }
                  size="lg"
                >

                  Final Decision:{' '}

                  {bid.status}

                </Badge>

              )}

            </div>

          </div>


          {/* Metadata */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">


            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">

              <span className="text-2xs text-slate-500 dark:text-slate-400 font-semibold block mb-0.5">

                Submission Timestamp

              </span>


              <p className="text-xs font-medium text-slate-900 dark:text-slate-100">

                {formatDate(
                  bid.submittedAt,
                  {
                    includeTime: true
                  }
                )}

              </p>

            </div>


            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">

              <span className="text-2xs text-slate-500 dark:text-slate-400 font-semibold block mb-0.5">

                Documents Submitted

              </span>


              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">

                {documents.length} Files

              </p>

            </div>


            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">

              <span className="text-2xs text-slate-500 dark:text-slate-400 font-semibold block mb-0.5">

                Current Workflow Status

              </span>


              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">

                {bid.status}

              </p>

            </div>


          </div>


          {/* Existing Officer Decision */}

          {existingDecision && (

            <div
              className={`p-4 rounded-xl border ${
                existingDecision.decision ===
                'ACCEPTED'

                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'

                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100'
              }`}
            >

              <div className="flex items-center justify-between mb-1">

                <span className="font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">

                  <ShieldCheck className="w-4 h-4" />

                  Binding Decision:{' '}

                  {existingDecision.decision}

                </span>


                <span className="text-2xs opacity-80">

                  Decided:{' '}

                  {formatDate(
                    existingDecision.decidedAt,
                    {
                      includeTime: true
                    }
                  )}

                </span>

              </div>


              {existingDecision.remarks ? (

                <p className="text-xs mt-1 opacity-90">

                  <strong>
                    Officer Remarks:
                  </strong>{' '}

                  {existingDecision.remarks}

                </p>

              ) : (

                <p className="text-xs mt-1 opacity-80 italic">

                  No additional remarks noted.

                </p>

              )}

            </div>

          )}

        </CardContent>

      </Card>


      {/* ==================================================
          SECTION 2 — AI OVERALL ANALYSIS
      ================================================== */}

      <Card>

        <CardHeader
          title="AI-Assisted Overall Analysis"
          subtitle="Automated decision-support summary based on document extraction, compliance, cross-verification, and external verification results"
          action={

            <Badge
              variant="brand"
              size="sm"
            >

              <Sparkles className="w-3.5 h-3.5 mr-1 text-orange-500" />

              Decision Support

            </Badge>

          }
        />


        <CardContent className="space-y-6">

          <AiDisclaimer />


          {aiSummary ? (

            <div className="space-y-5">


              {/* Summary */}

              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">

                <div className="flex items-center gap-2 mb-3">

                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />

                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">

                    Overall Summary

                  </h4>

                </div>


                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">

                  {aiSummary.summary ||
                    'No overall summary is available.'}

                </p>

              </div>


              {/* Findings + Risk */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800">

                  <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-3">

                    <FileText className="w-4 h-4 text-orange-500" />

                    Key Findings

                  </h5>


                  {Array.isArray(
                    aiSummary.keyFindings
                  ) &&
                  aiSummary.keyFindings.length > 0 ? (

                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-4">

                      {aiSummary.keyFindings.map(
                        (finding, index) => (

                          <li key={index}>
                            {finding}
                          </li>

                        )
                      )}

                    </ul>

                  ) : (

                    <p className="text-xs text-slate-500 dark:text-slate-400">

                      No key findings available.

                    </p>

                  )}

                </div>


                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800">

                  <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-3">

                    <AlertTriangle className="w-4 h-4 text-amber-500" />

                    Risk Assessment

                  </h5>


                  <div className="mb-3">

                    <Badge
                      variant={
                        aiSummary.riskLevel ===
                        'LOW'
                          ? 'success'
                          : aiSummary.riskLevel ===
                            'HIGH'
                          ? 'danger'
                          : 'warning'
                      }
                      size="md"
                    >

                      {aiSummary.riskLevel ||
                        'NOT AVAILABLE'}

                    </Badge>

                  </div>


                  <p className="text-xs text-slate-600 dark:text-slate-400">

                    {aiSummary.recommendation ||
                      'No recommendation is available.'}

                  </p>

                </div>

              </div>


              {/* Generated time */}

              {aiSummary.generatedAt && (

                <div className="flex items-center gap-2 text-2xs text-slate-400">

                  <Clock className="w-3.5 h-3.5" />

                  Analysis generated:{' '}

                  {formatDate(
                    aiSummary.generatedAt,
                    {
                      includeTime: true
                    }
                  )}

                </div>

              )}

            </div>

          ) : (

            <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-center space-y-2">

              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto">

                <Clock className="w-4 h-4" />

              </div>


              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">

                AI Analysis Not Available Yet

              </h4>


              <p className="text-2xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">

                The automated analysis may still be processing or no completed analysis has been recorded for this submission.

              </p>

            </div>

          )}

        </CardContent>

      </Card>


      {/* ==================================================
          SECTION 3 — UPLOADED DOCUMENTS
      ================================================== */}

      <Card>

        <CardHeader
          title="Uploaded Documents"
          subtitle="Review the original documents submitted with this bid"
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

                    <th className="py-3 px-5">
                      Document Type
                    </th>

                    <th className="py-3 px-5">
                      Filename
                    </th>

                    <th className="py-3 px-5">
                      File Size
                    </th>

                    <th className="py-3 px-5">
                      Uploaded At
                    </th>

                    <th className="py-3 px-5 text-right">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                  {documents.map(
                    (document) => (

                      <tr
                        key={document.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                      >

                        <td className="py-3.5 px-5 font-mono font-bold text-slate-900 dark:text-slate-100">

                          {document.documentType}

                        </td>


                        <td className="py-3.5 px-5 text-slate-700 dark:text-slate-300 font-medium">

                          <div className="flex items-center gap-2">

                            <File className="w-3.5 h-3.5 text-slate-400" />

                            {document.fileName}

                          </div>

                        </td>


                        <td className="py-3.5 px-5 font-mono text-slate-500 dark:text-slate-400">

                          {formatFileSize(
                            document.fileSize
                          )}

                        </td>


                        <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400">

                          {formatDate(
                            document.uploadedAt,
                            {
                              includeTime: true
                            }
                          )}

                        </td>


                        <td className="py-3.5 px-5 text-right">

                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Eye}
                            isLoading={
                              openingDocumentId ===
                              document.id
                            }
                            onClick={() =>
                              handleViewDocument(
                                document
                              )
                            }
                          >

                            View Document

                          </Button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </CardContent>

      </Card>


      {/* ==================================================
          SECTION 4 — VERIFICATION OVERVIEW
      ================================================== */}

      <Card>

        <CardHeader
          title="Verification Overview"
          subtitle="Summary of the automated checks performed before officer review"
        />


        <CardContent>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">

              <div className="flex items-center justify-between">

                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">

                  Document Compliance

                </span>

                <Badge
                  variant="brand"
                  size="sm"
                >

                  Automated

                </Badge>

              </div>


              <p className="text-2xs text-slate-600 dark:text-slate-400 leading-relaxed">

                Checks whether the documents required by the tender are present and whether mandatory requirements are satisfied.

              </p>

            </div>


            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">

              <div className="flex items-center justify-between">

                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">

                  Cross-Verification

                </span>

                <Badge
                  variant="brand"
                  size="sm"
                >

                  Automated

                </Badge>

              </div>


              <p className="text-2xs text-slate-600 dark:text-slate-400 leading-relaxed">

                Compares extracted bidder information across submitted documents and identifies possible inconsistencies.

              </p>

            </div>


            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">

              <div className="flex items-center justify-between">

                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">

                  External Verification

                </span>

                <Badge
                  variant="brand"
                  size="sm"
                >

                  Automated

                </Badge>

              </div>


              <p className="text-2xs text-slate-600 dark:text-slate-400 leading-relaxed">

                Verifies extracted document information against the configured external or mock verification services.

              </p>

            </div>


          </div>

        </CardContent>

      </Card>


      {/* ==================================================
          SECTION 5 — FINAL OFFICER DECISION
      ================================================== */}

      {!isDecided && (

        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/40 dark:bg-orange-950/20">

          <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">


            <div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">

                Ready to Record Binding Procurement Decision?

              </h3>


              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">

                As the authorized Tender Officer, your decision will update the official bid status and be permanently recorded.

              </p>

            </div>


            <div className="flex items-center gap-3 shrink-0">

              <Button
                variant="danger"
                size="md"
                icon={X}
                onClick={() =>
                  openDecisionModal(
                    'REJECTED'
                  )
                }
              >

                Reject Bid

              </Button>


              <Button
                variant="success"
                size="md"
                icon={Check}
                onClick={() =>
                  openDecisionModal(
                    'ACCEPTED'
                  )
                }
              >

                Accept Bid

              </Button>

            </div>

          </CardContent>

        </Card>

      )}


      {/* ==================================================
          DECISION MODAL
      ================================================== */}

      <Modal
        isOpen={
          decisionModalOpen
        }
        onClose={() =>
          setDecisionModalOpen(false)
        }
        title={
          selectedDecision ===
          'ACCEPTED'
            ? 'Confirm Bid Acceptance'
            : 'Confirm Bid Rejection'
        }
        subtitle="Record the final procurement officer decision"
        footer={

          <>

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setDecisionModalOpen(
                  false
                )
              }
            >

              Cancel

            </Button>


            <Button
              variant={
                selectedDecision ===
                'ACCEPTED'
                  ? 'success'
                  : 'danger'
              }
              size="sm"
              isLoading={
                isSubmittingDecision
              }
              onClick={
                handleConfirmDecision
              }
              icon={
                selectedDecision ===
                'ACCEPTED'
                  ? Check
                  : X
              }
            >

              Confirm Decision

            </Button>

          </>

        }
      >

        <div className="space-y-4">


          <div
            className={`p-4 rounded-xl border ${
              selectedDecision ===
              'ACCEPTED'

                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'

                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
            }`}
          >

            <div className="flex items-center gap-2">

              {selectedDecision ===
              'ACCEPTED' ? (

                <CheckCircle2 className="w-5 h-5 text-emerald-600" />

              ) : (

                <XCircle className="w-5 h-5 text-rose-600" />

              )}


              <span className="font-bold text-sm">

                {selectedDecision ===
                'ACCEPTED'
                  ? 'Accept this bid'
                  : 'Reject this bid'}

              </span>

            </div>


            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">

              This action records the final procurement decision for this submission.

            </p>

          </div>


          <div>

            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">

              Officer Remarks
              <span className="font-normal text-slate-400">
                {' '}(optional)
              </span>

            </label>


            <textarea
              value={remarks}
              onChange={(event) =>
                setRemarks(
                  event.target.value
                )
              }
              rows={4}
              placeholder="Enter any remarks supporting the final decision..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 resize-none"
            />

          </div>

        </div>

      </Modal>

    </div>

  );

}


export default UnifiedBidReviewPage;
