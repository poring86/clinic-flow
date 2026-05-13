"use client";

import { type Dispatch, useCallback, useState } from "react";

import { useDashboardControllerGetTopDoctors } from "@/api/generated/dashboard/dashboard";

export interface TopDoctor {
  doctorId: string;
  name: string;
  specialty: string;
  appointmentCount: number;
}

interface UseDashboardTopDoctorsViewModelProps {
  clinicId: string;
  from: string;
  to: string;
  onError?: Dispatch<Error>;
}

export const useDashboardTopDoctorsViewModel = ({
  clinicId,
  from,
  to,
  onError,
}: UseDashboardTopDoctorsViewModelProps) => {
  const [retryCount, setRetryCount] = useState(0);

  const { data, isLoading, error, refetch } =
    useDashboardControllerGetTopDoctors(
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

  const doctors: TopDoctor[] =
    data?.data && Array.isArray(data.data) ? (data.data as TopDoctor[]) : [];

  if (error && onError) {
    onError(error instanceof Error ? error : new Error(String(error)));
  }

  return {
    doctors,
    isLoading,
    error: error as Error | null,
    retry: handleRetry,
    retryCount,
  };
};
