"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { DoctorDto as Doctor } from "@/api/schemas";
import { Button } from "@/components/ui/button";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { getApiBaseUrl } from "@/lib/api-base-url";

import { AddDoctorButton } from "../components/add-doctor-button";
import { DoctorCard } from "../components/doctor-card";
import { doctorsQueryKeys } from "../query-keys";

interface DoctorsPageProps {
  clinicId: string;
}

const PAGE_SIZE = 10;

interface PaginatedDoctorResponse {
  data: Doctor[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const DoctorsPage = ({ clinicId }: DoctorsPageProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const baseUrl = getApiBaseUrl();

  const { data: paginatedData } = useQuery({
    queryKey: doctorsQueryKeys.listByClinic(clinicId, currentPage),
    enabled: !!clinicId,
    queryFn: async () => {
      const doctorsUrl = `${baseUrl}/doctor?clinicId=${encodeURIComponent(clinicId)}&page=${currentPage}&pageSize=${PAGE_SIZE}`;
      const doctorsRes = await fetch(doctorsUrl, { method: "GET" });

      if (!doctorsRes.ok) {
        throw new Error("Failed to load doctors");
      }

      return (await doctorsRes.json()) as PaginatedDoctorResponse;
    },
  });

  const doctorsList = paginatedData?.data ?? [];
  const totalPages = paginatedData?.totalPages ?? 0;
  const total = paginatedData?.total ?? 0;

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

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
        <div className="grid grid-cols-3 gap-6">
          {doctorsList.map((doctor, index) => (
            <DoctorCard
              key={doctor.id?.trim() || `${doctor.name}-${doctor.specialty}-${index}`}
              doctor={doctor}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Total: <strong>{total}</strong> doctors | Page{" "}
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
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </PageContent>
    </PageContainer>
  );
};