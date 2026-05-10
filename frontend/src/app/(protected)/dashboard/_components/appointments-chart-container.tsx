import { AppointmentsChartCard } from "@/features/dashboard";

interface AppointmentsChartContainerProps {
  clinicId: string;
  from: string;
  to: string;
}

export const AppointmentsChartContainer = ({
  clinicId,
  from,
  to,
}: AppointmentsChartContainerProps) => {
  return (
    <AppointmentsChartCard clinicId={clinicId} from={from} to={to} />
  );
};
