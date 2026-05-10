import { TopDoctorsCard } from "@/features/dashboard";

interface TopDoctorsContainerProps {
  clinicId: string;
  from: string;
  to: string;
}

export const TopDoctorsContainer = ({
  clinicId,
  from,
  to,
}: TopDoctorsContainerProps) => {
  return <TopDoctorsCard clinicId={clinicId} from={from} to={to} />;
};
