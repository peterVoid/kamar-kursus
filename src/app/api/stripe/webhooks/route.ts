import { env } from "@/env";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const sessionData = event.data.object;
    const customerId = sessionData.customer as string;
    const courseId = sessionData.metadata?.courseId;

    if (!courseId || !customerId) {
      throw new Error("The data not correctly");
    }

    const user = await prisma.user.findUnique({
      where: {
        stripeCustomerId: customerId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.enrollment.update({
      where: {
        id: sessionData.metadata?.enrollmentId as string,
      },
      data: {
        userId: user.id,
        amount: sessionData.amount_subtotal as number,
        courseId,
        status: "Active",
      },
    });
  }

  return new Response(null, { status: 200 });
}
