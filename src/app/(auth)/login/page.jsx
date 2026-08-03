import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-md py-28">
      <h1 className="text-headline-md">Sign In</h1>
      <LoginForm />
    </div>
  );
}
