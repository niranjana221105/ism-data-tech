import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminApiSession, adminApiJson } from "@/lib/admin-api-auth";
import { isSameOriginAdminRequest } from "@/lib/admin-auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const paramsSchema = z.object({
  id: z.string().uuid(),
});
const bodySchema = z.object({
  status: z.enum([
    "new",
    "under_review",
    "shortlisted",
    "interview_scheduled",
    "selected",
    "rejected",
  ]),
}).strict();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdminApiSession();
  if (authError) return authError;
  if (!isSameOriginAdminRequest(request)) {
    return adminApiJson({ error: "Invalid request origin." }, { status: 403 });
  }

  const parsedParams = paramsSchema.safeParse(await params);
  if (!parsedParams.success) {
    return adminApiJson({ error: "Invalid application ID." }, { status: 400 });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return adminApiJson({ error: "Expected a JSON request." }, { status: 415 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return adminApiJson({ error: "Invalid request body." }, { status: 400 });
  }
  const parsedBody = bodySchema.safeParse(body);
  if (!parsedBody.success) {
    return adminApiJson({ error: "Invalid application status." }, { status: 400 });
  }

  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("applications")
      .update({ status: parsedBody.data.status })
      .eq("id", parsedParams.data.id)
      .select("id, status, updated_at")
      .maybeSingle();

    if (error) {
      console.error("Admin application update failed:", error.code);
      return adminApiJson({ error: "Unable to update application status." }, { status: 503 });
    }
    if (!data) return adminApiJson({ error: "Application not found." }, { status: 404 });
    return adminApiJson({ application: data });
  } catch (error) {
    console.error(
      "Admin application update failed:",
      error instanceof Error ? error.message : "Unknown server error",
    );
    return adminApiJson({ error: "Unable to update application status." }, { status: 503 });
  }
}
