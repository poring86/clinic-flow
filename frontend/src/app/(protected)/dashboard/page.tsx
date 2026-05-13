import { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import {
  AppointmentsChartCard,
  DatePicker,
  SummaryCard,
  TodayAppointmentsCard,
  TopDoctorsCard,
  TopSpecialtiesCard,
} from "@/features/dashboard";
import { getServerSession } from "@/lib/auth/server-session";

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

  // Redirect to clinic form if no clinic is associated
  if (!clinicId) {
    redirect("/clinic-form");
  }

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
        <SummaryCard clinicId={clinicId} from={from} to={to} />

        <div className="grid grid-cols-[2.24fr_1fr] gap-4">
          <AppointmentsChartCard clinicId={clinicId} from={from} to={to} />
          <TopDoctorsCard clinicId={clinicId} from={from} to={to} />
        </div>

        <div className="grid grid-cols-[2.24fr_1fr] gap-4">
          <TodayAppointmentsCard clinicId={clinicId} from={from} to={to} />
          <TopSpecialtiesCard clinicId={clinicId} from={from} to={to} />
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;
