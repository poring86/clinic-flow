"use client";

import { useCallback, useState } from "react";
import { useDashboardControllerGetSummary } from "@/api/generated/dashboard/dashboard";

export interface SummaryData {
  totalRevenue: { total: number };
  totalAppointments: { total: number };
  totalPatients: { total: number };
  totalDoctors: { total: number };
}

const DEFAULT_SUMMARY: SummaryData = {
  totalRevenue: { total: 0 },
  totalAppointments: { total: 0 },
  totalPatients: { total: 0 },
  totalDoctors: { total: 0 },
};

interface UseDashboardSummaryViewModelProps {
  clinicId: string;
  from: string;
  to: string;
  onError?: (error: Error) => void;
}

export const useDashboardSummaryViewModel = ({
  clinicId,
  from,
  to,
  onError,
}: UseDashboardSummaryViewModelProps) => {
  const [retryCount, setRetryCount] = useState(0);

  const { data, isLoading, error, refetch } =
    useDashboardControllerGetSummary(
      { clinicId, from, to },
      {
        query: {
          retry: 1,
          retryDelay: 1000,
          staleTime: 1000 * 60 * 5, // 5 minutes
          gcTime: 1000 * 60 * 10, // 10 minutes (was cacheTime in older versions)
        },
      },
    );

  const handleRetry = useCallback(async () => {
    setRetryCount((prev) => prev + 1);
    await refetch();
  }, [refetch]);

  const summary: SummaryData =
    data?.data && typeof data.data === "object"
      ? (data.data as SummaryData)
      : DEFAULT_SUMMARY;

  if (error && onError) {
    onError(error instanceof Error ? error : new Error(String(error)));
  }

  return {
    summary,
    isLoading,
    error: error as Error | null,
    retry: handleRetry,
    retryCount,
  };
};
