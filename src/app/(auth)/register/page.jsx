import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-sm px-4 sm:px-0 flex-col gap-md h-screen flex justify-center">
      <h1 className="text-headline-md">Create Account</h1>
      <RegisterForm />
    </div>
  );
}
