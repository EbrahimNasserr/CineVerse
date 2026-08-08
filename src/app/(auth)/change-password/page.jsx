import { ChangePasswordForm } from '@/features/auth/components/ChangePasswordForm';

export const metadata = {
  title: 'Change Password',
};

export default function ChangePasswordPage() {
  return (
    <div className="mx-auto flex max-w-7xl px-6 sm:max-w-sm sm:px-0 flex-col gap-md py-28">
      <div className="flex flex-col gap-1">
        <h1 className="text-headline-md">Change Password</h1>
        <p className="text-body-sm text-on-surface-variant">
          Verify your identity with a one-time code, then set a new password.
        </p>
      </div>
      <ChangePasswordForm />
    </div>
  );
}
