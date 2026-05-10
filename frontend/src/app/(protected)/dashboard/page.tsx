import { Calendar } from "lucide-react";
import { Metadata } from "next";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { getServerSession } from "@/lib/auth/server-session";

import { DatePicker } from "./_components/date-picker";
import { SummaryContainer } from "./_components/summary-container";
import { AppointmentsChartContainer } from "./_components/appointments-chart-container";
import { TopDoctorsContainer } from "./_components/top-doctors-container";
import { TopSpecialtiesContainer } from "./_components/top-specialties-container";
import { TodayAppointmentsContainer } from "./_components/today-appointments-container";

export const metadata: Metadata = {
  title: "Dashboard | Clic Flow",
};

interface DashboardPageProps {
  searchParams: Promise<{ from?: string; to?: string }>;
}

const formatDate = (value: Date) => value.toISOString().slice(0, 10);

const addMonths = (value: Date, months: number) => {
  const date = new Date(value);
  date.setMonth(date.getMonth() + months);
  return date;
};

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const resolvedSearchParams = await searchParams;
  const from = resolvedSearchParams.from ?? formatDate(new Date());
  const to = resolvedSearchParams.to ?? formatDate(addMonths(new Date(), 1));

  const session = await getServerSession();
  const clinicId = session?.clinicId ?? "";

  // Pass from/to to TodayAppointmentsContainer as well for consistency
  // (previously it wasn't using date filters)

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Acesse uma visão geral detalhada das principais métricas e
            resultados dos pacientes
          </PageDescription>
        </PageHeaderContent>

        <PageActions>
          <DatePicker />
        </PageActions>
      </PageHeader>
      <PageContent>
        <SummaryContainer clinicId={clinicId} from={from} to={to} />

        <div className="grid grid-cols-[2.24fr_1fr] gap-4">
          <AppointmentsChartContainer clinicId={clinicId} from={from} to={to} />
          <TopDoctorsContainer clinicId={clinicId} from={from} to={to} />
        </div>

        <div className="grid grid-cols-[2.24fr_1fr] gap-4">
          <TodayAppointmentsContainer clinicId={clinicId} from={from} to={to} />
          <TopSpecialtiesContainer clinicId={clinicId} from={from} to={to} />
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;
