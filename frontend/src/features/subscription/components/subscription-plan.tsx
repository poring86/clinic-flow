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
    <Card
      className={`overflow-hidden border border-white/12 bg-[linear-gradient(180deg,rgba(78,92,168,0.28)_0%,rgba(47,55,103,0.82)_100%)] shadow-[0_22px_50px_rgba(10,14,35,0.34)] backdrop-blur-sm ${className ?? ""}`}
    >
      <CardHeader className="space-y-5 p-6">
        <div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-[#57a6ff] via-[#7c8cff] to-[#b06aff]" />
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-[#f4f7ff]">Essential</h3>
          {active && (
            <Badge className="border border-emerald-400/25 bg-emerald-500/16 text-emerald-200 hover:bg-emerald-500/16">
              Current
            </Badge>
          )}
        </div>
        <p className="max-w-[26ch] text-sm leading-6 text-[#bdc9f3]">
          For independent professionals or small clinics
        </p>
        <div className="flex items-end gap-2">
          <span className="text-5xl font-semibold tracking-tight text-white">R$59</span>
          <span className="pb-1 text-base text-[#aebce7]">/ month</span>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        <div className="space-y-4 border-t border-white/18 pt-6">
          {features.map((feature) => (
            <div key={feature} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/14 ring-1 ring-emerald-400/30">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              </div>
              <p className="text-sm text-[#dbe4ff]">{feature}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button
            className="h-11 w-full"
            variant={active ? "outline" : "default"}
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
