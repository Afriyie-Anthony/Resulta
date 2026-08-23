import React from 'react';
import {
  DashboardHeader,
  KpiGrid,
  TrajectoryChart,
  TargetVelocityCard,
  SalesByTypeCard,
  StockStatusCard,
  OrdersByChannelCard,
  DailyOrdersCard,
  LiveTransactionQueue,
  GatewayTelemetryCard,
} from '../../../components/admin/dashboard';
import { useDashboardTelemetry } from '../../../hooks/useDashboard';

export const DashboardOverviewView: React.FC = () => {
  const { data: telemetry, isLoading, isFetching } = useDashboardTelemetry('7d');

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Live Actions */}
      <DashboardHeader />

      {/* 2. Top Level KPIs (8 Metric Cards) */}
      <KpiGrid data={telemetry?.overviewCards} isLoading={isLoading} />

      {/* 3. Primary Performance & Velocity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrajectoryChart data={telemetry?.revenueTrajectory} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1">
          <TargetVelocityCard />
        </div>
      </div>

      {/* 4. Deep-Dive Analytics Row 1: Sales Distribution & Stock Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SalesByTypeCard />
        </div>
        <div className="lg:col-span-2">
          <StockStatusCard />
        </div>
      </div>

      {/* 5. Deep-Dive Analytics Row 2: Channel Split & Daily Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersByChannelCard />
        <DailyOrdersCard />
      </div>

      {/* 6. Live Gateway Telemetry & Transaction Dispatch Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveTransactionQueue data={telemetry?.liveTransactions} isLoading={isLoading} isFetching={isFetching} />
        </div>
        <div className="lg:col-span-1">
          <GatewayTelemetryCard channelSplit={telemetry?.channelFulfillmentSplit} />
        </div>
      </div>
    </div>
  );
};
