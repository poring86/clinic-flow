"use client";

import { useQuery } from "@tanstack/react-query";

import type {
  AppointmentDto as Appointment,
  DoctorDto as Doctor,
  PatientDto as Patient,
} from "@/api/schemas";
import { DataTable } from "@/components/ui/data-table";
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

export const AppointmentsPage = ({ clinicId }: AppointmentsPageProps) => {
  const baseUrl = getApiBaseUrl();

  const { data: appointments = [] } = useQuery({
    queryKey: appointmentsQueryKeys.list(clinicId),
    enabled: !!clinicId,
    queryFn: async () => {
      const res = await fetch(
        `${baseUrl}/appointment?clinicId=${encodeURIComponent(clinicId)}`,
        { method: "GET" },
      );
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return (await res.json()) as Appointment[];
    },
    select: (data) =>
      [...data].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
  });

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

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>
            Gerencie os agendamentos da sua clínica
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <div className="flex justify-end mb-4">
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
      </PageContent>
    </PageContainer>
  );
};
