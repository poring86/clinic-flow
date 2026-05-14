import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import type {
  AppointmentDto as Appointment,
  DoctorDto as Doctor,
  PatientDto as Patient,
} from "@/api/schemas";
import { getApiBaseUrl } from "@/lib/api-base-url";

import { appointmentsQueryKeys } from "../query-keys";

interface PaginatedAppointmentResponse {
  data: Appointment[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface UseAppointmentsViewModelParams {
  clinicId: string;
}

export const useAppointmentsViewModel = ({ clinicId }: UseAppointmentsViewModelParams) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const baseUrl = getApiBaseUrl();

  const { data: paginatedData, isLoading } = useQuery({
    queryKey: appointmentsQueryKeys.list(clinicId, page, pageSize),
    enabled: !!clinicId,
    queryFn: async () => {
      const res = await fetch(
        `${baseUrl}/appointment?clinicId=${encodeURIComponent(clinicId)}&page=${page}&pageSize=${pageSize}`,
        { method: "GET" },
      );
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return (await res.json()) as PaginatedAppointmentResponse;
    },
  });

  const { data: doctors = [] } = useQuery({
    queryKey: appointmentsQueryKeys.doctors(clinicId),
    enabled: !!clinicId,
    queryFn: async () => {
      const res = await fetch(
        `${baseUrl}/doctor?clinicId=${encodeURIComponent(clinicId)}&page=1&pageSize=500`,
        { method: "GET" },
      );
      if (!res.ok) throw new Error("Failed to fetch doctors");
      const json = await res.json();
      return (json.data ?? json) as Doctor[];
    },
  });

  const { data: patients = [] } = useQuery({
    queryKey: appointmentsQueryKeys.patients(clinicId),
    enabled: !!clinicId,
    queryFn: async () => {
      const res = await fetch(
        `${baseUrl}/patient?clinicId=${encodeURIComponent(clinicId)}&page=1&pageSize=500`,
        { method: "GET" },
      );
      if (!res.ok) throw new Error("Failed to fetch patients");
      const json = await res.json();
      return (json.data ?? json) as Patient[];
    },
  });

  const appointments = (paginatedData?.data ?? []).map((appointment) => {
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

  return {
    appointments,
    doctors,
    patients,
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
