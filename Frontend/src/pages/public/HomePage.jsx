import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  FileSearch,
  CheckCircle2,
  GitCompare,
  ExternalLink,
  Sparkles,
  History,
  ArrowRight,
  UserCheck,
  Briefcase,
  SlidersHorizontal,
  ChevronRight,
  FileCheck,
  Building2,
  Lock,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import AiDisclaimer from '../../components/common/AiDisclaimer';
import { useAuth } from '../../auth/AuthContext';

export function HomePage() {
  const { isAuthenticated, getDashboardRoute } = useAuth();

  const workflowSteps = [
    {
      num: '01',
      title: 'Register / Login',
      desc: 'Create an account as a Bidder or Tender Officer via secure Keycloak OIDC authentication.',
      icon: UserCheck,
    },
    {
      num: '02',
      title: 'Find or Create Tender',
      desc: 'Tender Officers publish procurement requirements; bidders discover matching tenders.',
      icon: Briefcase,
    },
    {
      num: '03',
      title: 'Submit / Receive Bid',
      desc: 'Bidders enter quoted commercial terms and declare their organization identifiers.',
      icon: FileCheck,
    },
    {
      num: '04',
      title: 'Upload & Process Documents',
      desc: 'Structured document intake for PAN, GST, MSME, and technical certifications.',
      icon: FileSearch,
    },
    {
      num: '05',
      title: 'Compliance Checking',
      desc: 'Automated verification that all mandatory tender requirements are satisfied.',
      icon: CheckCircle2,
    },
    {
      num: '06',
      title: 'Cross & External Verification',
      desc: 'Information matched across documents and verified against official registries.',
      icon: GitCompare,
    },
    {
      num: '07',
      title: 'AI-Assisted Analysis',
      desc: 'Gemini AI synthesizes findings, discrepancies, and risks into structured decision support.',
      icon: Sparkles,
    },
    {
      num: '08',
      title: 'Tender Officer Review',
      desc: 'The Tender Officer reviews unified evidence, document details, and findings.',
      icon: SlidersHorizontal,
    },
    {
      num: '09',
      title: 'Final Decision',
      desc: 'The authorized Tender Officer records the final binding acceptance or rejection.',
      icon: ShieldCheck,
    },
  ];

  const features = [
    {
      title: 'Document Processing',
      description: 'Automated ingestion and structured data extraction from official bid documentation, reducing manual transcription effort.',
      icon: FileSearch,
      tag: 'OCR & Parsing',
    },
    {
      title: 'Compliance Checking',
      description: 'Instantly verify whether mandatory tender requirements, affidavits, and mandatory statutory filings are satisfied.',
      icon: CheckCircle2,
      tag: 'Validation',
    },
    {
      title: 'Cross-Verification',
      description: 'Detect discrepancies by comparing bidder-declared details against information extracted across all submitted certificates.',
      icon: GitCompare,
      tag: 'Cross-Checking',
    },
    {
      title: 'External Verification',
      description: 'Connect to external and simulated government verification services for real-time PAN, GST, and Udyam MSME checks.',
      icon: ExternalLink,
      tag: 'Statutory Registry',
    },
    {
      title: 'AI-Assisted Analysis',
      description: 'Advanced LLM synthesis highlights potential anomalies, risk factors, and summary metrics to assist decision makers.',
      icon: Sparkles,
      tag: 'Decision Support',
      highlight: true,
    },
    {
      title: 'Auditability',
      description: 'Maintain immutable, timestamped audit records of submissions, system findings, officer reviews, and final award decisions.',
      icon: History,
      tag: 'Compliance Trail',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <PublicNavbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section id="home" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
          {/* Subtle geometric background accents */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
            <div className="absolute -top-24 left-1/4 w-96 h-96 bg-orange-400 rounded-full blur-3xl" />
            <div className="absolute top-12 right-1/4 w-96 h-96 bg-amber-300 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Hero text */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/80 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-xs font-semibold text-orange-800 dark:text-orange-300">
                  <ShieldCheck className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span>Next-Generation Procurement Compliance</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                  AI-Powered Bid <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400">
                    Compliance Verification
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Help streamline bid submission, document processing, compliance checking, verification, and tender review through one structured platform.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  {isAuthenticated ? (
                    <Link to={getDashboardRoute()}>
                      <Button variant="primary" size="lg" icon={ArrowRight}>
                        Go to Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/register">
                        <Button variant="primary" size="lg" icon={ArrowRight}>
                          Get Started
                        </Button>
                      </Link>
                      <a href="#features">
                        <Button variant="outline" size="lg">
                          Explore Features
                        </Button>
                      </a>
                    </>
                  )}
                </div>

                {/* Key value pills */}
                <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 dark:border-slate-800/80 max-w-lg mx-auto lg:mx-0">
                  <div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">100%</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Human-In-The-Loop</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">3-Way</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Cross Verification</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">Full</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Audit Trail</div>
                  </div>
                </div>
              </div>

              {/* Hero Graphic / Interactive Procurement Preview Card */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Decorative glowing card border */}
                  <div className="rounded-2xl bg-gradient-to-b from-orange-500/20 via-slate-200 dark:via-slate-800 to-transparent p-1 shadow-2xl">
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-5">
                      {/* Card header */}
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                            <FileCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Bid Evaluation Pipeline</h4>
                            <p className="text-2xs text-slate-500 dark:text-slate-400">Tender #2026-ENG-492</p>
                          </div>
                        </div>
                        <Badge variant="brand" size="sm" dot>Live Workflow</Badge>
                      </div>

                      {/* Mock Process Check items */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Mandatory Documents Check</span>
                          </div>
                          <span className="text-2xs font-semibold text-emerald-600 dark:text-emerald-400">All 4 Verified</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2.5">
                            <GitCompare className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">PAN & GST Cross-Match</span>
                          </div>
                          <span className="text-2xs font-semibold text-emerald-600 dark:text-emerald-400">Consistent</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2.5">
                            <ExternalLink className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Registry Active Status</span>
                          </div>
                          <span className="text-2xs font-semibold text-emerald-600 dark:text-emerald-400">Confirmed</span>
                        </div>

                        <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/50 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                              <span className="text-xs font-bold text-amber-900 dark:text-amber-200">AI Decision Support Summary</span>
                            </div>
                            <span className="text-2xs font-semibold text-amber-700 dark:text-amber-300">Low Risk</span>
                          </div>
                          <p className="text-2xs text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
                            Full statutory alignment detected. Quoted price within historical tender benchmark.
                          </p>
                        </div>
                      </div>

                      {/* Officer Decision banner */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">Decision Authority:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-orange-600" /> Tender Officer Review
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT US SECTION */}
        <section id="about" className="py-20 bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
              <Badge variant="brand" size="sm">About The Platform</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Transforming Manual Bid Compliance into a Structured Workflow
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                A dedicated platform designed to streamline the bid compliance verification process by bringing document processing, compliance checks, cross-verification, external verification, and AI-assisted analysis into one unified workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:border-orange-300 dark:hover:border-orange-800 transition-colors">
                <div className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                    01
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">The Problem with Manual Audits</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Manually checking dozens of multi-page tenders consumes days of skilled officer time, creating evaluation backlogs and project procurement delays.
                  </p>
                </div>
              </Card>

              <Card className="hover:border-orange-300 dark:hover:border-orange-800 transition-colors">
                <div className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    02
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Discrepancy & Omission Detection</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Subtle inconsistencies across declared company names, PAN records, and GST certificates are easily overlooked in high-volume manual reviews.
                  </p>
                </div>
              </Card>

              <Card className="hover:border-orange-300 dark:hover:border-orange-800 transition-colors">
                <div className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                    03
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Clear Audit Trail & Integrity</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Every file extraction, check, officer remark, and final decision is preserved in timestamped audit logs for complete institutional transparency.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
              <Badge variant="brand" size="sm">Core Capabilities</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Comprehensive Verification Pipeline
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                Purpose-built modules that handle everything from document ingestion to statutory checks and intelligent decision assistance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={`p-6 rounded-2xl border bg-white dark:bg-slate-900 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg ${
    feature.highlight
        ? 'border-orange-400/80 dark:border-orange-700 shadow-md shadow-orange-500/5 ring-1 ring-orange-500/20 hover:shadow-orange-500/10'
        : 'border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-800'
}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {feature.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {feature.description}
                    </p>

                    {feature.highlight && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <AiDisclaimer variant="inline" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* WHO CAN USE IT SECTION */}
        <section id="roles" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
              <Badge variant="brand" size="sm">User Roles</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Designed for the Entire Procurement Lifecycle
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                Tailored interfaces and strict role-based access for bidders, evaluation officers, and system administrators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Bidder Role Card */}
<div className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-7 shadow-xs transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-800">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-5">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Bidder</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Suppliers, Contractors, & Vendors</p>

                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 mb-8 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Browse and review active government tenders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>View specific mandatory document requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Submit bids with multipart document uploads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Track submission status and view bid history</span>
                  </li>
                </ul>

                <Link to="/register?role=BIDDER" className="mt-auto">
                  <Button variant="outline" size="md" className="w-full" icon={ArrowRight}>
                    Register as Bidder
                  </Button>
                </Link>
              </div>

              {/* Tender Officer Role Card (Featured) */}
                <div className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border-2 border-orange-500 dark:border-orange-500 p-7 shadow-lg relative transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-orange-600 text-white rounded-full text-2xs font-bold uppercase tracking-wider shadow-sm">
                  Core Evaluator
                </div>

                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-5 mt-1">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Tender Officer</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Procurement Authorities & Reviewers</p>

                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 mb-8 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span>Publish tenders and define document criteria</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span>Access unified bid review dashboards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span>Inspect cross-verification and registry results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span>Review AI-generated summaries and risk warnings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span>Make final authoritative award/reject decisions</span>
                  </li>
                </ul>

                <Link to="/register?role=OFFICER" className="mt-auto">
                  <Button variant="primary" size="md" className="w-full" icon={ArrowRight}>
                    Register as Tender Officer
                  </Button>
                </Link>
              </div>

              {/* Admin Role Card */}
              <div className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-7 shadow-xs transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-800">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-5">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Admin</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Governance & Platform Administrators</p>

                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 mb-8 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>Monitor total bidders, officers, tenders, and bids</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>Inspect registered users across organizations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>Review immutable institutional audit logs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>Inspect platform services and system status</span>
                  </li>
                </ul>

                <div className="mt-auto p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Admin accounts are provisioned securely by organization policy.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION (Horizontal on desktop, vertical on mobile) */}
        <section id="how-it-works" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
              <Badge variant="brand" size="sm">Verification Lifecycle</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                How It Works
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                A seamless 9-step structured pipeline designed to eliminate manual bottlenecks while keeping humans in charge of all final outcomes.
              </p>
            </div>

            {/* Workflow Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflowSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="relative flex flex-col p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-orange-300 dark:hover:border-orange-800 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xl font-extrabold text-slate-300 dark:text-slate-700 font-mono">
                        {step.num}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* AI Disclaimer Callout */}
            <div className="mt-12 max-w-3xl mx-auto">
              <AiDisclaimer />
            </div>
          </div>
        </section>

        {/* WHY USE THE PLATFORM SECTION */}
        <section className="py-20 bg-white dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
              <Badge variant="brand" size="sm">Value & Benefits</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Why Organizations Choose BidCompliance
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">Structured Bid Review</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Eliminates unstructured email threads and fragmented folders with a unified intake repository.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">Reduced Manual Effort</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Automated OCR and field parsing instantly match requirements against submitted records.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">Consistent Compliance</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Applies objective, standardized verification rules across every bid without human fatigue.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">Auditable Decisions</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Maintains an indelible audit log of remarks and evaluations for public accountability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PUBLIC CALL TO ACTION */}
        <section className="py-20 bg-gradient-to-b from-slate-50 to-orange-50/60 dark:from-slate-950 dark:to-orange-950/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Ready to get started?
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Participate in a structured and transparent bid compliance workflow today. Register as a Bidder or Tender Officer to begin.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to="/register">
                <Button variant="primary" size="lg" icon={ArrowRight}>
                  Register Now
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Login to Portal
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
