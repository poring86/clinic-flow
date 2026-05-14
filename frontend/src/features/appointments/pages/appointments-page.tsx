"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type {
  AppointmentDto as Appointment,
  DoctorDto as Doctor,
  PatientDto as Patient,
} from "@/api/schemas";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { getApiBaseUrl } from "@/lib/api-base-url";

import { AddAppointmentButton } from "../components/add-appointment-button";
import { appointmentsTableColumns } from "../components/appointments-table-columns";
import { appointmentsQueryKeys } from "../query-keys";

interface AppointmentsPageProps {
  clinicId: string;
}

const PAGE_SIZE = 10;

interface PaginatedResponse {
  data: Appointment[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const AppointmentsPage = ({ clinicId }: AppointmentsPageProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const baseUrl = getApiBaseUrl();

  const { data: paginatedData } = useQuery({
    queryKey: appointmentsQueryKeys.list(clinicId, currentPage),
    enabled: !!clinicId,
    queryFn: async () => {
      const res = await fetch(
        `${baseUrl}/appointment?clinicId=${encodeURIComponent(clinicId)}&page=${currentPage}&pageSize=${PAGE_SIZE}`,
        { method: "GET" },
      );
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return (await res.json()) as PaginatedResponse;
    },
  });

  const appointments = paginatedData?.data ?? [];
  const totalPages = paginatedData?.totalPages ?? 0;
  const total = paginatedData?.total ?? 0;

  const { data: doctors = [] } = useQuery({
    queryKey: appointmentsQueryKeys.doctors(clinicId),
    enabled: !!clinicId,
    queryFn: async () => {
      const res = await fetch(
        `${baseUrl}/doctor?clinicId=${encodeURIComponent(clinicId)}`,
        { method: "GET" },
      );
      if (!res.ok) throw new Error("Failed to fetch doctors");
      return (await res.json()) as Doctor[];
    },
  });

  const { data: patients = [] } = useQuery({
    queryKey: appointmentsQueryKeys.patients(clinicId),
    enabled: !!clinicId,
    queryFn: async () => {
      const res = await fetch(
        `${baseUrl}/patient?clinicId=${encodeURIComponent(clinicId)}`,
        { method: "GET" },
      );
      if (!res.ok) throw new Error("Failed to fetch patients");
      return (await res.json()) as Patient[];
    },
  });

  const appointmentsWithRelations = appointments.map((appointment) => {
    const doctor = doctors.find((d) => d.id === appointment.doctorId);
    const patient = patients.find((p) => p.id === appointment.patientId);
    return {
      ...appointment,
      doctor: doctor
        ? { name: doctor.name, specialty: doctor.specialty }
        : { name: "-", specialty: "-" },
      patient: { name: patient?.name ?? "-" },
    };
  });

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
          <PageTitle>Appointments</PageTitle>
          <PageDescription>
            Manage the appointments in your clinic
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            Total: <strong>{total}</strong> appointments
          </div>
          <AddAppointmentButton
            patients={patients}
            doctors={doctors}
            clinicId={clinicId}
          />
        </div>
        <DataTable
          data={appointmentsWithRelations}
          columns={appointmentsTableColumns}
        />
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
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
      </PageContent>
    </PageContainer>
  );
};
