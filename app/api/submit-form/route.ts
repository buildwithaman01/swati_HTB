import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — Update these values
// ─────────────────────────────────────────────────────────────────────────────
const GMAIL = "swatihometuitionbureau@gmail.com";
const WHATSAPP_NUMBER = "919229738307"; // International format, no +

// Google Apps Script Web App URL — paste your deployed URL here after setup
// See: /docs/google-sheets-setup.md
const GOOGLE_SHEET_WEBHOOK =
  process.env.GOOGLE_SHEET_WEBHOOK_URL || "";

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE HANDLER
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formType, ...fields } = body;

    // 1. ── Send email via Formsubmit.co (no account needed, free)
    //    First submission activates the email — you'll get a confirmation link
    const formsubmitPayload = new FormData();
    formsubmitPayload.append("_subject", 
      formType === "book-demo" 
        ? `🎓 New Demo Request — ${fields.name || "Unknown"}` 
        : `👩‍🏫 New Teacher Application — ${fields.name || "Unknown"}`
    );
    formsubmitPayload.append("_template", "table");
    formsubmitPayload.append("_captcha", "false");
    formsubmitPayload.append("Form Type", formType === "book-demo" ? "Book Demo (Student)" : "Join as Teacher");
    
    // Append all submitted fields as rows in the email
    for (const [key, value] of Object.entries(fields)) {
      if (value) formsubmitPayload.append(key, String(value));
    }

    const emailPromise = fetch(`https://formsubmit.co/${GMAIL}`, {
      method: "POST",
      body: formsubmitPayload,
    }).catch((err) => {
      console.error("[Formsubmit] Email failed:", err);
    });

    // 2. ── Send to Google Sheets (if webhook URL is configured)
    const sheetPromise = GOOGLE_SHEET_WEBHOOK
      ? fetch(GOOGLE_SHEET_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formType,
            timestamp: new Date().toISOString(),
            ...fields,
          }),
        }).catch((err) => {
          console.error("[Google Sheets] Write failed:", err);
        })
      : Promise.resolve();

    // Fire both in parallel — don't wait to slow down the user
    await Promise.allSettled([emailPromise, sheetPromise]);

    // 3. ── Build WhatsApp notification message (returned to frontend)
    //    The frontend opens this link in a new tab to ping your WhatsApp
    const waMessage = buildWhatsAppMessage(formType, fields);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

    return NextResponse.json({
      success: true,
      whatsappUrl: waUrl,
    });
  } catch (err) {
    console.error("[submit-form] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function buildWhatsAppMessage(formType: string, fields: Record<string, string>): string {
  if (formType === "book-demo") {
    return (
      `🔔 *NEW DEMO REQUEST — Swati HTB*\n\n` +
      `👤 *Name:* ${fields.name || "N/A"}\n` +
      `📞 *WhatsApp:* ${fields.phone || "N/A"}\n` +
      `📚 *Class:* ${fields.studentClass || "N/A"}\n` +
      `📖 *Subjects:* ${fields.subjects || "N/A"}\n` +
      `📍 *Address:* ${fields.address || "N/A"}\n\n` +
      `_Reply within 2 hours to convert this lead._`
    );
  }

  if (formType === "join-teacher") {
    return (
      `🔔 *NEW TEACHER APPLICATION — Swati HTB*\n\n` +
      `👤 *Name:* ${fields.name || "N/A"}\n` +
      `📞 *WhatsApp:* ${fields.phone || "N/A"}\n` +
      `👤 *Gender:* ${fields.gender || "N/A"}\n` +
      `🎓 *Qualification:* ${fields.qualification || "N/A"}\n` +
      `📚 *Subjects:* ${fields.subjects || "N/A"}\n` +
      `📍 *Location:* ${fields.location || "N/A"}\n\n` +
      `_Review and call to complete verification._`
    );
  }

  return `🔔 New form submission received on Swati HTB website.`;
}
