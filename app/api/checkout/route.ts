import { NextResponse } from "next/server";
import { Polar } from "@polar-sh/sdk";
import { createClient } from "@/lib/supabase/server";

const polar = new Polar({ accessToken: process.env.POLAR_API_KEY! });

/**
 * POST /api/checkout
 * Body: { productId: string }
 * Creates a Polar checkout session and returns the checkout URL.
 * Embeds userId in metadata so the webhook handler can update the correct profile.
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = (await req.json()) as { productId?: string };
    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`;

    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl,
      customerEmail: user.email,
      metadata: {
        // Stored on the checkout so the webhook can map back to our user
        userId: user.id,
      },
    });

    return NextResponse.json({ checkoutUrl: checkout.url });
  } catch (err) {
    console.error("[checkout] error:", err);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
