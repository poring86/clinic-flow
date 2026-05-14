"use client";

import { DataTable } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

import { AddAppointmentButton } from "../components/add-appointment-button";
import { appointmentsTableColumns } from "../components/appointments-table-columns";
import { useAppointmentsViewModel } from "../hooks/use-appointments-view-model";

interface AppointmentsPageProps {
  clinicId: string;
}

export const AppointmentsPage = ({ clinicId }: AppointmentsPageProps) => {
  const {
    appointments,
    doctors,
    patients,
    total,
    totalPages,
    page,
    pageSize,
    isLoading,
    onPageChange,
    onPageSizeChange,
  } = useAppointmentsViewModel({ clinicId });

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
        <div className="flex justify-end mb-4">
          <AddAppointmentButton
            patients={patients}
            doctors={doctors}
            clinicId={clinicId}
          />
        </div>
        <DataTable
          data={appointments}
          columns={appointmentsTableColumns}
          isLoading={isLoading}
        />
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

