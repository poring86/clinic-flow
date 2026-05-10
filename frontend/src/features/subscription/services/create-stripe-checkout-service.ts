import type { StartSubscriptionCommand } from "../contracts/start-subscription-command";

interface CheckoutSessionResponse {
  sessionId: string;
}

export const createStripeCheckoutService = async ({
  email,
}: StartSubscriptionCommand): Promise<CheckoutSessionResponse> => {
  const response = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(errorData?.error ?? "Failed to create checkout session.");
  }

  return (await response.json()) as CheckoutSessionResponse;
};
