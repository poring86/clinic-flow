"use client";

import { type Dispatch, useCallback, useState } from "react";

import { useDashboardControllerGetDailyAppointmentsData } from "@/api/generated/dashboard/dashboard";

export interface DailyAppointmentData {
  date: string;
  appointments: number;
  revenue: number;
}

interface UseDashboardDailyAppointmentsViewModelProps {
  clinicId: string;
  from: string;
  to: string;
  onError?: Dispatch<Error>;
}

export const useDashboardDailyAppointmentsViewModel = ({
  clinicId,
  from,
  to,
  onError,
}: UseDashboardDailyAppointmentsViewModelProps) => {
  const [retryCount, setRetryCount] = useState(0);

  const { data, isLoading, error, refetch } =
    useDashboardControllerGetDailyAppointmentsData(
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

  const chartData: DailyAppointmentData[] =
    data?.data && Array.isArray(data.data)
      ? (data.data as DailyAppointmentData[])
      : [];

  if (error && onError) {
    onError(error instanceof Error ? error : new Error(String(error)));
  }

  return {
    chartData,
    isLoading,
    error: error as Error | null,
    retry: handleRetry,
    retryCount,
  };
};
