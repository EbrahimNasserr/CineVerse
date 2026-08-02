import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-md py-xl">
      <h1 className="text-headline-md">Create Account</h1>
      <RegisterForm />
    </div>
  );
}
