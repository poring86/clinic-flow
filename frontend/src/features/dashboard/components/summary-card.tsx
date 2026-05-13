"use client";

import { StatsCards } from "@/features/appointments/components";
import { useDashboardSummaryViewModel } from "@/features/dashboard/hooks";

interface SummaryCardProps {
  clinicId: string;
  from: string;
  to: string;
}

export const SummaryCard = ({ clinicId, from, to }: SummaryCardProps) => {
  const { summary, isLoading, error } = useDashboardSummaryViewModel({
    clinicId,
    from,
    to,
  });

  if (isLoading) {
    return <div className="h-20 bg-muted animate-pulse rounded" />;
  }

  if (error || !summary || !summary.totalRevenue) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded">
        Failed to load summary
      </div>
    );
  }

  return (
    <StatsCards
      totalRevenue={Number(summary.totalRevenue.total) || 0}
      totalAppointments={summary.totalAppointments.total || 0}
      totalPatients={summary.totalPatients.total || 0}
      totalDoctors={summary.totalDoctors.total || 0}
    />
  );
};
