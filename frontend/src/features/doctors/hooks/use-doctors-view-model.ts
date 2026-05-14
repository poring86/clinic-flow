import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import type { DoctorDto as Doctor } from "@/api/schemas";
import { getApiBaseUrl } from "@/lib/api-base-url";

import { doctorsQueryKeys } from "../query-keys";

interface PaginatedDoctorResponse {
  data: Doctor[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface UseDoctorsViewModelParams {
  clinicId: string;
}

export const useDoctorsViewModel = ({ clinicId }: UseDoctorsViewModelParams) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const baseUrl = getApiBaseUrl();

  const { data: paginatedData, isLoading } = useQuery({
    queryKey: doctorsQueryKeys.listByClinic(clinicId, page, pageSize),
    enabled: !!clinicId,
    queryFn: async () => {
      const res = await fetch(
        `${baseUrl}/doctor?clinicId=${encodeURIComponent(clinicId)}&page=${page}&pageSize=${pageSize}`,
        { method: "GET" },
      );
      if (!res.ok) throw new Error("Failed to load doctors");
      return (await res.json()) as PaginatedDoctorResponse;
    },
  });

  return {
    doctors: paginatedData?.data ?? [],
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
