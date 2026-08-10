'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from '@/store/hooks';
import { Sidebar } from '@/components/layout/Sidebar';
import { Spinner } from '@/components/ui/Spinner';

/**
 * Admin layout — guards every route under /admin.
 *
 * Rules:
 *  - Unauthenticated users  → redirect to /login
 *  - Authenticated non-admin → redirect to / (home)
 *  - Admin users             → render the dashboard shell
 *
 * Token + user are hydrated synchronously from localStorage inside authSlice,
 * so there is no async flash — the check happens on the first render.
 */
export default function AdminLayout({ children }) {
  const router = useRouter();
  const token  = useSelector((state) => state.auth.token);
  const user   = useSelector((state) => state.auth.user);

  const isAuthenticated = Boolean(token);
  const isAdmin         = user?.role === 'admin';

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (!isAdmin) {
      router.replace('/');
    }
  }, [isAuthenticated, isAdmin, router]);

  // Show a centered spinner while the redirect is in flight
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size={36} />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[60vh] gap-md pt-14 md:pt-20">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden py-md">{children}</div>
    </div>
  );
}
