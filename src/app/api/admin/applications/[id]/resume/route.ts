import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApiSession } from "@/lib/admin-api-auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const paramsSchema = z.object({ id: z.string().uuid() });
const ALLOWED_CONTENT_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdminApiSession();
  if (authError) return authError;

  const parsedParams = paramsSchema.safeParse(await params);
  if (!parsedParams.success) {
    return NextResponse.json({ error: "Invalid application ID." }, { status: 400 });
  }

  try {
    const supabase = createAdminSupabaseClient();
    const { data: application, error: applicationError } = await supabase
      .from("applications")
      .select("resume_storage_key, resume_original_name, resume_content_type")
      .eq("id", parsedParams.data.id)
      .maybeSingle();

    if (applicationError) {
      console.error("Resume metadata lookup failed:", applicationError.code);
      return NextResponse.json({ error: "Unable to retrieve resume." }, { status: 503 });
    }
    if (!application) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }
    if (!ALLOWED_CONTENT_TYPES.has(application.resume_content_type)) {
      console.error("Resume has an unsupported stored content type.");
      return NextResponse.json({ error: "Resume cannot be downloaded." }, { status: 415 });
    }

    const { data: file, error: downloadError } = await supabase.storage
      .from("career-resumes")
      .download(application.resume_storage_key);
    if (downloadError || !file) {
      console.error("Resume download failed:", downloadError?.message ?? "No file returned");
      return NextResponse.json({ error: "Unable to retrieve resume." }, { status: 503 });
    }

    const safeName = application.resume_original_name
      .replace(/[\r\n"\\/]/g, "_")
      .slice(0, 180) || "resume";
    return new NextResponse(file, {
      headers: {
        "Content-Type": application.resume_content_type,
        "Content-Disposition": `attachment; filename="${safeName}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error(
      "Resume download failed:",
      error instanceof Error ? error.message : "Unknown server error",
    );
    return NextResponse.json({ error: "Unable to retrieve resume." }, { status: 503 });
  }
}
