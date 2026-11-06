import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    const validStatuses = ["completed", "cancelled", "voided", "absent", "logged"];
    if (status && !validStatuses.includes(status.toLowerCase())) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const adminDb = await createAdminClient();

    const updateData: Record<string, any> = {};
    if (status) updateData.status = status.toLowerCase();
    if (notes !== undefined) updateData.notes = notes;

    const { data, error } = await adminDb
      .from("sessions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[sessions PATCH error]:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Revalidate dependent views
    revalidatePath("/admin/sessions");
    revalidatePath("/portal/sessions");
    revalidatePath("/teacher/dashboard/sessions");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({
      success: true,
      message: `Session status updated to ${status}.`,
      session: data,
    });
  } catch (err: any) {
    console.error("[sessions PATCH exception]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update session" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryId = searchParams.get("id");

    let id = queryId;
    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: "Session ID is required for deletion" }, { status: 400 });
    }

    const adminDb = await createAdminClient();
    const { error } = await adminDb.from("sessions").delete().eq("id", id);

    if (error) {
      console.error("[sessions DELETE error]:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Revalidate dependent views
    revalidatePath("/admin/sessions");
    revalidatePath("/portal/sessions");
    revalidatePath("/teacher/dashboard/sessions");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({
      success: true,
      message: "Session log successfully deleted.",
    });
  } catch (err: any) {
    console.error("[sessions DELETE exception]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete session log" },
      { status: 500 }
    );
  }
}
