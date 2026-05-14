"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { PatientDto as Patient } from "@/api/schemas";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { getApiBaseUrl } from "@/lib/api-base-url";

import { patientsQueryKeys } from "../query-keys";
import { patientsTableColumns } from "./patients-table-column";

interface PatientsClientProps {
  clinicId: string;
}

const PAGE_SIZE = 10;

interface PaginatedPatientResponse {
  data: Patient[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const PatientsClient = ({ clinicId }: PatientsClientProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: paginatedData, isLoading } = useQuery({
    queryKey: patientsQueryKeys.listByClinic(clinicId, currentPage),
    enabled: !!clinicId,
    queryFn: async () => {
      const response = await fetch(
        `${getApiBaseUrl()}/patient?clinicId=${encodeURIComponent(clinicId)}&page=${currentPage}&pageSize=${PAGE_SIZE}`,
        { method: "GET" },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      return (await response.json()) as PaginatedPatientResponse;
    },
  });

  const patients = paginatedData?.data ?? [];
  const totalPages = paginatedData?.totalPages ?? 0;
  const total = paginatedData?.total ?? 0;

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading patients...</div>;
  }

  return (
    <div>
      <DataTable data={patients} columns={patientsTableColumns} />
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          Total: <strong>{total}</strong> patients | Page{" "}
          <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
