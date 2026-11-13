import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './auth/ProtectedRoute';
import RoleRoute from './auth/RoleRoute';
import Layout from './components/layout/Layout';
import { ROLES } from './utils/constants';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Common Authenticated Pages
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ForbiddenPage from './pages/ForbiddenPage';

// Bidder Pages
import BidderDashboard from './pages/bidder/BidderDashboard';
import BidderTendersPage from './pages/bidder/BidderTendersPage';
import BidderTenderDetailPage from './pages/bidder/BidderTenderDetailPage';
import SubmitBidPage from './pages/bidder/SubmitBidPage';
import BidderBidsPage from './pages/bidder/BidderBidsPage';
import BidderBidDetailPage from './pages/bidder/BidderBidDetailPage';

// Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import OfficerTendersPage from './pages/officer/OfficerTendersPage';
import CreateTenderPage from './pages/officer/CreateTenderPage';
import OfficerTenderDetailPage from './pages/officer/OfficerTenderDetailPage';
import OfficerBidsPage from './pages/officer/OfficerBidsPage';
import UnifiedBidReviewPage from './pages/officer/UnifiedBidReviewPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forbidden" element={<ForbiddenPage />} />

              {/* Protected Authenticated Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                {/* Profile Route */}
                <Route path="/profile" element={<ProfilePage />} />

                {/* Bidder Role Routes */}
                <Route
                  path="/bidder/dashboard"
                  element={
                    <RoleRoute allowedRoles={[ROLES.BIDDER]}>
                      <BidderDashboard />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/bidder/tenders"
                  element={
                    <RoleRoute allowedRoles={[ROLES.BIDDER]}>
                      <BidderTendersPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/bidder/tenders/:id"
                  element={
                    <RoleRoute allowedRoles={[ROLES.BIDDER]}>
                      <BidderTenderDetailPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/bidder/submit-bid"
                  element={
                    <RoleRoute allowedRoles={[ROLES.BIDDER]}>
                      <SubmitBidPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/bidder/bids"
                  element={
                    <RoleRoute allowedRoles={[ROLES.BIDDER]}>
                      <BidderBidsPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/bidder/bids/:id"
                  element={
                    <RoleRoute allowedRoles={[ROLES.BIDDER]}>
                      <BidderBidDetailPage />
                    </RoleRoute>
                  }
                />

                {/* Tender Officer Role Routes */}
                <Route
                  path="/officer/dashboard"
                  element={
                    <RoleRoute allowedRoles={[ROLES.OFFICER]}>
                      <OfficerDashboard />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/officer/tenders"
                  element={
                    <RoleRoute allowedRoles={[ROLES.OFFICER]}>
                      <OfficerTendersPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/officer/tenders/create"
                  element={
                    <RoleRoute allowedRoles={[ROLES.OFFICER]}>
                      <CreateTenderPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/officer/tenders/:id"
                  element={
                    <RoleRoute allowedRoles={[ROLES.OFFICER]}>
                      <OfficerTenderDetailPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/officer/bids"
                  element={
                    <RoleRoute allowedRoles={[ROLES.OFFICER]}>
                      <OfficerBidsPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/officer/bids/:id/review"
                  element={
                    <RoleRoute allowedRoles={[ROLES.OFFICER]}>
                      <UnifiedBidReviewPage />
                    </RoleRoute>
                  }
                />

                {/* Admin Role Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                      <AdminDashboard />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                      <AdminUsersPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/admin/audit-logs"
                  element={
                    <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                      <AdminAuditLogsPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                      <AdminSettingsPage />
                    </RoleRoute>
                  }
                />
              </Route>

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
