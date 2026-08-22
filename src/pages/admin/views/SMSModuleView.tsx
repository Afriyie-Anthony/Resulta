import React, { useState } from 'react';
import { useToast } from '../../../components/ui/Toast';
import { useDebounce } from '../../../hooks/useDebounce';
import {
  useSmsLogs,
  useSendSingleSms,
  useBroadcastBulkSms,
} from '../../../hooks/useSms';
import {
  SmsHeader,
  SmsKpiGrid,
  SmsComposer,
  SmsHistoryTable,
  type SendSingleSmsRequest,
  type SendBulkSmsRequest,
} from '../../../components/admin/sms';

export const SMSModuleView: React.FC = () => {
  const { addToast } = useToast();

  // History Table Query Filters State
  const [historySearch, setHistorySearch] = useState('');
  const [historyTypeFilter, setHistoryTypeFilter] = useState('');
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const debouncedSearch = useDebounce(historySearch, 350);

  // Queries
  const { data: logsResponse, isLoading: isLogsLoading } = useSmsLogs({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch.trim() || undefined,
    type: historyTypeFilter || undefined,
    category: historyCategoryFilter || undefined,
  });

  // Mutations
  const sendSingleMutation = useSendSingleSms();
  const broadcastBulkMutation = useBroadcastBulkSms();

  const logs = logsResponse?.data || [];
  const pagination = logsResponse?.pagination || {
    total: 0,
    page: currentPage,
    limit: itemsPerPage,
    totalPages: 1,
  };

  const isSending = sendSingleMutation.isPending || broadcastBulkMutation.isPending;

  // Single Dispatch Handler
  const handleSendSingle = async (payload: SendSingleSmsRequest) => {
    try {
      await sendSingleMutation.mutateAsync(payload);
      addToast({
        title: 'SMS Transmission Dispatched',
        message: `Direct SMS successfully sent to ${payload.recipientPhone}.`,
        type: 'success',
        duration: 4000,
      });
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || 'Failed to dispatch single SMS message. Please check the recipient number.';
      addToast({
        title: 'Dispatch Failed',
        message: errorMsg,
        type: 'error',
        duration: 5000,
      });
    }
  };

  // Bulk Broadcast Handler
  const handleBroadcastBulk = async (payload: SendBulkSmsRequest) => {
    try {
      const res = await broadcastBulkMutation.mutateAsync(payload);
      addToast({
        title: 'Bulk Broadcast Dispatched',
        message: `Bulk campaign successfully dispatched to ${res.stats?.totalTargeted?.toLocaleString() || res.smsLog?.recipientCount?.toLocaleString() || 'all targeted'} contacts!`,
        type: 'success',
        duration: 4000,
      });
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || 'Failed to broadcast bulk SMS campaign. Please try again.';
      addToast({
        title: 'Broadcast Failed',
        message: errorMsg,
        type: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <SmsHeader />

      {/* 2. Top Telemetry KPI Grid */}
      <SmsKpiGrid totalDispatchedLogs={pagination.total} />

      {/* 3. Main Campaign Composer & Live Audience Reach Calculator */}
      <SmsComposer
        onSendSingle={handleSendSingle}
        onBroadcastBulk={handleBroadcastBulk}
        isSending={isSending}
      />

      {/* 4. SMS Transmission & Blast History Table */}
      <SmsHistoryTable
        logs={logs}
        isLoading={isLogsLoading}
        pagination={pagination}
        search={historySearch}
        onSearchChange={(val) => {
          setHistorySearch(val);
          setCurrentPage(1);
        }}
        typeFilter={historyTypeFilter}
        onTypeFilterChange={(val) => {
          setHistoryTypeFilter(val);
          setCurrentPage(1);
        }}
        categoryFilter={historyCategoryFilter}
        onCategoryFilterChange={(val) => {
          setHistoryCategoryFilter(val);
          setCurrentPage(1);
        }}
        onPageChange={setCurrentPage}
        onLimitChange={(newLimit) => {
          setItemsPerPage(newLimit);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};
