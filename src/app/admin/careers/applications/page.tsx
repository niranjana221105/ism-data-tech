import type { Metadata } from "next";
import ApplicationManagement from "@/components/admin/ApplicationManagement";

export const metadata: Metadata = {
  title: "Applications – Careers Admin",
  robots: { index: false, follow: false },
};

export default function AdminApplicationsPage() {
  return <ApplicationManagement />;
}
