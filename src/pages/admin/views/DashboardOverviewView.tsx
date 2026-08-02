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

export const DashboardOverviewView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Live Actions */}
      <DashboardHeader />

      {/* 2. Top Level KPIs (8 Metric Cards) */}
      <KpiGrid />

      {/* 3. Primary Performance & Velocity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrajectoryChart />
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
          <LiveTransactionQueue />
        </div>
        <div className="lg:col-span-1">
          <GatewayTelemetryCard />
        </div>
      </div>
    </div>
  );
};
