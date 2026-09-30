export async function sendWhatsAppVideoApproval(
  phoneNumber: string,
  strategyId: string,
  videoUrl: string,
  title: string
) {
  const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL; // e.g., https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages
  const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!WHATSAPP_API_URL || !WHATSAPP_ACCESS_TOKEN) {
    console.warn("WhatsApp API credentials missing, skipping WhatsApp message.");
    return false;
  }

  // Ensure phoneNumber has no '+', ' ' or '-'
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: cleanPhone,
    type: "interactive",
    interactive: {
      type: "button",
      header: {
        type: "video",
        video: {
          link: videoUrl
        }
      },
      body: {
        text: `Your new generated video "${title}" is ready for review! Do you approve?`
      },
      footer: {
        text: "Auto-Generated Content Strategy"
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: `approve_${strategyId}`,
              title: "Approve ✅"
            }
          },
          {
            type: "reply",
            reply: {
              id: `reject_${strategyId}`,
              title: "Reject ❌"
            }
          }
        ]
      }
    }
  };

  try {
    const res = await fetch(WHATSAPP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("WhatsApp API error:", data);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to send WhatsApp message", err);
    return false;
  }
}

export async function sendWhatsAppText(phoneNumber: string, text: string) {
  const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
  const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!WHATSAPP_API_URL || !WHATSAPP_ACCESS_TOKEN) return false;

  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: cleanPhone,
    type: "text",
    text: { body: text }
  };

  try {
    const res = await fetch(WHATSAPP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`
      },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to send WhatsApp text", err);
    return false;
  }
}
