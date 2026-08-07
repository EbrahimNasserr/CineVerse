'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
  const router   = useRouter();
  const [registerUser, { isLoading, error }] = useRegisterMutation();
  const [showPassword, setShowPassword]           = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values) => {
    try {
      // Strip confirmPassword — not needed by the API
      const { confirmPassword: _, ...payload } = values;
      const result = await registerUser(payload).unwrap();
      dispatch(setCredentials(result.data));
      router.replace('/');
    } catch {
      // handled by RTK Query error state below
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-sm">
      <div className="grid grid-cols-2 gap-sm">
        <Input
          label="First Name"
          {...register('firstName')}
          error={errors.firstName?.message}
        />
        <Input
          label="Last Name"
          {...register('lastName')}
          error={errors.lastName?.message}
        />
      </div>

      <Input
        label="Username"
        {...register('username')}
        error={errors.username?.message}
      />

      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          {...register('password')}
          error={errors.password?.message}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={-1}
          className="absolute right-3 top-[38px] text-on-surface-variant transition-colors hover:text-on-surface"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword((v) => !v)}
          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          tabIndex={-1}
          className="absolute right-3 top-[38px] text-on-surface-variant transition-colors hover:text-on-surface"
        >
          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {error && (
        <p className="text-body-sm text-error">
          {error?.data?.message ?? 'Something went wrong. Please try again.'}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Creating account…
          </span>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  );
}
