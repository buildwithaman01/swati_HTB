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
    let fields: Record<string, any> = {};
    let frontUrl = "";
    let backUrl = "";

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          // files are handled separately
        } else {
          fields[key] = value;
        }
      }

      // Try uploading files to Supabase 'kyc-documents' bucket
      try {
        const supabase = await createAdminClient();
        const front = formData.get("aadhaar_front") as File | null;
        const back = formData.get("aadhaar_back") as File | null;
        
        if (front && front.size > 0) {
          const frontName = `front-${Date.now()}-${front.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
          const { data, error } = await supabase.storage.from("kyc-documents").upload(frontName, front);
          if (error) {
            console.error("[Supabase Storage Front Upload Error]:", error);
          } else if (data) {
            // Generate long-lived 1-year signed URL for emails & sheets
            const { data: signed } = await supabase.storage.from("kyc-documents").createSignedUrl(frontName, 31536000);
            frontUrl = signed?.signedUrl || `https://swatihometuition.in/api/docs/view?file=${encodeURIComponent(frontName)}`;
          }
        }
        if (back && back.size > 0) {
          const backName = `back-${Date.now()}-${back.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
          const { data, error } = await supabase.storage.from("kyc-documents").upload(backName, back);
          if (error) {
            console.error("[Supabase Storage Back Upload Error]:", error);
          } else if (data) {
            const { data: signed } = await supabase.storage.from("kyc-documents").createSignedUrl(backName, 31536000);
            backUrl = signed?.signedUrl || `https://swatihometuition.in/api/docs/view?file=${encodeURIComponent(backName)}`;
          }
        }
      } catch (err) {
        console.error("File upload error:", err);
      }
    } else {
      fields = await req.json();
    }

    const formType = fields.formType;
    delete fields.formType;

    if (frontUrl) fields.aadhaar_front_url = frontUrl;
    if (backUrl) fields.aadhaar_back_url = backUrl;

    const isDemo = formType === "book-demo";
    const subject = isDemo
      ? `🎓 New Demo Request — ${fields.name || "Unknown"} | Swati HTB`
      : `👩‍🏫 New Teacher Application — ${fields.name || "Unknown"} | Swati HTB`;

    // 1. ── Supabase Database Insertion & Vtiger CRM
    try {
      const supabase = await createAdminClient();
      
      if (isDemo) {
        // Parse subjects into array safely
        const subjectsArray = fields.subjects
          ? fields.subjects.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [];
        
        // Smart Locality detection from address or locality string
        const addressText = `${fields.locality || ""} ${fields.address || ""}`.toLowerCase();
        let detectedLocality = fields.locality || "";
        if (!detectedLocality) {
          const patnaLocalities = [
            "boring road", "kankarbagh", "patliputra", "bailey road", "rajendra nagar",
            "anandpuri", "ashiana", "digha", "danapur", "sk puri", "frazer road",
            "gola road", "saguna more", "exhibition road", "kidwaipuri", "shastri nagar",
            "mithapur", "gardanibagh", "kumhrar", "anisabad", "kurji", "phulwari"
          ];
          for (const loc of patnaLocalities) {
            if (addressText.includes(loc)) {
              detectedLocality = loc.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
              break;
            }
          }
        }
        if (!detectedLocality && fields.address) {
          detectedLocality = fields.address.split(',')[0].trim();
        }
        if (!detectedLocality) {
          detectedLocality = "Patna";
        }

        // Generate student_id fallback (e.g. STD-2026-1482) so ID is never null in DB or Admin Panel
        const currentYear = new Date().getFullYear();
        const randNum = Math.floor(1000 + Math.random() * 9000);
        const generatedStudentId = `STD-${currentYear}-${randNum}`;

        // Gender preference inference from tutor preference if provided
        const prefLower = (fields.teacherPreference || "").toLowerCase();
        let genderPref = "no_preference";
        if (prefLower.includes("female")) genderPref = "female";
        else if (prefLower.includes("male")) genderPref = "male";

        // Build comprehensive internal notes so Admin coordinators see full inquiry background
        const noteItems = [
          `Inquiry Source: ${fields.source || "Website Free Demo / Intake"}`,
          `Target Locality: ${detectedLocality}`,
          `Class: ${fields.studentClass || "Not specified"}`,
          `Subjects: ${fields.subjects || "Not specified"}`,
          fields.teacherPreference ? `Teacher Preference: ${fields.teacherPreference}` : null,
          fields.address ? `Address: ${fields.address}` : null,
          fields.message || fields.remarks ? `Note: ${fields.message || fields.remarks}` : null,
        ].filter(Boolean);

        const studentPayload: Record<string, any> = {
          student_id: generatedStudentId,
          full_name: fields.name || "Student Lead",
          parent_name: fields.name || "Parent Lead",
          parent_phone: fields.phone || "Unknown",
          whatsapp: fields.phone || null,
          class_studying: fields.studentClass || null,
          locality: detectedLocality,
          address: fields.address || detectedLocality,
          subjects_required: subjectsArray,
          subjects_needed: subjectsArray,
          enrollment_status: "enquiry",
          tuition_type_preference: "home",
          gender_preference: genderPref,
          internal_notes: noteItems.join(" | ")
        };

        // A) Insert into Supabase (status: enquiry)
        const { data: insertedStudent, error: studentInsertError } = await supabase
          .from("students")
          .insert(studentPayload)
          .select("id, student_id")
          .single();

        if (studentInsertError) {
          console.error("[Supabase Student Insert Error]:", studentInsertError);
          // If conflict on phone number, update record with new enquiry details so admin panel shows latest
          if (studentInsertError.code === "23505") {
            const { error: updateErr } = await supabase
              .from("students")
              .update({
                class_studying: studentPayload.class_studying,
                locality: studentPayload.locality,
                address: studentPayload.address,
                subjects_required: studentPayload.subjects_required,
                subjects_needed: studentPayload.subjects_needed,
                gender_preference: studentPayload.gender_preference,
                internal_notes: studentPayload.internal_notes,
                updated_at: new Date().toISOString()
              })
              .eq("parent_phone", studentPayload.parent_phone);
            if (updateErr) console.error("[Supabase Student Update Conflict Error]:", updateErr);
          }
        } else {
          console.log("[Supabase] Successfully saved student demo request:", insertedStudent);
        }

        // B) Push to Vtiger CRM as Lead
        try {
          await fetch("https://crm.swatihometuition.in/create_lead_api.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lastname: fields.name || "Unknown",
              phone: fields.phone || "Unknown",
              class: fields.studentClass || "",
              locality: detectedLocality,
              subjects: fields.subjects || "",
              requirements: `Demo Request for ${fields.studentClass || "General"}${fields.teacherPreference ? ` (${fields.teacherPreference})` : ""}`
            }),
          });
        } catch (crmErr) {
          console.error("[Vtiger CRM Insert Error]:", crmErr);
        }

      } else if (formType === "join-tutor" || formType === "join-tutor-wizard") {
        // Parse arrays safely
        const subjectsArray = fields.subjects ? fields.subjects.split(",").map((s: string) => s.trim()) : [];
        const classesArray = fields.classes ? fields.classes.split(",").map((s: string) => s.trim()) : [];
        const areasArray = fields.areas ? fields.areas.split(",").map((s: string) => s.trim()) : [];
        
        // Ensure gender matches enum (male, female, other)
        let gender = "other";
        if (fields.gender?.toLowerCase() === "male") gender = "male";
        if (fields.gender?.toLowerCase() === "female") gender = "female";

        // Generate teacher_id fallback (e.g. TCH-2026-005)
        const currentYear = new Date().getFullYear();
        const randId = Math.floor(100 + Math.random() * 900);
        const generatedTeacherId = `TCH-${currentYear}-${randId}`;

        // Safe Date of Birth (null if empty string)
        const validDob = fields.dob && fields.dob.trim() !== "" ? fields.dob.trim() : null;

        // Admin notes compiling references & guardian
        const adminNotesList = [
          fields.guardian_name ? `Guardian: ${fields.guardian_name}` : null,
          fields.ref1_name ? `Ref 1: ${fields.ref1_name} (${fields.ref1_phone || "No phone"})` : null,
          fields.ref2_name ? `Ref 2: ${fields.ref2_name} (${fields.ref2_phone || "No phone"})` : null,
          fields.mode ? `Preferred Mode: ${fields.mode}` : null,
          fields.video_url ? `Demo Video: ${fields.video_url}` : null,
        ].filter(Boolean);

        const teacherPayload: Record<string, any> = {
          teacher_id: generatedTeacherId,
          full_name: fields.name || "Unknown",
          phone: fields.whatsapp || fields.phone || "Unknown",
          whatsapp: fields.whatsapp || fields.phone || null,
          email: fields.email || null,
          gender: gender,
          date_of_birth: validDob,
          qualification: fields.qualification || "Not provided",
          institution: fields.college || null,
          experience_years: parseInt(fields.experience) || 0,
          subjects: subjectsArray,
          classes_taught: classesArray,
          areas_serviceable: areasArray,
          locality: fields.areas || fields.location || null,
          address: fields.current_address || null,
          aadhar_number: fields.aadhaar_number || fields.aadhar_number || null,
          id_proof_url: fields.aadhaar_front_url || null,
          verification_status: "pending",
          internal_notes: adminNotesList.length > 0 ? adminNotesList.join(" | ") : null,
        };

        const { data: insertedTeacher, error: dbInsertError } = await supabase
          .from("teachers")
          .insert(teacherPayload)
          .select("id, teacher_id")
          .single();

        if (dbInsertError) {
          console.error("[Supabase Insert Error]:", dbInsertError);
          // If conflict on unique phone, update existing record so admin panel has latest data
          if (dbInsertError.code === "23505") {
            const { error: updateErr } = await supabase
              .from("teachers")
              .update(teacherPayload)
              .eq("phone", teacherPayload.phone);
            if (updateErr) console.error("[Supabase Update Conflict Error]:", updateErr);
          }
        } else {
          console.log("[Supabase] Successfully inserted teacher:", insertedTeacher);
        }
      }
    } catch (dbError) {
      console.error("[Database Connection Error]:", dbError);
    }

    // 2. ── Build WhatsApp message URL
    const waMessage = buildWhatsAppMessage(formType, fields);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

    // 3. ── Build Web3Forms Payload (Clean Key-Value Table, NO raw HTML codes)
    let web3formsPayload: Record<string, any> | null = null;
    if (WEB3FORMS_KEY) {
      if (isDemo) {
        web3formsPayload = {
          access_key: WEB3FORMS_KEY,
          subject,
          from_name: "Swati HTB Website",
          "Parent / Student Name": fields.name || "N/A",
          "WhatsApp Number": fields.phone || "N/A",
          "Student Class": fields.studentClass || "N/A",
          "Subjects Needed": fields.subjects || "Not specified",
          "Home Address": fields.address || "N/A",
        };
      } else {
        web3formsPayload = {
          access_key: WEB3FORMS_KEY,
          subject,
          from_name: "Swati HTB Teacher Onboarding",
          "Full Name": fields.name || "N/A",
          "WhatsApp Number": fields.whatsapp || fields.phone || "N/A",
          "Gender": fields.gender || "N/A",
          "Date of Birth": fields.dob || "N/A",
          "Father or Husband Name": fields.guardian_name || "N/A",
          "Email Address": fields.email || "N/A",
          "Current Address": fields.current_address || "N/A",
          "Highest Qualification": fields.qualification || "N/A",
          "College / University": fields.college || "N/A",
          "Subjects Can Teach": fields.subjects || "N/A",
          "Classes Can Teach": fields.classes || "N/A",
          "Teaching Experience": `${fields.experience || 0} Years`,
          "Preferred Mode": fields.mode || "N/A",
          "Serviceable Areas": fields.areas || "N/A",
          "Demo Video": fields.video_url || "Not provided",
          "Aadhaar Number": fields.aadhaar_number || "N/A",
          "Aadhaar Front Link": fields.aadhaar_front_url || "Not uploaded",
          "Aadhaar Back Link": fields.aadhaar_back_url || "Not uploaded",
          "Reference 1": fields.ref1_name ? `${fields.ref1_name} (${fields.ref1_phone || "No phone"})` : "N/A",
          "Reference 2": fields.ref2_name ? `${fields.ref2_name} (${fields.ref2_phone || "No phone"})` : "N/A",
          "Bureau Agreements": "Accepted Anti-Bypass & Background Verification Policy",
        };
      }
    }

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

    // 5. ── Return data to frontend
    return NextResponse.json({
      success: true,
      message: "Form processed successfully",
      whatsappUrl: waUrl,
      web3formsData: web3formsPayload
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
        ["Aadhaar Front", fields.aadhaar_front_url ? `<a href="${fields.aadhaar_front_url}">View</a>` : "Not uploaded"],
        ["Aadhaar Back", fields.aadhaar_back_url ? `<a href="${fields.aadhaar_back_url}">View</a>` : "Not uploaded"],
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
