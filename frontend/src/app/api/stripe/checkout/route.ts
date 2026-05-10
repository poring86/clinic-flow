import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

interface CheckoutBody {
  email?: string;
}

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_ID;

    if (!secretKey) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY is not configured." },
        { status: 500 },
      );
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "STRIPE_PRICE_ID is not configured." },
        { status: 500 },
      );
    }

    const stripe = new Stripe(secretKey);
    const body = (await request.json().catch(() => ({}))) as CheckoutBody;

    const origin = request.headers.get("origin") ?? "http://localhost:3000";
    const successUrl = `${origin}/subscription?status=success`;
    const cancelUrl = `${origin}/subscription?status=cancelled`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: body.email,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create Stripe checkout session.";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
