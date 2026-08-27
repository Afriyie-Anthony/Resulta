import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastProvider } from './components/ui/Toast';
import ProtectedRoute from './components/website/layout/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/website/Home';
import PurchasePage from './pages/website/purchase/PurchasePage';
import PurchaseVerifyPage from './pages/website/purchase/PurchaseVerifyPage';
import VouchersPricingPage from './pages/website/VouchersPricingPage';
import RetrieveVoucherPage from './pages/website/my-vouchers/RetrieveVoucherPage';
import FAQPage from './pages/website/help/FAQPage';
import ContactSupportPage from './pages/website/help/ContactSupportPage';
import TermsPage from './pages/website/legal/TermsPage';
import PrivacyPage from './pages/website/legal/PrivacyPage';
import RefundPolicyPage from './pages/website/legal/RefundPolicyPage';
import NotFound from './pages/website/NotFound';
import TimetablesPage from './pages/website/TimetablesPage';
import AffiliateDashboard from './pages/website/affiliate/AffiliateDashboard';
import AffiliatePage from './pages/website/affiliate/AffiliatePage';
import AffiliateProtectedRoute from './components/website/layout/AffiliateProtectedRoute';
import AdminLogin from './pages/auth/AdminLogin';
import AffiliateLogin from './pages/auth/AffiliateLogin';
import AffiliateRegister from './pages/auth/AffiliateRegister';
import { AdminRouter } from './pages/admin/AdminRouter';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Separate Admin and Affiliate auth components */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/affiliate/login" element={<AffiliateLogin />} />
      <Route path="/affiliate/apply" element={<AffiliateRegister />} />
      <Route path="/login" element={<AffiliateLogin />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminRouter />
          </ProtectedRoute>
        }
      />
      <Route path="/pricing" element={<VouchersPricingPage />} />
      <Route path="/purchase" element={<PurchasePage />} />
      <Route path="/purchase/verify" element={<PurchaseVerifyPage />} />
      <Route path="/retrieve-voucher" element={<RetrieveVoucherPage />} />
      <Route path="/help/faq" element={<FAQPage />} />
      <Route path="/help/contact" element={<ContactSupportPage />} />
      <Route path="/legal/terms" element={<TermsPage />} />
      <Route path="/legal/privacy" element={<PrivacyPage />} />
      <Route path="/legal/refund" element={<RefundPolicyPage />} />
      <Route path="/timetables" element={<TimetablesPage />} />
      <Route path="/affiliate" element={<AffiliatePage />} />
      <Route
        path="/affiliate/dashboard"
        element={
          <AffiliateProtectedRoute>
            <AffiliateDashboard />
          </AffiliateProtectedRoute>
        }
      />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
