import { NextRequest, NextResponse } from "next/server";
import { createAdminAuthClient } from "@/utils/supabase/admin";
import { createAdminClient } from "@/utils/supabase/server";

// Admin sets or resets a teacher/parent password directly
export async function POST(req: NextRequest) {
  try {
    const { targetEmail, targetAuthUserId, newPassword, targetType, targetId } = await req.json();

    const email = (targetEmail || "").trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Email is required to set credentials." }, { status: 400 });
    }
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

      const authAdmin = createAdminAuthClient();
      const dbAdmin = await createAdminClient();

      let resolvedAuthUserId = targetAuthUserId || null;
      let actionType = "updated";

      // 1. Check if user exists by email in Supabase Auth
      try {
        const { data: usersList } = await authAdmin.auth.admin.listUsers({ perPage: 1000 });
        const existingUser = usersList?.users?.find(u => u.email?.toLowerCase() === email);
        if (existingUser) {
          resolvedAuthUserId = existingUser.id;
        }
      } catch (listErr) {
        console.warn("[set-password] listUsers notice:", listErr);
      }

          if(resolvedAuthUserId) {
            // 2. User exists in Auth -> update their password & auto-confirm email
            const { error: updateErr } = await authAdmin.auth.admin.updateUserById(
              resolvedAuthUserId,
              {
                password: newPassword,
                email_confirm: true,
                user_metadata: { role: targetType }
              }
            );

            if (updateErr) {
              console.error("[set-password] updateUserById error:", updateErr);
              return NextResponse.json({ error: updateErr.message }, { status: 400 });
            }
            actionType = "updated";
          } else {
            // 3. User does not exist in Auth -> create brand new user
            const { data: created, error: createErr } = await authAdmin.auth.admin.createUser({
              email,
              password: newPassword,
              email_confirm: true,
              user_metadata: { role: targetType }
            });

        if (createErr) {
          // If already registered, find them and update
          if (createErr.message?.toLowerCase().includes("already registered") || createErr.status === 422) {
            try {
              const { data: usersList } = await authAdmin.auth.admin.listUsers();
              const existing = usersList?.users?.find(u => u.email?.toLowerCase() === email);
              if (existing) {
                await authAdmin.auth.admin.updateUserById(existing.id, {
                  password: newPassword,
                  email_confirm: true
                });
                resolvedAuthUserId = existing.id;
              } else {
                return NextResponse.json({ error: createErr.message }, { status: 400 });
              }
            } catch {
              return NextResponse.json({ error: createErr.message }, { status: 400 });
            }
          } else {
            return NextResponse.json({ error: createErr.message }, { status: 400 });
          }
        } else if (created?.user) {
          resolvedAuthUserId = created.user.id;
          actionType = "created";
        }
      }

      // 4. Link auth_user_id and confirmed email in the database record
      if (resolvedAuthUserId && targetId) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);
        if (targetType === "teacher") {
          let updateQuery = dbAdmin
            .from("teachers")
            .update({
              auth_user_id: resolvedAuthUserId,
              email: email.trim().toLowerCase(),
              is_active: true, // auto-activate teacher once credentials are set
            });
          if (isUuid) {
            updateQuery = updateQuery.eq("id", targetId);
          } else {
            updateQuery = updateQuery.or(`id.eq.${targetId},teacher_id.eq.${targetId.toUpperCase()}`);
          }
          await updateQuery;
        } else if (targetType === "parent") {
          let updateQuery = dbAdmin
            .from("students")
            .update({
              parent_auth_user_id: resolvedAuthUserId,
              parent_email: email.trim().toLowerCase(),
            });
          if (isUuid) {
            updateQuery = updateQuery.eq("id", targetId);
          } else {
            updateQuery = updateQuery.or(`id.eq.${targetId},student_id.eq.${targetId.toUpperCase()}`);
          }
          await updateQuery;
        }
      }

      return NextResponse.json({
        success: true,
        action: actionType,
        authUserId: resolvedAuthUserId,
        email,
      });
    } catch (e: any) {
      console.error("[set-password] Exception:", e);
      return NextResponse.json({ error: e.message || "Failed to set password" }, { status: 500 });
    }
  }
