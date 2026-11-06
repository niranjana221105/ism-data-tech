import { NextRequest } from "next/server";
import { requireAdminApiSession, adminApiJson } from "@/lib/admin-api-auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { ApplicationStatus } from "@/lib/supabase/database.types";

const PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;
const STATUSES: ApplicationStatus[] = [
  "new",
  "under_review",
  "shortlisted",
  "interview_scheduled",
  "selected",
  "rejected",
];

export async function GET(request: NextRequest) {
  const authError = await requireAdminApiSession();
  if (authError) return authError;

  const params = request.nextUrl.searchParams;
  const page = Number(params.get("page") ?? "1");
  const pageSize = Number(params.get("pageSize") ?? PAGE_SIZE);
  const search = (params.get("search") ?? "").trim();
  const status = params.get("status") ?? "";
  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    !Number.isSafeInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > MAX_PAGE_SIZE ||
    (page - 1) * pageSize > Number.MAX_SAFE_INTEGER ||
    search.length > 100 ||
    (status !== "" && !STATUSES.includes(status as ApplicationStatus))
  ) {
    return adminApiJson({ error: "Invalid application filters." }, { status: 400 });
  }

  try {
    const supabase = createAdminSupabaseClient();
    let query = supabase
      .from("applications")
      .select(
        "id, job_id, job_title_snapshot, full_name, email, phone, location, experience, education, skills, linkedin_url, portfolio_url, cover_letter, status, resume_original_name, resume_content_type, resume_size_bytes, submitted_at, updated_at",
        { count: "exact" },
      )
      .order("submitted_at", { ascending: false });

    if (status) query = query.eq("status", status as ApplicationStatus);
    const safeSearch = search.replace(/[,%_*()\\]/g, " ").replace(/\s+/g, " ").trim();
    if (safeSearch) {
      query = query.or(
        `full_name.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%,job_title_snapshot.ilike.%${safeSearch}%,location.ilike.%${safeSearch}%`,
      );
    }

    const from = (page - 1) * pageSize;
    const { data, error, count } = await query.range(from, from + pageSize - 1);
    if (error) {
      console.error("Admin applications query failed:", error.code);
      return adminApiJson({ error: "Unable to load applications." }, { status: 503 });
    }

    return adminApiJson({
      applications: data ?? [],
      total: count ?? 0,
      page,
      pageSize,
    });
  } catch (error) {
    console.error(
      "Admin applications query failed:",
      error instanceof Error ? error.message : "Unknown server error",
    );
    return adminApiJson({ error: "Unable to load applications." }, { status: 503 });
  }
}
