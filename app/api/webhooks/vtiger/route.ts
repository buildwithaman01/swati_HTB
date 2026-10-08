import { createAdminClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Vtiger usually sends data as x-www-form-urlencoded or JSON, depending on the workflow setup.
    let payload;
    const contentType = request.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else {
      const formData = await request.formData();
      payload = Object.fromEntries(formData.entries());
    }

    console.log("Received Webhook from Vtiger:", payload);

    // Make sure we have the minimum required fields
    const status = payload.status || payload.leadstatus || payload.contactstatus;
    
    // We only process if they are marked as "Enrolled" or "Closed Won"
    if (status !== "Enrolled" && status !== "Closed Won") {
      return NextResponse.json({ message: "Ignored: Status is not Enrolled" }, { status: 200 });
    }

    const parentPhone = payload.parent_phone || payload.mobile || payload.phone;
    if (!parentPhone) {
      return NextResponse.json({ error: "Missing parent phone number" }, { status: 400 });
    }

    const adminSupabase = await createAdminClient();

    // Check if student already exists by phone to prevent duplicates
    const { data: existing } = await adminSupabase
      .from("students")
      .select("id")
      .eq("parent_phone", parentPhone)
      .single();

    if (existing) {
      return NextResponse.json({ message: "Student already exists", id: existing.id }, { status: 200 });
    }

    // Insert into Supabase
    const { data: student, error } = await adminSupabase.from("students").insert({
      full_name: payload.student_name || payload.lastname || "Unknown Student",
      parent_name: payload.parent_name || payload.firstname || "Unknown Parent",
      parent_phone: parentPhone,
      email: payload.email || null,
      locality: payload.locality || payload.city || "Unknown Locality",
      address: payload.address || payload.lane || "",
      class_studying: payload.class_studying || payload.cf_class || "N/A",
      board: payload.board || "Other",
      subjects_required: payload.subjects ? payload.subjects.split(',').map((s: string) => s.trim()) : [],
      tuition_type_preference: payload.tuition_type || "home",
      budget_range: payload.budget || "",
      enrollment_status: "enrolled",
      internal_notes: `Auto-imported from Vtiger CRM. ${payload.description || ""}`
    }).select("id").single();

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, student_id: student.id }, { status: 201 });

  } catch (err: any) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
