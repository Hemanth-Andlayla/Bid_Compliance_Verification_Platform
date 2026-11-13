import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, Trash2, ArrowLeft, Plus, CheckCircle2, Calendar, FileText, Building2 } from 'lucide-react';
import { tenderApi } from '../../api/tenderApi';
import { useToast } from '../../context/ToastContext';
import Card, { CardHeader, CardContent, CardFooter } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Alert from '../../components/common/Alert';
import { DOCUMENT_TYPES } from '../../utils/constants';

export function CreateTenderPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  // Structured requirements list
  const [requirements, setRequirements] = useState([
    {
      id: '1',
      requirementType: 'PAN',
      description: 'Valid Permanent Account Number card matching registered company name',
      mandatory: true,
    },
    {
      id: '2',
      requirementType: 'GST',
      description: 'Active GSTIN certificate in state of operations',
      mandatory: true,
    },
  ]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const addRequirement = () => {
    setRequirements((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        requirementType: 'OTHER',
        description: '',
        mandatory: false,
      },
    ]);
  };

  const removeRequirement = (id) => {
    if (requirements.length <= 1) {
      toast.warning('Tender should specify at least one requirement.');
      return;
    }
    setRequirements((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRequirement = (id, field, value) => {
    setRequirements((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Tender title is required';
    if (!description.trim()) errs.description = 'Tender description is required';
    if (!deadline) {
      errs.deadline = 'Submission deadline is required';
    } else {
      const selectedDate = new Date(deadline);
      if (selectedDate <= new Date()) {
        errs.deadline = 'Submission deadline must be set to a future date and time';
      }
    }

    const invalidReq = requirements.some(
      (r) => !r.requirementType.trim() || !r.description.trim()
    );
    if (invalidReq) {
      errs.requirements = 'All requirements must have a type and description.';
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
      // Backend expects submissionDeadline as ISO 8601 Instant string
      const isoDeadline = new Date(deadline).toISOString();

      const payload = {
        title: title.trim(),
        description: description.trim(),
        submissionDeadline: isoDeadline,
        requirements: requirements.map((r) => ({
          requirementType: r.requirementType.trim(),
          description: r.description.trim(),
          mandatory: Boolean(r.mandatory),
        })),
      };

      const response = await tenderApi.createTender(payload);

      toast.success(
        `Tender "${response.title}" (#${response.id}) created successfully!`,
        'Tender Published'
      );
      navigate(`/officer/tenders/${response.id}`);
    } catch (err) {
      console.error('Failed to create tender:', err);
      setSubmitError(
        err.message || 'Failed to publish tender. Please verify all inputs and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Link
          to="/officer/dashboard"
          className="text-xs font-semibold text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Officer Workspace
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create New Tender Notice
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Publish procurement specifications and mandate automated compliance requirements
        </p>
      </div>

      {submitError && (
        <Alert variant="error" title="Creation Error">
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Tender Information */}
        <Card>
          <CardHeader title="1. Procurement Specifications" subtitle="General title, scope, and submission timeline" />
          <CardContent className="space-y-4">
            <Input
              label="Tender Title"
              placeholder="e.g. Supply and Commissioning of Grid Infrastructure"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tender Scope & Description <span className="text-orange-500">*</span>
              </label>
              <textarea
                rows={4}
                className="w-full rounded-lg text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                placeholder="Detailed scope of supply, project milestones, quality benchmarks, and general terms..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.description}</p>
              )}
            </div>

            <Input
              label="Submission Deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              error={errors.deadline}
              helperText="Submissions received after this deadline will be automatically rejected."
              required
            />
          </CardContent>
        </Card>

        {/* Requirements Configuration */}
        <Card>
          <CardHeader
            title="2. Document Compliance Criteria"
            subtitle="Specify the mandatory and optional statutory documents bidders must upload"
            action={
              <Button type="button" variant="outline" size="sm" icon={Plus} onClick={addRequirement}>
                Add Requirement
              </Button>
            }
          />
          <CardContent className="space-y-4">
            {errors.requirements && (
              <p className="text-xs font-semibold text-rose-600">{errors.requirements}</p>
            )}

            <div className="space-y-3">
              {requirements.map((req, idx) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>

                  <div className="w-full sm:w-56">
                    <Select
                      value={req.requirementType}
                      onChange={(e) => updateRequirement(req.id, 'requirementType', e.target.value)}
                      placeholder=""
                      options={DOCUMENT_TYPES}
                    />
                  </div>

                  <div className="flex-1 w-full min-w-0">
                    <Input
                      placeholder="Requirement description / verification standard..."
                      value={req.description}
                      onChange={(e) => updateRequirement(req.id, 'description', e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300 select-none">
                      <input
                        type="checkbox"
                        checked={req.mandatory}
                        onChange={(e) => updateRequirement(req.id, 'mandatory', e.target.checked)}
                        className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                      />
                      <span>Mandatory</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => removeRequirement(req.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Remove requirement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link to="/officer/dashboard">
            <Button variant="ghost" size="lg">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            icon={PlusCircle}
          >
            Publish Tender
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateTenderPage;
