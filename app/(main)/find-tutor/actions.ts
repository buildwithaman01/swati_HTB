"use server";

import { createAdminClient } from "@/utils/supabase/server";

const WHATSAPP_NUMBER = "919229738307";

export async function submitLeadToCRM(formData: FormData) {
  const name = (formData.get("name") as string)?.trim() || "Parent Lead";
  const phone = (formData.get("phone") as string)?.trim() || "";
  const studentClass = (formData.get("class") as string)?.trim() || "";
  const locality = (formData.get("locality") as string)?.trim() || "";
  const subjects = (formData.get("subjects") as string)?.trim() || "";
  const requirements = (formData.get("requirements") as string)?.trim() || "";

  const subjectsArray = subjects
    ? subjects.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  let dbSuccess = false;

  // 1. ── Insert into Supabase (Admin Client bypasses RLS)
  try {
    const supabase = await createAdminClient();

    const currentYear = new Date().getFullYear();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const fallbackStudentId = `STD-${currentYear}-${randNum}`;

    const studentPayload = {
      student_id: fallbackStudentId,
      full_name: name,
      parent_name: name,
      parent_phone: phone,
      whatsapp: phone,
      class_studying: studentClass || null,
      locality: locality || null,
      address: locality || null,
      subjects_required: subjectsArray,
      subjects_needed: subjectsArray,
      tuition_type_preference: "home",
      enrollment_status: "enquiry",
      internal_notes: requirements
        ? `Tutor Search Request. Specific Requirements: ${requirements}`
        : "Tutor Search Request from /find-tutor page.",
    };

    const { error: insertError } = await supabase
      .from("students")
      .insert(studentPayload);

    if (insertError) {
      console.error("[Supabase Insert Error in find-tutor]:", insertError);
      // If already exists with phone, update to reflect new enquiry
      if (insertError.code === "23505") {
        await supabase
          .from("students")
          .update(studentPayload)
          .eq("parent_phone", phone);
      }
    } else {
      dbSuccess = true;
      console.log("[Supabase] Successfully saved lead from find-tutor");
    }
  } catch (dbErr) {
    console.error("[Supabase Connection Error in find-tutor]:", dbErr);
  }

  // 2. ── Push to Vtiger CRM
  try {
    await fetch("https://crm.swatihometuition.in/create_lead_api.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lastname: name,
        phone: phone,
        class: studentClass,
        locality: locality,
        subjects: subjects,
        requirements: requirements,
      }),
    });
  } catch (crmError) {
    console.error("[Vtiger CRM Push Error]:", crmError);
  }

  // 3. ── Push to Google Sheet webhook (if configured)
  const GOOGLE_SHEET_WEBHOOK = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (GOOGLE_SHEET_WEBHOOK) {
    try {
      await fetch(GOOGLE_SHEET_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "find-tutor",
          timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          name,
          phone,
          studentClass,
          locality,
          subjects,
          requirements,
        }),
        signal: AbortSignal.timeout(8000),
      });
    } catch (err) {
      console.error("[Sheets Push Error]:", err);
    }
  }

  // 4. ── Generate WhatsApp deep link
  const waMessage =
    `🔔 *NEW TUTOR SEARCH ENQUIRY — Swati HTB*\n\n` +
    `👤 *Name:* ${name}\n` +
    `📞 *WhatsApp:* ${phone}\n` +
    `📚 *Class:* ${studentClass || "N/A"}\n` +
    `📍 *Locality:* ${locality || "N/A"}\n` +
    `📖 *Subjects:* ${subjects || "N/A"}\n` +
    (requirements ? `📝 *Requirements:* ${requirements}\n\n` : "\n") +
    `_Sent from swatihometuition.in/find-tutor_`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  return { success: true, whatsappUrl };
}
