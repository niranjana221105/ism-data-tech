import { requireAdminApiSession, adminApiJson } from "@/lib/admin-api-auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET() {
  const authError = await requireAdminApiSession();
  if (authError) return authError;

  try {
    const supabase = createAdminSupabaseClient();
    const [
      totalJobs,
      publishedJobs,
      closedJobs,
      totalApplications,
      newApplications,
      shortlistedApplications,
      recentJobsResult,
      recentApplicationsResult,
    ] = await Promise.all([
      supabase.from("jobs").select("id", { count: "exact", head: true }),
      supabase.from("jobs").select("id", { count: "exact", head: true }).eq("state", "published"),
      supabase.from("jobs").select("id", { count: "exact", head: true }).eq("state", "closed"),
      supabase.from("applications").select("id", { count: "exact", head: true }),
      supabase.from("applications").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("applications").select("id", { count: "exact", head: true }).eq("status", "shortlisted"),
      supabase
        .from("jobs")
        .select("id, title, department, location, state, created_at, applications(count)")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("applications")
        .select("id, full_name, email, job_title_snapshot, status, submitted_at")
        .order("submitted_at", { ascending: false })
        .limit(5),
    ]);

    const failure = [
      totalJobs,
      publishedJobs,
      closedJobs,
      totalApplications,
      newApplications,
      shortlistedApplications,
      recentJobsResult,
      recentApplicationsResult,
    ].find((result) => result.error);
    if (failure?.error) {
      console.error("Admin overview query failed:", failure.error.code);
      return adminApiJson({ error: "Unable to load dashboard overview." }, { status: 503 });
    }

    return adminApiJson({
      counts: {
        totalJobs: totalJobs.count ?? 0,
        publishedJobs: publishedJobs.count ?? 0,
        closedJobs: closedJobs.count ?? 0,
        totalApplications: totalApplications.count ?? 0,
        newApplications: newApplications.count ?? 0,
        shortlistedApplications: shortlistedApplications.count ?? 0,
      },
      recentJobs: (recentJobsResult.data ?? []).map(({ applications, ...job }) => ({
        ...job,
        applicantCount: applications[0]?.count ?? 0,
      })),
      recentApplications: recentApplicationsResult.data ?? [],
    });
  } catch (error) {
    console.error(
      "Admin overview failed:",
      error instanceof Error ? error.message : "Unknown server error",
    );
    return adminApiJson({ error: "Unable to load dashboard overview." }, { status: 503 });
  }
}
