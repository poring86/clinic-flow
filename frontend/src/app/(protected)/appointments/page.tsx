import { AppointmentsPage } from "@/features/appointments/pages/appointments-page";
import { getServerSession } from "@/lib/auth/server-session";

const AppointmentsPageRoute = async () => {
  const session = await getServerSession();
  const clinicId = session?.clinicId ?? "";

  return <AppointmentsPage clinicId={clinicId} />;
};

export default AppointmentsPageRoute;
