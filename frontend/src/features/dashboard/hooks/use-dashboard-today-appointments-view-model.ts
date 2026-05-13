"use client";

import { type Dispatch, useCallback, useState } from "react";

import { useDashboardControllerGetTodayAppointments } from "@/api/generated/dashboard/dashboard";

export interface TodayAppointment {
  id: string;
  date?: string;
  scheduledAt?: string;
  patientName?: string;
  doctorName?: string;
  specialty?: string;
  patient?: {
    name?: string;
  };
  doctor?: {
    name?: string;
    specialty?: string;
  };
}

interface UseDashboardTodayAppointmentsViewModelProps {
  clinicId: string;
  from: string;
  to: string;
  onError?: Dispatch<Error>;
}

export const useDashboardTodayAppointmentsViewModel = ({
  clinicId,
  onError,
}: UseDashboardTodayAppointmentsViewModelProps) => {
  const [retryCount, setRetryCount] = useState(0);

  const { data, isLoading, error, refetch } =
    useDashboardControllerGetTodayAppointments(
      { clinicId },
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

  const appointments: TodayAppointment[] =
    data?.data && Array.isArray(data.data)
      ? (data.data as TodayAppointment[])
      : [];

  if (error && onError) {
    onError(error instanceof Error ? error : new Error(String(error)));
  }

  return {
    appointments,
    isLoading,
    error: error as Error | null,
    retry: handleRetry,
    retryCount,
  };
};
