import {
  SubscriptionPage,
} from "@/features/subscription";
import { getServerSession } from "@/lib/auth/server-session";

const SubscriptionPageRoute = async () => {
  const session = await getServerSession();

  return <SubscriptionPage userEmail={session?.email ?? ""} />;
};

export default SubscriptionPageRoute;
