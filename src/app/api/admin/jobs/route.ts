import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { requireAdminApiSession, adminApiJson } from "@/lib/admin-api-auth";
import { isSameOriginAdminRequest } from "@/lib/admin-auth";
import { createJobSchema } from "@/lib/admin-job-validation";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { EmploymentType, JobState } from "@/lib/supabase/database.types";

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

export async function GET(request: NextRequest) {
  const authError = await requireAdminApiSession();
  if (authError) return authError;

  const pageParam = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const pageSizeParam = Number(
    request.nextUrl.searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE,
  );
  const search = (request.nextUrl.searchParams.get("search") ?? "").trim();
  const stateParam = request.nextUrl.searchParams.get("state") ?? "";
  const employmentTypeParam =
    request.nextUrl.searchParams.get("employmentType") ?? "";
  const validStates: JobState[] = ["draft", "published", "closed"];
  const validEmploymentTypes: EmploymentType[] = [
    "full_time",
    "part_time",
    "contract",
    "internship",
  ];
  if (
    !Number.isSafeInteger(pageParam) ||
    pageParam < 1 ||
    !Number.isSafeInteger(pageSizeParam) ||
    pageSizeParam < 1 ||
    pageSizeParam > MAX_PAGE_SIZE ||
    (pageParam - 1) * pageSizeParam > Number.MAX_SAFE_INTEGER ||
    search.length > 100 ||
    (stateParam !== "" && !validStates.includes(stateParam as JobState)) ||
    (employmentTypeParam !== "" &&
      !validEmploymentTypes.includes(employmentTypeParam as EmploymentType))
  ) {
    return adminApiJson({ error: "Invalid pagination parameters." }, { status: 400 });
  }

  try {
    const supabase = createAdminSupabaseClient();
    const safeSearch = search.replace(/[,%_*()\\]/g, " ").replace(/\s+/g, " ").trim();
    const countResults = await Promise.all(
      validStates.map((state) =>
        supabase
          .from("jobs")
          .select("id", { count: "exact", head: true })
          .eq("state", state),
      ),
    );
    const failedCount = countResults.find((result) => result.error);
    if (failedCount?.error) {
      console.error("Admin job summary query failed:", failedCount.error.code);
      return adminApiJson(
        { error: "Unable to load jobs right now." },
        { status: 503 },
      );
    }

    let jobsQuery = supabase
      .from("jobs")
      .select("*, applications(count)", { count: "exact" })
      .order("created_at", { ascending: false });
    if (stateParam) jobsQuery = jobsQuery.eq("state", stateParam as JobState);
    if (employmentTypeParam) {
      jobsQuery = jobsQuery.eq(
        "employment_type",
        employmentTypeParam as EmploymentType,
      );
    }
    if (safeSearch) {
      jobsQuery = jobsQuery.or(
        `title.ilike.%${safeSearch}%,department.ilike.%${safeSearch}%,location.ilike.%${safeSearch}%`,
      );
    }
    const from = (pageParam - 1) * pageSizeParam;
    const { data, error, count } = await jobsQuery.range(
      from,
      from + pageSizeParam - 1,
    );

    if (error) {
      console.error("Admin jobs list query failed:", error.code);
      return adminApiJson(
        { error: "Unable to load jobs right now." },
        { status: 503 },
      );
    }

    return adminApiJson({
      jobs: (data ?? []).map(({ applications, ...job }) => ({
        ...job,
        applicant_count: applications[0]?.count ?? 0,
      })),
      total: count ?? 0,
      page: pageParam,
      pageSize: pageSizeParam,
      summary: {
        total: countResults.reduce(
          (sum, result) => sum + (result.count ?? 0),
          0,
        ),
        draft: countResults[0].count ?? 0,
        published: countResults[1].count ?? 0,
        closed: countResults[2].count ?? 0,
      },
    });
  } catch (error) {
    console.error(
      "Admin jobs list failed:",
      error instanceof Error ? error.message : "Unknown server error",
    );
    return adminApiJson(
      { error: "Unable to load jobs right now." },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminApiSession();
  if (authError) return authError;
  if (!isSameOriginAdminRequest(request)) {
    return adminApiJson({ error: "Invalid request origin." }, { status: 403 });
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

  const parsed = createJobSchema.safeParse(body);
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
      .insert(parsed.data)
      .select("*")
      .single();

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
      console.error("Admin job creation failed:", error.code);
      return adminApiJson({ error: "Unable to create the job." }, { status: 503 });
    }

    return adminApiJson({ job: data }, { status: 201 });
  } catch (error) {
    console.error(
      "Admin job creation failed:",
      error instanceof Error ? error.message : "Unknown server error",
    );
    return adminApiJson({ error: "Unable to create the job." }, { status: 503 });
  }
}

function formatZodErrors(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}
