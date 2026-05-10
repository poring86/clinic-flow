import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

import { SubscriptionPlan } from "../components/subscription-plan";

interface SubscriptionPageProps {
  userEmail: string;
}

export const SubscriptionPage = ({ userEmail }: SubscriptionPageProps) => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Subscription</PageTitle>
          <PageDescription>Manage your current plan.</PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <SubscriptionPlan className="w-[350px]" userEmail={userEmail} />
      </PageContent>
    </PageContainer>
  );
};
