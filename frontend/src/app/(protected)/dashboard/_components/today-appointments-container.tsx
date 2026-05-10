import { TodayAppointmentsCard } from "@/features/dashboard";

interface TodayAppointmentsContainerProps {
  clinicId: string;
  from: string;
  to: string;
}

export const TodayAppointmentsContainer = ({
  clinicId,
  from,
  to,
}: TodayAppointmentsContainerProps) => {
  return <TodayAppointmentsCard clinicId={clinicId} from={from} to={to} />;
};
