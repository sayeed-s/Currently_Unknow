import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  // 1. Verify that the request really came from Clerk.
  let event;

  try {
    event = await verifyWebhook(req);
  } catch (error) {
    console.error("Clerk webhook verification failed:", error);

    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 },
    );
  }

  // 2. Process the verified event.
  try {
    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const {
          id,
          email_addresses,
          primary_email_address_id,
          first_name,
          username,
          image_url,
        } = event.data;

        const primaryEmail = email_addresses.find(
          (email) => email.id === primary_email_address_id,
        )?.email_address;

        await prisma.user.upsert({
          where: { clerkId: id },
          create: {
            clerkId: id,
            email: primaryEmail || "",
            username: username || first_name || "",
            imageUrl: image_url,
            wallet: {
              create: {},
            },
          },
          update: {
            email: primaryEmail,
            username: username || first_name || "",
            imageUrl: image_url,
          },
        });

        break;
      }

      case "user.deleted": {
        const { id } = event.data;

        if (id) {
          await prisma.user.deleteMany({
            where: { clerkId: id },
          });
        }

        break;
      }

      default:
        // Other verified Clerk events are intentionally ignored.
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Clerk webhook database processing failed:", error);

    // A server error lets Clerk retry a failed delivery.
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
