"use client";

import { DataTable } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";

import { usePatientsViewModel } from "../hooks/use-patients-view-model";
import { patientsTableColumns } from "./patients-table-column";

interface PatientsClientProps {
  clinicId: string;
}

export const PatientsClient = ({ clinicId }: PatientsClientProps) => {
  const {
    patients,
    total,
    totalPages,
    page,
    pageSize,
    isLoading,
    onPageChange,
    onPageSizeChange,
  } = usePatientsViewModel({ clinicId });

  if (isLoading) {
    return <div className="text-center py-10">Loading patients...</div>;
  }

  return (
    <div>
      <DataTable data={patients} columns={patientsTableColumns} isLoading={isLoading} />
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

