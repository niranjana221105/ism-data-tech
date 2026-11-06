import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { requireAdminApiSession, adminApiJson } from "@/lib/admin-api-auth";
import { isSameOriginAdminRequest } from "@/lib/admin-auth";
import { updateJobSchema } from "@/lib/admin-job-validation";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const authError = await requireAdminApiSession();
  if (authError) return authError;
  if (!isSameOriginAdminRequest(request)) {
    return adminApiJson({ error: "Invalid request origin." }, { status: 403 });
  }

  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return adminApiJson({ error: "Invalid job ID." }, { status: 400 });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return adminApiJson(
      { error: "Expected a JSON request." },
      { status: 415 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return adminApiJson({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = updateJobSchema.safeParse(body);
  if (!parsed.success) {
    return adminApiJson(
      { error: "Job fields are invalid.", details: formatZodErrors(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("jobs")
      .update(parsed.data)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      if (error.code === "23505") {
        return adminApiJson(
          { error: "A job with this slug already exists." },
          { status: 409 },
        );
      }
      if (error.code === "23514" || error.code === "23502") {
        return adminApiJson(
          { error: "The job could not be saved because a database constraint failed." },
          { status: 400 },
        );
      }
      console.error("Admin job update failed:", error.code);
      return adminApiJson({ error: "Unable to update the job." }, { status: 503 });
    }

    if (!data) {
      return adminApiJson({ error: "Job not found." }, { status: 404 });
    }

    return adminApiJson({ job: data });
  } catch (error) {
    console.error(
      "Admin job update failed:",
      error instanceof Error ? error.message : "Unknown server error",
    );
    return adminApiJson({ error: "Unable to update the job." }, { status: 503 });
  }
}

function formatZodErrors(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}
