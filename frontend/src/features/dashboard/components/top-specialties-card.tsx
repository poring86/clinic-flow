"use client";

import { useDashboardTopSpecialtiesViewModel } from "@/features/dashboard/hooks";
import { TopSpecialties } from ".";

interface TopSpecialtiesCardProps {
  clinicId: string;
  from: string;
  to: string;
}

export const TopSpecialtiesCard = ({
  clinicId,
  from,
  to,
}: TopSpecialtiesCardProps) => {
  const { specialties, isLoading, error } =
    useDashboardTopSpecialtiesViewModel({
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
        Failed to load top specialties
      </div>
    );
  }

  return <TopSpecialties topSpecialties={specialties} />;
};
