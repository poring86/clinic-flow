import { TopSpecialtiesCard } from "@/features/dashboard";

interface TopSpecialtiesContainerProps {
  clinicId: string;
  from: string;
  to: string;
}

export const TopSpecialtiesContainer = ({
  clinicId,
  from,
  to,
}: TopSpecialtiesContainerProps) => {
  return <TopSpecialtiesCard clinicId={clinicId} from={from} to={to} />;
};
