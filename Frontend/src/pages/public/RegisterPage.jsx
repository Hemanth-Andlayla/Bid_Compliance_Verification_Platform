import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, UserCheck, Building2, User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Alert from '../../components/common/Alert';
import { useToast } from '../../context/ToastContext';
import { userApi } from '../../api/userApi';
import { ROLES } from '../../utils/constants';

export function RegisterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const initialRole = searchParams.get('role') === 'OFFICER' ? ROLES.OFFICER : ROLES.BIDDER;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: initialRole,
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.organization.trim()) errs.organization = 'Organization name is required';
    if (!formData.role) errs.role = 'Role selection is required';
    if (formData.role !== ROLES.BIDDER && formData.role !== ROLES.OFFICER) {
      errs.role = 'Only Bidder and Tender Officer roles can be registered publicly';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 8 || formData.password.length > 64) {
      errs.password = 'Password must be between 8 and 64 characters';
    }
    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirmation password is required';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (apiError) setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      await userApi.register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        organization: formData.organization.trim(),
        role: formData.role,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      toast.success(
        'Account registered successfully! Please log in with your credentials.',
        'Registration Complete'
      );
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err);
      setApiError(err.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-xl w-full">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Create Platform Account
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Register as a Bidder or Tender Officer to access compliance services
              </p>
            </div>

            {apiError && (
              <Alert variant="error" title="Registration Failed">
                {apiError}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role selection tab buttons */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Registering As <span className="text-orange-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, role: ROLES.BIDDER }))}
                    className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      formData.role === ROLES.BIDDER
                        ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 ring-2 ring-orange-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-orange-600" />
                    <span>Bidder (Supplier)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, role: ROLES.OFFICER }))}
                    className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      formData.role === ROLES.OFFICER
                        ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 ring-2 ring-orange-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-orange-600" />
                    <span>Tender Officer</span>
                  </button>
                </div>
                {errors.role && <p className="mt-1 text-xs text-rose-600">{errors.role}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="e.g. Jane Doe"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  prefixIcon={User}
                  required
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="jane@organization.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  prefixIcon={Mail}
                  required
                />
              </div>

              <Input
                label="Organization Name"
                name="organization"
                placeholder="e.g. Acme Infra Corp / Municipal Procurement Board"
                value={formData.organization}
                onChange={handleChange}
                error={errors.organization}
                prefixIcon={Building2}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Min 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  prefixIcon={Lock}
                  required
                />

                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  prefixIcon={Lock}
                  required
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isSubmitting}
                  icon={ArrowRight}
                >
                  Create Account
                </Button>
              </div>
            </form>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-orange-600 dark:text-orange-400 hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default RegisterPage;
