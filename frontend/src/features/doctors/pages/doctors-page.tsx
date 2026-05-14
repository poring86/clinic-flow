"use client";

import { Loader2 } from "lucide-react";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { Pagination } from "@/components/ui/pagination";

import { AddDoctorButton } from "../components/add-doctor-button";
import { DoctorCard } from "../components/doctor-card";
import { useDoctorsViewModel } from "../hooks/use-doctors-view-model";

interface DoctorsPageProps {
  clinicId: string;
}

export const DoctorsPage = ({ clinicId }: DoctorsPageProps) => {
  const {
    doctors,
    total,
    totalPages,
    page,
    pageSize,
    isLoading,
    onPageChange,
    onPageSizeChange,
  } = useDoctorsViewModel({ clinicId });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Doctors</PageTitle>
          <PageDescription>Manage the doctors in your clinic.</PageDescription>
        </PageHeaderContent>

        <PageActions>
          <AddDoctorButton clinicId={clinicId} />
        </PageActions>
      </PageHeader>
      <PageContent>
        {isLoading ? (
          <div className="flex min-h-[240px] items-center justify-center rounded-md border border-dashed border-border/70 bg-background/40">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading doctors...
            </div>
          </div>
        ) : doctors.length === 0 ? (
          <div className="flex items-center justify-center rounded-md border border-dashed border-border/70 bg-background/40 py-10 text-sm text-muted-foreground">
            No results found.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {doctors.map((doctor, index) => (
              <DoctorCard
                key={doctor.id?.trim() || `${doctor.name}-${doctor.specialty}-${index}`}
                doctor={doctor}
              />
            ))}
          </div>
        )}

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </PageContent>
    </PageContainer>
  );
};