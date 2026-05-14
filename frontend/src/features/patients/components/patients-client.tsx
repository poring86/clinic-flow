"use client";

import { useQuery } from "@tanstack/react-query";

import { getPatientControllerFindAllQueryKey } from "@/api/generated/patient";
import type { PatientDto as Patient } from "@/api/schemas";
import { DataTable } from "@/components/ui/data-table";
import { getApiBaseUrl } from "@/lib/api-base-url";

import { patientsTableColumns } from "./patients-table-column";

interface PatientsClientProps {
  clinicId: string;
}

export const PatientsClient = ({ clinicId }: PatientsClientProps) => {
  const { data: patients = [], isLoading } = useQuery({
    queryKey: [...getPatientControllerFindAllQueryKey(), clinicId],
    enabled: !!clinicId,
    queryFn: async () => {
      const response = await fetch(
        `${getApiBaseUrl()}/patient?clinicId=${encodeURIComponent(clinicId)}`,
        { method: "GET" },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      return (await response.json()) as Patient[];
    },
    select: (data) =>
      [...data].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
  });

  if (isLoading) {
    return <div className="text-center py-10">Loading patients...</div>;
  }

  return <DataTable data={patients} columns={patientsTableColumns} />;
};
