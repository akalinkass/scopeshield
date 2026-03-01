/**
 * Clerk webhook — syncs user creation to our database.
 * Clerk userId becomes User.id (primary key).
 */
import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { env } from "@/lib/env";

interface ClerkUserCreatedEvent {
  data: {
    id: string;
    email_addresses: Array<{ email_address: string; id: string }>;
    primary_email_address_id: string;
  };
  type: string;
}

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();

  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse("Missing svix headers", { status: 400 });
  }

  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
  let evt: ClerkUserCreatedEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserCreatedEvent;
  } catch {
    return new NextResponse("Invalid webhook signature", { status: 400 });
  }

  if (evt.type === "user.created") {
    const primaryEmail = evt.data.email_addresses.find(
      (e) => e.id === evt.data.primary_email_address_id
    );
    if (primaryEmail) {
      await db.user.upsert({
        where: { id: evt.data.id },
        create: {
          id: evt.data.id,
          email: primaryEmail.email_address,
        },
        update: {
          email: primaryEmail.email_address,
        },
      });
      console.log(
        JSON.stringify({ event: "user_created", userId: evt.data.id })
      );
    }
  }

  return NextResponse.json({ received: true });
}
