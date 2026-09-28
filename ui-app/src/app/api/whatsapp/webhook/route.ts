import { inngest } from "@/lib/inngest-client";
import { NextResponse } from "next/server";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "my_secure_verify_token";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFIED");
    return new NextResponse(challenge, { status: 200 });
  } else {
    return new NextResponse("Forbidden", { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.value && change.value.messages) {
            for (const message of change.value.messages) {
              if (message.type === "interactive") {
                const interactive = message.interactive;
                if (interactive.type === "button_reply") {
                  const payload = interactive.button_reply.id; // e.g., "approve_strat123" or "reject_strat123"
                  
                  if (payload.startsWith("approve_")) {
                    const strategyId = payload.replace("approve_", "");
                    await inngest.send({
                      name: "whatsapp/approval.received",
                      data: { strategyId, approved: true }
                    });
                  } else if (payload.startsWith("reject_")) {
                    const strategyId = payload.replace("reject_", "");
                    await inngest.send({
                      name: "whatsapp/approval.received",
                      data: { strategyId, approved: false }
                    });
                  }
                }
              }
            }
          }
        }
      }
      return NextResponse.json({ success: true });
    } else {
      return new NextResponse("Not Found", { status: 404 });
    }
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
