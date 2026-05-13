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
        <div className="flex w-full justify-start">
          <SubscriptionPlan className="w-full max-w-[390px]" userEmail={userEmail} />
        </div>
      </PageContent>
    </PageContainer>
  );
};
