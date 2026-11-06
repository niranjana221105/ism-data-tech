import type { Metadata } from "next";
import JobManagement from "@/components/admin/JobManagement";

export const metadata: Metadata = {
  title: "Job Openings – Careers Admin",
  robots: { index: false, follow: false },
};

export default function AdminJobsPage() {
  return <JobManagement />;
}
