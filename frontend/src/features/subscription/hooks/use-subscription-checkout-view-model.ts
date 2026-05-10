import { loadStripe } from "@stripe/stripe-js";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { createStripeCheckoutService } from "../services/create-stripe-checkout-service";

interface UseSubscriptionCheckoutViewModelParams {
  userEmail: string;
}

export const useSubscriptionCheckoutViewModel = ({
  userEmail,
}: UseSubscriptionCheckoutViewModelParams) => {
  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const data = await createStripeCheckoutService({ email: userEmail });

      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Stripe publishable key not found.");
      }

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      if (!stripe) {
        throw new Error("Stripe not found.");
      }

      if (!data?.sessionId) {
        throw new Error("Session ID not found.");
      }

      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to start checkout.";
      toast.error(message);
    },
  });

  return {
    isPending: subscribeMutation.isPending,
    subscribe: () => subscribeMutation.mutate(),
  };
};
