'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { registerSchema } from '@/lib/validators/authSchema';
import { useRegisterMutation } from '@/features/auth/authApi';
import { useDispatch } from '@/store/hooks';
import { setCredentials } from '@/features/auth/authSlice';

export function RegisterForm() {
  const dispatch = useDispatch();
  const [registerUser, { isLoading, error }] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values) => {
    try {
      const result = await registerUser(values).unwrap();
      dispatch(setCredentials(result));
    } catch {
      // handled by RTK Query error state below
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-sm">
      <Input label="Name" {...register('name')} error={errors.name?.message} />
      <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
      <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
      <Input
        label="Confirm Password"
        type="password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />
      {error && <p className="text-body-sm text-error">Something went wrong. Please try again.</p>}
      <Button type="submit" variant="primary" disabled={isLoading}>
        Create Account
      </Button>
    </form>
  );
}
