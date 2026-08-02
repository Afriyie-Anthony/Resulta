import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DashboardOverviewView } from './views/DashboardOverviewView';
import { VoucherInventoryView } from './views/VoucherInventoryView';
import { OrdersFulfillmentView } from './views/OrdersFulfillmentView';
import { PaymentsCallbacksView } from './views/PaymentsCallbacksView';
import { AffiliatesPartnersView } from './views/AffiliatesPartnersView';
import { WithdrawalApprovalsView } from './views/WithdrawalApprovalsView';
import { ReportsAnalyticsView } from './views/ReportsAnalyticsView';
import { AuditLogsView } from './views/AuditLogsView';
import { SystemSettingsView } from './views/SystemSettingsView';
import { CustomersView } from './views/CustomersView';
import { TimetablesView } from './views/TimetablesView';
import { UsersView } from './views/UsersView';
import { SMSModuleView } from './views/SMSModuleView';
import { NotificationsView } from './views/NotificationsView';

export const AdminRouter: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<DashboardOverviewView />} />
        <Route path="inventory" element={<VoucherInventoryView />} />
        <Route path="orders" element={<OrdersFulfillmentView />} />
        <Route path="customers" element={<CustomersView />} />
        <Route path="timetables" element={<TimetablesView />} />
        <Route path="users" element={<UsersView />} />
        <Route path="affiliates" element={<AffiliatesPartnersView />} />
        <Route path="sms" element={<SMSModuleView />} />
        <Route path="reports" element={<ReportsAnalyticsView />} />
        <Route path="settings" element={<SystemSettingsView />} />
        <Route path="notifications" element={<NotificationsView />} />
        
        {/* Supporting historical/secondary administrative subviews */}
        <Route path="payments" element={<PaymentsCallbacksView />} />
        <Route path="withdrawals" element={<WithdrawalApprovalsView />} />
        <Route path="audit" element={<AuditLogsView />} />
        
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </AdminLayout>
  );
};
