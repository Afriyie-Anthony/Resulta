import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DashboardOverviewView } from './views/DashboardOverviewView';
import { VoucherInventoryView } from './views/VoucherInventoryView';
import { OrdersFulfillmentView } from './views/OrdersFulfillmentView';
import { AffiliatesPartnersView } from './views/AffiliatesPartnersView';
import { EditAffiliateView } from './views/EditAffiliateView';
import { AffiliatesAnalyticsView } from './views/AffiliatesAnalyticsView';
import { WithdrawalsView } from './views/WithdrawalsView';
import { ReportsAnalyticsView } from './views/ReportsAnalyticsView';
import { AuditLogsView } from './views/AuditLogsView';
import { SystemSettingsView } from './views/SystemSettingsView';
import { CustomersView } from './views/CustomersView';
import { TimetablesView } from './views/TimetablesView';
import { UsersView } from './views/UsersView';
import { SMSModuleView } from './views/SMSModuleView';
import { NotificationsView } from './views/NotificationsView';
import { ContactsView } from './views/ContactsView';
import SuperAdminRoute from '../../components/website/layout/SuperAdminRoute';

export const AdminRouter: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/overview" replace />} />
        <Route path="overview" element={<DashboardOverviewView />} />
        {/* SUPER_ADMIN only routes */}
        <Route path="inventory" element={<SuperAdminRoute><VoucherInventoryView /></SuperAdminRoute>} />
        <Route path="users" element={<SuperAdminRoute><UsersView /></SuperAdminRoute>} />
        <Route path="sms" element={<SuperAdminRoute><SMSModuleView /></SuperAdminRoute>} />
        {/* Shared access routes */}
        <Route path="orders" element={<OrdersFulfillmentView />} />
        <Route path="customers" element={<CustomersView />} />
        <Route path="timetables" element={<TimetablesView />} />
        <Route path="contacts" element={<ContactsView />} />
        <Route path="affiliates" element={<AffiliatesPartnersView />} />
        <Route path="affiliates/:id/edit" element={<EditAffiliateView />} />
        <Route path="affiliates/analytics" element={<AffiliatesAnalyticsView />} />
        <Route path="reports" element={<ReportsAnalyticsView />} />
        <Route path="settings" element={<SystemSettingsView />} />
        <Route path="notifications" element={<NotificationsView />} />
        <Route path="audit" element={<AuditLogsView />} />
        {/* SUPER_ADMIN only: Financial */}
        <Route path="withdrawals" element={<SuperAdminRoute><WithdrawalsView /></SuperAdminRoute>} />
        
        <Route path="*" element={<Navigate to="/admin/overview" replace />} />
      </Routes>
    </AdminLayout>
  );
};
