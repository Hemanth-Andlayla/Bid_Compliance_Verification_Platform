export const ROLES = {
  BIDDER: 'BIDDER',
  OFFICER: 'OFFICER',
  ADMIN: 'ADMIN',
};

export const ROLE_LABELS = {
  BIDDER: 'Bidder',
  OFFICER: 'Tender Officer',
  ADMIN: 'Admin',
};

export const ROLE_HOME_ROUTES = {
  BIDDER: '/bidder/dashboard',
  OFFICER: '/officer/dashboard',
  ADMIN: '/admin/dashboard',
};

export const BID_STATUS = {
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
};

export const TENDER_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  UNDER_EVALUATION: 'UNDER_EVALUATION',
  AWARDED: 'AWARDED',
};

export const DOCUMENT_TYPES = [
  { value: 'PAN', label: 'Permanent Account Number (PAN) Card' },
  { value: 'GST', label: 'GST Registration Certificate' },
  { value: 'UDYAM', label: 'Udyam / MSME Registration Certificate' },
  { value: 'FINANCIAL_STATEMENT', label: 'Audited Financial Statement / Balance Sheet' },
  { value: 'TECHNICAL_PROPOSAL', label: 'Technical Proposal / Specification' },
  { value: 'EXPERIENCE_CERTIFICATE', label: 'Past Experience / Completion Certificate' },
  { value: 'NON_BLACKLISTING', label: 'Non-Blacklisting Declaration / Affidavit' },
  { value: 'OTHER', label: 'Other Supporting Document' },
];
