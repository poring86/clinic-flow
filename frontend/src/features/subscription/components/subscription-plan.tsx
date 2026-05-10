"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { useSubscriptionCheckoutViewModel } from "../hooks/use-subscription-checkout-view-model";

interface SubscriptionPlanProps {
  active?: boolean;
  className?: string;
  userEmail: string;
}

export const SubscriptionPlan = ({
  active = false,
  className,
  userEmail,
}: SubscriptionPlanProps) => {
  const router = useRouter();

  const subscriptionCheckoutViewModel = useSubscriptionCheckoutViewModel({
    userEmail,
  });

  const features = [
    "Up to 3 doctors",
    "Unlimited appointments",
    "Basic metrics",
    "Patient management",
    "Manual confirmation",
    "Email support",
  ];

  const handleManagePlanClick = () => {
    const customerPortalUrl = process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL;
    if (!customerPortalUrl) {
      return;
    }

    router.push(`${customerPortalUrl}?prefilled_email=${userEmail}`);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">Essential</h3>
          {active && (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              Current
            </Badge>
          )}
        </div>
        <p className="text-gray-600">
          For independent professionals or small clinics
        </p>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-gray-900">R$59</span>
          <span className="ml-1 text-gray-600">/ month</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 border-t border-gray-200 pt-6">
          {features.map((feature) => (
            <div key={feature} className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <p className="ml-3 text-gray-600">{feature}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button
            className="w-full"
            variant="outline"
            onClick={active ? handleManagePlanClick : subscriptionCheckoutViewModel.subscribe}
            disabled={subscriptionCheckoutViewModel.isPending}
          >
            {subscriptionCheckoutViewModel.isPending ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : active ? (
              "Manage subscription"
            ) : (
              "Subscribe"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
