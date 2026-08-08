'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from '@/store/hooks';
import { useLogoutUserMutation } from '@/features/auth/authApi';
import { logout } from '@/features/auth/authSlice';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { Spinner } from '@/components/ui/Spinner';
import {
  LogOut,
  User,
  Bell,
  Lock,
  ChevronRight,
  AlertTriangle,
  Shield,
  Ticket,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Small reusable primitives
// ---------------------------------------------------------------------------

/** A section card wrapper */
function SettingsCard({ title, description, children, className }) {
  return (
    <div className={cn('glass rounded-2xl overflow-hidden', className)}>
      {(title || description) && (
        <div className="px-5 pt-5 pb-4 border-b border-white/[0.06]">
          {title && (
            <h2 className="text-base font-semibold text-on-surface">{title}</h2>
          )}
          {description && (
            <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>
          )}
        </div>
      )}
      <div className="p-2">{children}</div>
    </div>
  );
}

/** A tappable row inside a SettingsCard */
function SettingsRow({ icon: Icon, label, description, href, onClick, destructive, trailing }) {
  const baseClass = cn(
    'group flex w-full items-center gap-4 rounded-xl px-3 py-3',
    'text-left transition-colors duration-150',
    destructive
      ? 'hover:bg-crimson-dark/10'
      : 'hover:bg-white/5',
  );

  const iconClass = cn(
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-150',
    destructive ? 'bg-crimson-dark/10 group-hover:bg-crimson-dark/20' : 'bg-white/5 group-hover:bg-white/8',
  );

  const labelClass = cn(
    'text-sm font-medium transition-colors duration-150',
    destructive ? 'text-crimson-dark' : 'text-on-surface',
  );

  const inner = (
    <>
      <span className={iconClass}>
        <Icon
          size={16}
          className={cn(
            'transition-colors duration-150',
            destructive
              ? 'text-crimson-dark'
              : 'text-on-surface-variant group-hover:text-on-surface',
          )}
        />
      </span>
      <div className="min-w-0 flex-1">
        <p className={labelClass}>{label}</p>
        {description && (
          <p className="text-xs text-on-surface-variant mt-0.5 leading-snug">
            {description}
          </p>
        )}
      </div>
      {trailing ?? (
        !onClick && href && (
          <ChevronRight size={15} className="shrink-0 text-on-surface-variant/50" />
        )
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClass}>
      {inner}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Sign-out section
// ---------------------------------------------------------------------------

function SignOutSection({ user }) {
  const dispatch  = useDispatch();
  const router    = useRouter();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  const [error, setError]           = useState(null);
  const [confirming, setConfirming] = useState(false);

  const handleSignOut = async () => {
    if (!confirming) {
      // First click: ask for confirmation
      setConfirming(true);
      return;
    }

    setError(null);
    try {
      // 1. Tell the server to invalidate the session / refresh token
      await logoutUser().unwrap();
    } catch {
      // Server-side logout failed (expired token, network, etc.).
      // We still clear local state so the user is not stuck.
    } finally {
      // 2. Always wipe local Redux state + localStorage
      dispatch(logout());
      // 3. Redirect to home
      router.replace('/');
    }
  };

  const cancelConfirm = () => setConfirming(false);

  return (
    <SettingsCard
      title="Session"
      description="Sign out from your current session on this device."
    >
      {/* Identity preview */}
      <div className="flex items-center gap-3 px-3 py-3 mb-1">
        <UserAvatar user={user} size="md" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-on-surface truncate">
            {user?.firstName
              ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
              : (user?.username ?? 'My Account')}
          </p>
          <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
        </div>
        <span className="text-xs text-on-surface-variant/50 shrink-0">
          Active
        </span>
      </div>

      {/* Error */}
      {error && (
        <p className="mx-3 mb-2 rounded-lg bg-crimson-dark/10 px-3 py-2 text-xs text-crimson-dark">
          {error}
        </p>
      )}

      {/* Confirm state */}
      {confirming ? (
        <div className="mx-1 mb-1 rounded-xl border border-crimson-dark/20 bg-crimson-dark/5 p-4">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle size={16} className="shrink-0 mt-0.5 text-crimson-dark" />
            <p className="text-sm text-on-surface">
              Are you sure you want to sign out? You&apos;ll need to log in again to
              access your account.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={cancelConfirm}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-crimson-dark/90 py-2 text-sm font-medium text-white transition-colors hover:bg-crimson-dark disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Spinner size={14} />
                  Signing out…
                </>
              ) : (
                <>
                  <LogOut size={14} />
                  Yes, sign out
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <SettingsRow
          icon={LogOut}
          label="Sign Out"
          description="End your session on this device"
          onClick={handleSignOut}
          destructive
        />
      )}
    </SettingsCard>
  );
}

// ---------------------------------------------------------------------------
// Settings content
// ---------------------------------------------------------------------------

function SettingsContent() {
  const user = useSelector((s) => s.auth.user);

  return (
    <section className="mx-auto max-w-2xl px-4 pb-24 pt-28 sm:px-6">

      {/* ── Page header ── */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">
          Account
        </p>
        <h1 className="font-display text-3xl sm:text-4xl">Settings</h1>
      </div>

      <div className="flex flex-col gap-4">

        {/* ── Account section ── */}
        <SettingsCard
          title="Account"
          description="Manage your personal information."
        >
          <SettingsRow
            icon={User}
            label="Profile"
            description="View your name, email, and role"
            href="/profile"
          />
          <SettingsRow
            icon={Ticket}
            label="My Bookings"
            description="See your full ticket history"
            href="/bookings"
          />
        </SettingsCard>

        {/* ── Security section ── */}
        <SettingsCard
          title="Security"
          description="Password and access control."
        >
          <SettingsRow
            icon={Lock}
            label="Change Password"
            description="Update your login credentials"
            href="/change-password"
          />
        </SettingsCard>

        {/* ── Notifications section ── */}
        <SettingsCard
          title="Notifications"
          description="Control how CineVerse reaches you."
        >
          <SettingsRow
            icon={Bell}
            label="Email Notifications"
            description="Booking confirmations and updates"
            href="/settings/notifications"
          />
        </SettingsCard>

        {/* ── Sign out ── */}
        <SignOutSection user={user} />

      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page export
// ---------------------------------------------------------------------------
export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
