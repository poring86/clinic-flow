"use client";

import { useCallback, useState } from "react";
import { useDashboardControllerGetTopSpecialties } from "@/api/generated/dashboard/dashboard";

export interface TopSpecialty {
  specialty: string;
  appointmentCount: number;
}

interface UseDashboardTopSpecialtiesViewModelProps {
  clinicId: string;
  from: string;
  to: string;
  onError?: (error: Error) => void;
}

export const useDashboardTopSpecialtiesViewModel = ({
  clinicId,
  from,
  to,
  onError,
}: UseDashboardTopSpecialtiesViewModelProps) => {
  const [retryCount, setRetryCount] = useState(0);

  const { data, isLoading, error, refetch } =
    useDashboardControllerGetTopSpecialties(
      { clinicId, from, to },
      {
        query: {
          retry: 1,
          retryDelay: 1000,
          staleTime: 1000 * 60 * 5,
          gcTime: 1000 * 60 * 10,
        },
      },
    );

  const handleRetry = useCallback(async () => {
    setRetryCount((prev) => prev + 1);
    await refetch();
  }, [refetch]);

  const specialties: TopSpecialty[] =
    data?.data && Array.isArray(data.data) ? (data.data as TopSpecialty[]) : [];

  if (error && onError) {
    onError(error instanceof Error ? error : new Error(String(error)));
  }

  return {
    specialties,
    isLoading,
    error: error as Error | null,
    retry: handleRetry,
    retryCount,
  };
};
