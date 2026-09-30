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
                  const payload = interactive.button_reply.id;
                  
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
              } else if (message.type === "text") {
                const textBody = message.text.body;
                const sender = message.from; // e.g., "1234567890"

                const { db } = await import("@/lib/db");
                const { user, contentStrategy } = await import("@/db/schema");
                const { like, eq, desc } = await import("drizzle-orm");
                const { sendWhatsAppText } = await import("@/lib/whatsapp");

                // Find user by phone number (basic match)
                const u = await db.query.user.findFirst({
                  where: like(user.phoneNumber, `%${sender}%`)
                });

                if (u) {
                  // Find their latest strategy to use its settings (voice, avatar, platforms)
                  const strat = await db.query.contentStrategy.findFirst({
                    where: eq(contentStrategy.userId, u.id),
                    orderBy: [desc(contentStrategy.createdAt)]
                  });

                  if (strat) {
                    await sendWhatsAppText(sender, `Got it! I am generating a video on: "${textBody}". I'll send it here for your approval when it's done! 🎬`);
                    
                    // Trigger Inngest to generate the video for the custom topic
                    await inngest.send({
                      name: "strategy/generate.requested",
                      data: {
                        strategyId: strat.id,
                        userId: u.id,
                        niche: strat.niche,
                        style: strat.contentStyle,
                        durationValue: strat.durationValue,
                        durationUnit: strat.durationUnit,
                        platforms: JSON.parse(strat.platforms),
                        uploadTimes: JSON.parse(strat.uploadTimes),
                        voiceId: strat.voiceId,
                        avatarId: strat.avatarId,
                        customTopic: textBody
                      }
                    });
                  } else {
                    await sendWhatsAppText(sender, "I found your account, but you haven't set up a Content Strategy yet! Please log into the dashboard, configure your Avatar & Voice, and try again.");
                  }
                } else {
                  await sendWhatsAppText(sender, "Welcome to Avatar AI! Please log into our website and update your profile with your WhatsApp phone number to use this bot.");
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
