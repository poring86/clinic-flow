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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Calendar className="text-muted-foreground" />
          <CardTitle className="text-base">Agendamentos de hoje</CardTitle>
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
          <DataTable columns={appointmentsTableColumns} data={appointments} />
        )}
      </CardContent>
    </Card>
  );
};
