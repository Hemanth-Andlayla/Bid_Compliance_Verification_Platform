import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Upload,
  Plus,
  Trash2,
  FileCheck,
  Send,
  Building2,
  AlertCircle,
  FileText,
  DollarSign,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { tenderApi } from '../../api/tenderApi';
import { bidApi } from '../../api/bidApi';
import { useToast } from '../../context/ToastContext';
import Card, { CardHeader, CardContent, CardFooter } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';
import { DOCUMENT_TYPES } from '../../utils/constants';
import { formatFileSize } from '../../utils/formatters';

export function SubmitBidPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [tenders, setTenders] = useState([]);
  const [selectedTenderId, setSelectedTenderId] = useState(searchParams.get('tenderId') || '');
  const [loadingTenders, setLoadingTenders] = useState(true);

  // Form states
  const [quotedPrice, setQuotedPrice] = useState('');
  const [bidderDetails, setBidderDetails] = useState({
    name: user?.name || '',
    pan: '',
    gstin: '',
    udyamNumber: '',
    address: '',
  });

  // Dynamic document uploads: list of { id, documentType, file }
  const [documents, setDocuments] = useState([
    { id: '1', documentType: 'PAN', file: null },
    { id: '2', documentType: 'GST', file: null },
  ]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fetch available tenders
  useEffect(() => {
    async function loadTenders() {
      setLoadingTenders(true);
      try {
        const data = await tenderApi.getAllTenders();
        const list = Array.isArray(data) ? data : [];
        setTenders(list);

        // Preselect if query param matched or default to first tender
        const paramId = searchParams.get('tenderId');
        if (paramId && list.some((t) => String(t.id) === String(paramId))) {
          setSelectedTenderId(paramId);
        } else if (list.length > 0 && !selectedTenderId) {
          setSelectedTenderId(String(list[0].id));
        }
      } catch (err) {
        console.error('Failed to load tenders:', err);
      } finally {
        setLoadingTenders(false);
      }
    }
    loadTenders();
  }, [searchParams]);

  const handleBidderDetailChange = (e) => {
    const { name, value } = e.target;
    setBidderDetails((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleDocumentTypeChange = (id, newType) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, documentType: newType } : doc))
    );
  };

  const handleFileChange = (id, file) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, file } : doc))
    );
    if (errors.documents) {
      setErrors((prev) => ({ ...prev, documents: null }));
    }
  };

  const addDocumentSlot = () => {
    setDocuments((prev) => [
      ...prev,
      { id: Date.now().toString(), documentType: 'OTHER', file: null },
    ]);
  };

  const removeDocumentSlot = (id) => {
    if (documents.length <= 1) {
      toast.warning('At least one document must be attached to the bid submission.');
      return;
    }
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const validate = () => {
    const errs = {};
    if (!selectedTenderId) errs.tenderId = 'Please select a tender for this submission';
    if (!quotedPrice || isNaN(quotedPrice) || Number(quotedPrice) <= 0) {
      errs.quotedPrice = 'Please enter a valid quoted price greater than zero';
    }
    if (!bidderDetails.name.trim()) errs.name = 'Bidder name is required';
    if (!bidderDetails.pan.trim()) {
      errs.pan = 'PAN is required';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(bidderDetails.pan.trim())) {
      errs.pan = 'Invalid PAN format (e.g. ABCDE1234F)';
    }
    if (!bidderDetails.gstin.trim()) {
      errs.gstin = 'GSTIN is required';
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(bidderDetails.gstin.trim())) {
      errs.gstin = 'Invalid 15-character GSTIN format';
    }
    if (!bidderDetails.address.trim()) errs.address = 'Registered address is required';

    // Verify all document slots have a file selected
    const missingFiles = documents.some((doc) => !doc.file);
    if (missingFiles) {
      errs.documents = 'Please select a file for each attached document requirement.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const documentTypes = documents.map((doc) => doc.documentType);
      const files = documents.map((doc) => doc.file);

      const response = await bidApi.submitBid({
        tenderId: selectedTenderId,
        quotedPrice,
        bidderDetails: {
          name: bidderDetails.name.trim(),
          pan: bidderDetails.pan.trim().toUpperCase(),
          gstin: bidderDetails.gstin.trim().toUpperCase(),
          udyamNumber: bidderDetails.udyamNumber.trim() || undefined,
          address: bidderDetails.address.trim(),
        },
        documentTypes,
        files,
      });

      toast.success(
        `Bid #${response.id} submitted successfully! Automated compliance processing has started.`,
        'Bid Submission Recorded'
      );
      navigate(`/bidder/bids/${response.id}`);
    } catch (err) {
      console.error('Bid submission error:', err);
      setSubmitError(
        err.message || 'Failed to submit bid. Please ensure all uploaded files are valid and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTender = tenders.find((t) => String(t.id) === String(selectedTenderId));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Link
          to="/bidder/dashboard"
          className="text-xs font-semibold text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Submit Tender Bid
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Provide commercial pricing, statutory entity declarations, and required compliance certificates
        </p>
      </div>

      {submitError && (
        <Alert variant="error" title="Submission Failed">
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Tender */}
        <Card>
          <CardHeader title="1. Select Target Tender" subtitle="Choose the open procurement notice you are submitting for" />
          <CardContent className="space-y-4">
            <Select
              label="Open Tenders"
              value={selectedTenderId}
              onChange={(e) => setSelectedTenderId(e.target.value)}
              error={errors.tenderId}
              required
              options={tenders.map((t) => ({
                value: String(t.id),
                label: `#${t.id} - ${t.title} (${t.organization || 'Procurement Agency'})`,
              }))}
            />

            {selectedTender && (
              <div className="p-4 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-900/40 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{selectedTender.title}</span>
                  <Badge variant="brand" size="sm">Status: {selectedTender.status || 'OPEN'}</Badge>
                </div>
                <p className="text-slate-600 dark:text-slate-400 line-clamp-2">{selectedTender.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Commercial Quoted Price */}
        <Card>
          <CardHeader title="2. Commercial Proposal" subtitle="Enter the total quoted contract price for the tender scope" />
          <CardContent>
            <Input
              label="Quoted Price (USD / Local Currency)"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="e.g. 250000.00"
              prefixIcon={DollarSign}
              value={quotedPrice}
              onChange={(e) => setQuotedPrice(e.target.value)}
              error={errors.quotedPrice}
              helperText="Quoted amount will be evaluated against tender financial guidelines and statutory requirements."
              required
            />
          </CardContent>
        </Card>

        {/* Step 3: Bidder Entity Details */}
        <Card>
          <CardHeader title="3. Bidder Identity & Statutory Declarations" subtitle="These records will be cross-checked against your uploaded certificates and registries" />
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Bidder / Legal Entity Name"
                name="name"
                placeholder="e.g. Acme Infrastructure Solutions Ltd."
                value={bidderDetails.name}
                onChange={handleBidderDetailChange}
                error={errors.name}
                required
              />

              <Input
                label="Permanent Account Number (PAN)"
                name="pan"
                placeholder="e.g. ABCDE1234F"
                value={bidderDetails.pan}
                onChange={handleBidderDetailChange}
                error={errors.pan}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="GST Identification Number (GSTIN)"
                name="gstin"
                placeholder="e.g. 22AAAAA0000A1Z5"
                value={bidderDetails.gstin}
                onChange={handleBidderDetailChange}
                error={errors.gstin}
                required
              />

              <Input
                label="Udyam / MSME Registration Number (Optional)"
                name="udyamNumber"
                placeholder="e.g. UDYAM-XX-00-0000000"
                value={bidderDetails.udyamNumber}
                onChange={handleBidderDetailChange}
                error={errors.udyamNumber}
                helperText="If applicable for MSME procurement benefits or exemptions"
              />
            </div>

            <Input
              label="Registered Business Address"
              name="address"
              placeholder="e.g. 102 Business Hub, Industrial Zone, New Delhi 110001"
              value={bidderDetails.address}
              onChange={handleBidderDetailChange}
              error={errors.address}
              required
            />
          </CardContent>
        </Card>

        {/* Step 4: Multipart Document Uploads */}
        <Card>
          <CardHeader
            title="4. Upload Compliance Documents"
            subtitle="Upload original PDF or image copies for automated OCR, entity extraction, and cross-verification"
            action={
              <Button type="button" variant="outline" size="sm" icon={Plus} onClick={addDocumentSlot}>
                Add Document
              </Button>
            }
          />
          <CardContent className="space-y-4">
            {errors.documents && (
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.documents}</p>
            )}

            <div className="space-y-3">
              {documents.map((doc, index) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>

                  <div className="w-full sm:w-60">
                    <Select
                      value={doc.documentType}
                      onChange={(e) => handleDocumentTypeChange(doc.id, e.target.value)}
                      placeholder=""
                      options={DOCUMENT_TYPES}
                    />
                  </div>

                  <div className="flex-1 w-full min-w-0">
                    <label className="flex items-center justify-between px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer hover:border-orange-500 transition-colors">
                      <div className="flex items-center gap-2 truncate">
                        <Upload className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-xs text-slate-700 dark:text-slate-300 truncate font-medium">
                          {doc.file ? doc.file.name : 'Choose PDF, DOCX, or Image file...'}
                        </span>
                      </div>
                      {doc.file && (
                        <span className="text-2xs text-slate-400 shrink-0 ml-2 font-mono">
                          {formatFileSize(doc.file.size)}
                        </span>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileChange(doc.id, e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeDocumentSlot(doc.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                    title="Remove document slot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link to="/bidder/dashboard">
            <Button variant="ghost" size="lg">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            icon={Send}
          >
            Submit Bid for Compliance Verification
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SubmitBidPage;
