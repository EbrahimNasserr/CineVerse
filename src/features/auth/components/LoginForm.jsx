'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
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

      <div className="flex items-center justify-between text-body-sm">
        <label className="flex select-none items-center gap-2 text-on-surface-variant">
          <input
            type="checkbox"
            {...register('rememberMe')}
            className="h-3.5 w-3.5 rounded border-white/20 bg-transparent accent-primary"
          />
          Remember me
        </label>
        <Link href="/forgot-password" className="text-on-surface-variant hover:text-on-surface hover:underline">
          Forgot password?
        </Link>
      </div>

      {error && <p className="text-body-sm text-error">Invalid email or password.</p>}

      <Button type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Signing in…
          </span>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  );
}