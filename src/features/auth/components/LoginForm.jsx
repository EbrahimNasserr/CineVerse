'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { loginSchema } from '@/lib/validators/authSchema';
import { useLoginMutation } from '@/features/auth/authApi';
import { useDispatch } from '@/store/hooks';
import { setCredentials } from '@/features/auth/authSlice';

export function LoginForm() {
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    try {
      const result = await login(values).unwrap();
      dispatch(setCredentials(result));
    } catch {
      // handled by RTK Query error state below
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-sm">
      <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
      <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
      {error && <p className="text-body-sm text-error">Invalid email or password.</p>}
      <Button type="submit" variant="primary" disabled={isLoading}>
        Sign In
      </Button>
    </form>
  );
}
