import { SummaryCard } from "@/features/dashboard";

interface SummaryContainerProps {
  clinicId: string;
  from: string;
  to: string;
}

export const SummaryContainer = ({
  clinicId,
  from,
  to,
}: SummaryContainerProps) => {
  return <SummaryCard clinicId={clinicId} from={from} to={to} />;
};
