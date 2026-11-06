import type { Metadata } from "next";
import AdminOverview from "@/components/admin/AdminOverview";

export const metadata: Metadata = {
  title: "Admin Dashboard – Careers",
  description: "Overview of careers jobs and applications.",
  robots: { index: false, follow: false },
};

export default function AdminCareersPage() {
  return <AdminOverview />;
}
