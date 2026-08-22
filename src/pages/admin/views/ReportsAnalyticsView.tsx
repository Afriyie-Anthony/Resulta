import React, { useState } from 'react';
import { useToast } from '../../../components/ui/Toast';
import {
  useCommercialAnalytics,
  useExportReportsCsv,
  useExportReportsPdf,
} from '../../../hooks/useReports';
import {
  ReportsHeader,
  ReportsPeriodFilter,
  ReportsKpiGrid,
  RevenueTrendVisualizer,
  ChannelSplitCard,
  ExamMarketShareCard,
  TelemetryMicroGrid,
  AffiliateAttributionTable,
  type ReportPeriod,
} from '../../../components/admin/reports';

export const ReportsAnalyticsView: React.FC = () => {
  const { addToast } = useToast();
  const [period, setPeriod] = useState<ReportPeriod>('WEEKLY');

  // Queries
  const { data: analyticsData, isLoading } = useCommercialAnalytics({ period });

  // Mutations
  const exportCsvMutation = useExportReportsCsv();
  const exportPdfMutation = useExportReportsPdf();

  // Export Handlers
  const handleExportCsv = async () => {
    try {
      await exportCsvMutation.mutateAsync({ period });
      addToast({
        title: 'CSV Report Downloaded',
        message: `${period} commercial analytics report successfully compiled and downloaded.`,
        type: 'success',
        duration: 4000,
      });
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || 'Failed to export CSV report. Please try again.';
      addToast({
        title: 'Export Failed',
        message: errorMsg,
        type: 'error',
        duration: 5000,
      });
    }
  };

  const handleExportPdf = async () => {
    try {
      const summary = await exportPdfMutation.mutateAsync({ period });
      addToast({
        title: 'PDF Summary Generated',
        message: `${summary.title || 'Commercial report'} for ${summary.period || period} prepared for download.`,
        type: 'success',
        duration: 4000,
      });
      // Trigger native browser print if needed
      window.print();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || 'Failed to generate PDF summary report.';
      addToast({
        title: 'Export Failed',
        message: errorMsg,
        type: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Export Actions */}
      <ReportsHeader
        onExportCsv={handleExportCsv}
        onExportPdf={handleExportPdf}
        isExportingCsv={exportCsvMutation.isPending}
        isExportingPdf={exportPdfMutation.isPending}
      />

      {/* 2. Reporting Window Filter */}
      <ReportsPeriodFilter period={period} onPeriodChange={setPeriod} />

      {/* 3. Top Level KPIs */}
      <ReportsKpiGrid summary={analyticsData?.summary} isLoading={isLoading} />

      {/* 4. Primary Trajectory & Channel Distribution Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Chart 1: Revenue Trend (2 cols width) */}
        <div className="lg:col-span-2">
          <RevenueTrendVisualizer
            trendData={analyticsData?.trendVisualizer?.timeSeries || []}
            peakRevenueDay={analyticsData?.trendVisualizer?.peakRevenueDay}
            period={period}
            totalOrders={analyticsData?.summary?.totalFulfilledOrders || 0}
            isLoading={isLoading}
          />
        </div>

        {/* Visual Chart 2: Channel Split & Product Attribution (1 col width) */}
        <div className="space-y-6">
          <ChannelSplitCard
            channelSplit={analyticsData?.channelSplit}
            isLoading={isLoading}
          />
          <ExamMarketShareCard
            marketShare={analyticsData?.examMarketShare}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* 5. Secondary Operational Telemetry Grid (4 Micro-Visualizers) */}
      <TelemetryMicroGrid />

      {/* 6. Top Affiliate Partner Sales Attribution Table */}
      <AffiliateAttributionTable />
    </div>
  );
};
