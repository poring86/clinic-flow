import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import type { PatientDto as Patient } from "@/api/schemas";
import { getApiBaseUrl } from "@/lib/api-base-url";

import { patientsQueryKeys } from "../query-keys";

interface PaginatedPatientResponse {
  data: Patient[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface UsePatientsViewModelParams {
  clinicId: string;
}

export const usePatientsViewModel = ({ clinicId }: UsePatientsViewModelParams) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: paginatedData, isLoading } = useQuery({
    queryKey: patientsQueryKeys.listByClinic(clinicId, page, pageSize),
    enabled: !!clinicId,
    queryFn: async () => {
      const res = await fetch(
        `${getApiBaseUrl()}/patient?clinicId=${encodeURIComponent(clinicId)}&page=${page}&pageSize=${pageSize}`,
        { method: "GET" },
      );
      if (!res.ok) throw new Error("Failed to fetch patients");
      return (await res.json()) as PaginatedPatientResponse;
    },
  });

  return {
    patients: paginatedData?.data ?? [],
    total: paginatedData?.total ?? 0,
    totalPages: paginatedData?.totalPages ?? 0,
    page,
    pageSize,
    isLoading,
    onPageChange: setPage,
    onPageSizeChange: (size: number) => {
      setPageSize(size);
      setPage(1);
    },
  };
};
