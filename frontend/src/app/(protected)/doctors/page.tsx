import { DoctorsPage } from "@/features/doctors/pages";
import { getServerSession } from "@/lib/auth/server-session";

const DoctorsPageRoute = async () => {
  const session = await getServerSession();
  const clinicId = session?.clinicId ?? "";

  return <DoctorsPage clinicId={clinicId} />;
};

export default DoctorsPageRoute;
