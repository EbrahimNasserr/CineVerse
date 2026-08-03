import { Sidebar } from "@/components/layout/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="relative flex min-h-[60vh] gap-md pt-14 md:pt-0">
      <Sidebar />
      <div className="flex-1 py-md">{children}</div>
    </div>
  );
}
