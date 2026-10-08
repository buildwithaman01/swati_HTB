import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = "919229738307";

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE HANDLER
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Read env vars INSIDE the function so Vercel checks them at runtime, not build time
  const WEB3FORMS_KEY = process.env.WEB3FORMS_KEY || "";
  const GOOGLE_SHEET_WEBHOOK = process.env.GOOGLE_SHEET_WEBHOOK_URL || "";

  try {
    const body = await req.json();
    const { formType, ...fields } = body;

    const isDemo = formType === "book-demo";
    const subject = isDemo
      ? `🎓 New Demo Request — ${fields.name || "Unknown"} | Swati HTB`
      : `👩‍🏫 New Teacher Application — ${fields.name || "Unknown"} | Swati HTB`;

    // 1. ── Supabase Database Insertion & Vtiger CRM
    try {
      const supabase = await createAdminClient();
      
      if (isDemo) {
        // Parse subjects into array safely
        const subjectsArray = fields.subjects ? fields.subjects.split(",").map((s: string) => s.trim()) : [];
        
        // A) Insert into Supabase (status: enquiry)
        await supabase.from("students").insert({
          full_name: fields.name || "Unknown",
          parent_name: fields.name || "Unknown",
          parent_phone: fields.phone || "Unknown",
          class_studying: fields.studentClass || null,
          subjects_needed: subjectsArray,
          address: fields.address || null,
          enrollment_status: "enquiry"
        });

        // B) Push to Vtiger CRM as Lead
        try {
          await fetch("https://crm.swatihometuition.in/create_lead_api.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lastname: fields.name || "Unknown",
              phone: fields.phone || "Unknown",
              class: fields.studentClass || "",
              locality: fields.address || "",
              subjects: fields.subjects || "",
              requirements: "",
            }),
          });
        } catch (crmErr) {
          console.error("[Vtiger CRM Insert Error]:", crmErr);
        }

      } else if (formType === "join-tutor" || formType === "join-tutor-wizard") {
        // Parse subjects into array safely
        const subjectsArray = fields.subjects ? fields.subjects.split(",").map((s: string) => s.trim()) : [];
        
        // Ensure gender matches enum (male, female, other)
        let gender = "other";
        if (fields.gender?.toLowerCase() === "male") gender = "male";
        if (fields.gender?.toLowerCase() === "female") gender = "female";

        await supabase.from("teachers").insert({
          full_name: fields.name || "Unknown",
          phone: fields.whatsapp || fields.phone || "Unknown",
          gender: gender,
          qualification: fields.qualification || "Not provided",
          subjects: subjectsArray,
          locality: fields.areas || fields.location || null,
          verification_status: "pending"
        });
      }
    } catch (dbError) {
      console.error("[Supabase Insert Error]:", dbError);
      // We continue even if DB fails, so they still get the WhatsApp redirect
    }

    // 2. ── Build WhatsApp message URL
    const waMessage = buildWhatsAppMessage(formType, fields);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

    // 3. ── Build a clean HTML email body for Web3Forms
    const emailHtml = buildEmailHtml(formType, fields);

    // 4. ── Google Sheets (if configured)
    if (GOOGLE_SHEET_WEBHOOK) {
      fetch(GOOGLE_SHEET_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType,
          timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          ...fields,
        }),
      }).catch((err) => console.error("[Sheets] Failed:", err));
    }

    // 5. ── Return data to frontend (Frontend will send to Web3Forms directly)
    return NextResponse.json({
      success: true,
      message: "Form processed successfully",
      whatsappUrl: waUrl,
      // Pass email data to frontend
      web3formsData: WEB3FORMS_KEY ? {
        access_key: WEB3FORMS_KEY,
        subject,
        message: emailHtml,
      } : null
    });
  } catch (err) {
    console.error("[submit-form] Error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL HTML
// ─────────────────────────────────────────────────────────────────────────────
function buildEmailHtml(formType: string, fields: Record<string, string>): string {
  const isDemo = formType === "book-demo";
  const rows = isDemo
    ? [
        ["Parent/Student Name", fields.name],
        ["WhatsApp Number", fields.phone],
        ["Student Class", fields.studentClass],
        ["Subjects Needed", fields.subjects || "Not specified"],
        ["Home Address", fields.address],
      ]
    : formType === "join-tutor-wizard"
    ? [
        ["Full Name", fields.name],
        ["WhatsApp Number", fields.whatsapp],
        ["Gender", fields.gender],
        ["Qualification", fields.qualification],
        ["College", fields.college],
        ["Subjects", fields.subjects],
        ["Classes", fields.classes],
        ["Experience", `${fields.experience} Years`],
        ["Preferred Mode", fields.mode],
        ["Serviceable Areas", fields.areas],
        ["Demo Video", fields.video_url || "Not provided"],
      ]
    : [
        ["Full Name", fields.name],
        ["WhatsApp Number", fields.phone],
        ["Gender", fields.gender],
        ["Qualification", fields.qualification],
        ["Subjects", fields.subjects],
        ["Location in Patna", fields.location],
      ];

  const tableRows = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 16px;background:#f8f8f8;font-weight:600;color:#555;border-bottom:1px solid #eee;width:35%">${label}</td>
        <td style="padding:10px 16px;color:#111;border-bottom:1px solid #eee">${value || "—"}</td>
      </tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0F4C5C;padding:24px 32px;border-radius:8px 8px 0 0">
        <h2 style="color:#fff;margin:0;font-size:20px">
          ${isDemo ? "🎓 New Demo Class Request" : "👩‍🏫 New Teacher Application"}
        </h2>
        <p style="color:#ffffff99;margin:4px 0 0;font-size:14px">Swati Home Tuition Bureau — swatihometuition.in</p>
      </div>
      <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-top:none">
        ${tableRows}
      </table>
      <div style="padding:20px 16px;background:#fffbf0;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
        <p style="margin:0;color:#555;font-size:14px">
          ⏰ <strong>Action Required:</strong> Contact within 2 hours for best conversion.<br/>
          📞 Reply to this email or WhatsApp: <strong>+91 92297 38307</strong>
        </p>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// WHATSAPP MESSAGE
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
      `_Reply within 2 hours._`
    );
  }
  if (formType === "join-tutor-wizard") {
    return (
      `🔔 *NEW TEACHER APPLICATION (WIZARD)*\n\n` +
      `👤 *Name:* ${fields.name || "N/A"}\n` +
      `📞 *WhatsApp:* ${fields.whatsapp || "N/A"}\n` +
      `🎓 *Qual:* ${fields.qualification || "N/A"}\n` +
      `📚 *Subjects:* ${fields.subjects || "N/A"}\n` +
      `📍 *Areas:* ${fields.areas || "N/A"}\n\n` +
      `_Check Admin Panel for full details._`
    );
  }

  return (
    `🔔 *NEW TEACHER APPLICATION — Swati HTB*\n\n` +
    `👤 *Name:* ${fields.name || "N/A"}\n` +
    `📞 *WhatsApp:* ${fields.phone || "N/A"}\n` +
    `👤 *Gender:* ${fields.gender || "N/A"}\n` +
    `🎓 *Qualification:* ${fields.qualification || "N/A"}\n` +
    `📚 *Subjects:* ${fields.subjects || "N/A"}\n` +
    `📍 *Location:* ${fields.location || "N/A"}\n\n` +
    `_Review and call to verify._`
  );
}
