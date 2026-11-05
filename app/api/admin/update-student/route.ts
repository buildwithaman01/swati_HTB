import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, type } = body;

    if (!id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    const adminDb = await createAdminClient();

    if (type === "status") {
      const { status, notes } = body;
      const { data, error } = await adminDb
        .from("students")
        .update({
          enrollment_status: status,
          internal_notes: notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("[update-student status error]:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      revalidatePath(`/admin/students/${id}`);
      revalidatePath("/admin/students");
      revalidatePath("/admin/dashboard");

      return NextResponse.json({ success: true, student: data });
    } else if (type === "profile") {
      const {
        full_name,
        parent_name,
        parent_phone,
        whatsapp,
        email,
        locality,
        address,
        class_studying,
        board,
        subjects_required,
        tuition_type_preference,
        budget_range,
      } = body;

      const subjectsArr = Array.isArray(subjects_required)
        ? subjects_required
        : (subjects_required || "")
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);

      const { data, error } = await adminDb
        .from("students")
        .update({
          full_name,
          parent_name,
          parent_phone,
          whatsapp: whatsapp || null,
          email: email || null,
          parent_email: email || null,
          locality: locality || null,
          address: address || null,
          class_studying: class_studying || null,
          board: board || "CBSE",
          subjects_required: subjectsArr,
          subjects_needed: subjectsArr,
          tuition_type_preference: tuition_type_preference || "home",
          budget_range: budget_range || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("[update-student profile error]:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      revalidatePath(`/admin/students/${id}`);
      revalidatePath("/admin/students");

      return NextResponse.json({ success: true, student: data });
    }

    return NextResponse.json({ error: "Invalid update type" }, { status: 400 });
  } catch (err: any) {
    console.error("[update-student exception]:", err);
    return NextResponse.json({ error: err.message || "Failed to update student" }, { status: 500 });
  }
}
