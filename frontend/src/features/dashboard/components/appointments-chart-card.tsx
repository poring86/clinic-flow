"use client";

import { useDashboardDailyAppointmentsViewModel } from "@/features/dashboard/hooks";

import { AppointmentsChart } from ".";

interface AppointmentsChartCardProps {
  clinicId: string;
  from: string;
  to: string;
}

export const AppointmentsChartCard = ({
  clinicId,
  from,
  to,
}: AppointmentsChartCardProps) => {
  const { chartData, isLoading, error } =
    useDashboardDailyAppointmentsViewModel({
      clinicId,
      from,
      to,
    });

  if (isLoading) {
    return <div className="h-80 bg-muted animate-pulse rounded" />;
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded">
        Failed to load chart data
      </div>
    );
  }

  return <AppointmentsChart dailyAppointmentsData={chartData} />;
};
