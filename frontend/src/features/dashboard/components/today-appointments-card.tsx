"use client";

import { Calendar } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { appointmentsTableColumns } from "@/features/appointments/components";
import { useDashboardTodayAppointmentsViewModel } from "@/features/dashboard/hooks";

interface TodayAppointmentsCardProps {
  clinicId: string;
  from: string;
  to: string;
}

export const TodayAppointmentsCard = ({
  clinicId,
  from,
  to,
}: TodayAppointmentsCardProps) => {
  const { appointments, isLoading, error } =
    useDashboardTodayAppointmentsViewModel({
      clinicId,
      from,
      to,
    });

  const normalizedAppointments = appointments.map((appointment) => ({
    id: appointment.id,
    clinicId,
    date: appointment.date ?? appointment.scheduledAt ?? new Date().toISOString(),
    patient: {
      name: appointment.patient?.name ?? appointment.patientName ?? "-",
    },
    doctor: {
      name: appointment.doctor?.name ?? appointment.doctorName ?? "-",
      specialty: appointment.doctor?.specialty ?? appointment.specialty ?? "-",
    },
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
            <Calendar className="text-primary h-4 w-4" />
          </div>
          <CardTitle className="text-base">Today&apos;s Appointments</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-40 bg-muted animate-pulse rounded" />
        ) : error ? (
          <div className="p-4 bg-destructive/10 text-destructive rounded">
            Failed to load appointments
          </div>
        ) : (
          <DataTable
            columns={appointmentsTableColumns}
            data={normalizedAppointments}
          />
        )}
      </CardContent>
    </Card>
  );
};
