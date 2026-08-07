'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from '@/store/hooks';
import { useGetCurrentUserQuery } from '@/features/auth/authApi';
import { setCredentials } from '@/features/auth/authSlice';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { Spinner } from '@/components/ui/Spinner';
import {
  User,
  Mail,
  AtSign,
  Shield,
  Ticket,
  Settings,
  Calendar,
  BadgeCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function InfoRow({ icon: Icon, label, value, mono = false }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-white/[0.06] last:border-0">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
        <Icon size={15} className="text-on-surface-variant" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-on-surface-variant mb-0.5">{label}</p>
        <p
          className={cn(
            'text-sm text-on-surface break-all',
            mono && 'font-mono tracking-wide',
          )}
        >
          {value ?? <span className="text-on-surface-variant/50 italic">Not set</span>}
        </p>
      </div>
    </div>
  );
}

function RoleBadge({ role }) {
  const isAdmin = role?.toUpperCase() === 'ADMIN';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider',
        isAdmin
          ? 'bg-gold/15 text-gold'
          : 'bg-primary-container/15 text-primary-container',
      )}
    >
      {isAdmin ? <Shield size={11} /> : <BadgeCheck size={11} />}
      {role ?? 'User'}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Quick-action card
// ---------------------------------------------------------------------------
function QuickAction({ href, icon: Icon, label, description }) {
  return (
    <Link
      href={href}
      className="group glass flex items-center gap-4 rounded-2xl p-4 transition-colors duration-200 hover:bg-white/5"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 transition-colors duration-200 group-hover:bg-primary-container/20">
        <Icon size={18} className="text-on-surface-variant transition-colors duration-200 group-hover:text-primary-container" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-on-surface">{label}</p>
        <p className="text-xs text-on-surface-variant">{description}</p>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Profile content (inside ProtectedRoute)
// ---------------------------------------------------------------------------
function ProfileContent() {
  const dispatch = useDispatch();
  const localUser = useSelector((s) => s.auth.user);
  const token     = useSelector((s) => s.auth.token);

  const { data: freshUser, isLoading, isError } = useGetCurrentUserQuery(
    undefined,
    { skip: !token },
  );

  // Sync fresh server data back into Redux + localStorage
  useEffect(() => {
    if (!freshUser) return;
    // Preserve tokens already in state; only update the user fields
    dispatch(
      setCredentials({
        ...freshUser,
        accessToken:  token,
        refreshToken: localUser?.refreshToken ?? null,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freshUser]);

  // Prefer live server data; fall back to cached Redux user while loading
  const user = freshUser ?? localUser;

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : (user?.username ?? 'My Account');

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <section className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6">

      {/* ── Page header ── */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">
          Account
        </p>
        <h1 className="font-display text-3xl sm:text-4xl">Profile</h1>
      </div>

      {/* ── Identity hero card ── */}
      <div className="glass rounded-3xl p-6 sm:p-8 mb-6">
        {isLoading && !user ? (
          <div className="flex items-center justify-center py-10">
            <Spinner size={32} />
          </div>
        ) : isError && !user ? (
          <p className="text-sm text-error text-center py-10">
            Failed to load profile. Please refresh.
          </p>
        ) : (
          <>
            {/* Avatar + name row */}
            <div className="flex flex-col items-center gap-4 pb-6 border-b border-white/[0.08] sm:flex-row sm:items-start">
              <div className="relative">
                <UserAvatar user={user} size="lg" className="!h-20 !w-20 !text-2xl" />
                {isLoading && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-obsidian/50">
                    <Spinner size={20} />
                  </span>
                )}
              </div>

              <div className="flex flex-col items-center gap-2 sm:items-start">
                <h2 className="font-display text-2xl text-on-surface">
                  {displayName}
                </h2>
                {user?.email && (
                  <p className="text-sm text-on-surface-variant">{user.email}</p>
                )}
                <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                  <RoleBadge role={user?.role} />
                  {joinedDate && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant">
                      <Calendar size={11} />
                      Joined {joinedDate}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Info rows */}
            <div className="mt-2">
              <InfoRow icon={User}   label="Full Name"  value={displayName} />
              <InfoRow icon={Mail}   label="Email"      value={user?.email} />
              <InfoRow icon={AtSign} label="Username"   value={user?.username} mono />
              <InfoRow icon={Shield} label="Role"       value={user?.role} />
            </div>
          </>
        )}
      </div>

      {/* ── Quick actions ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <QuickAction
          href="/bookings"
          icon={Ticket}
          label="My Bookings"
          description="View your full ticket history"
        />
        <QuickAction
          href="/settings"
          icon={Settings}
          label="Settings"
          description="Manage preferences & security"
        />
      </div>

    </section>
  );
}

// ---------------------------------------------------------------------------
// Page export
// ---------------------------------------------------------------------------
export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
