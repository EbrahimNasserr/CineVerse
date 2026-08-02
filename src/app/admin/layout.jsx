import { Sidebar } from '@/components/layout/Sidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-[60vh] gap-md">
      <Sidebar />
      <div className="flex-1 py-md">{children}</div>
    </div>
  );
}
