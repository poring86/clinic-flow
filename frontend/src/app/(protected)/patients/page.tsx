import { PatientsPage } from "@/features/patients/pages";
import { getServerSession } from "@/lib/auth/server-session";

const PatientsPageRoute = async () => {
  const session = await getServerSession();
  const clinicId = session?.clinicId ?? "";

  return <PatientsPage clinicId={clinicId} />;
};

export default PatientsPageRoute;
