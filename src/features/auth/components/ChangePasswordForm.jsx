'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Mail, KeyRound, ShieldCheck, ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { requestOtpSchema, changePasswordSchema } from '@/lib/validators/authSchema';
import { useRequestPasswordOtpMutation, useChangePasswordMutation } from '@/features/auth/authApi';

// ─── OTP digit input ─────────────────────────────────────────────────────────
function OtpInput({ value, onChange, error }) {
  const digits = 6;
  const refs = useRef([]);

  const chars = value.split('').concat(Array(digits).fill('')).slice(0, digits);

  const handleKey = (e, idx) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = chars.map((c, i) => (i === idx ? '' : c));
      onChange(next.join(''));
      if (idx > 0 && chars[idx] === '') refs.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      refs.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < digits - 1) {
      refs.current[idx + 1]?.focus();
    }
  };

  const handleChange = (e, idx) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) return;
    // allow pasting full OTP into first box
    if (raw.length > 1) {
      const pasted = raw.slice(0, digits).split('');
      const next = chars.map((c, i) => pasted[i] ?? c);
      onChange(next.join(''));
      refs.current[Math.min(raw.length, digits) - 1]?.focus();
      return;
    }
    const next = chars.map((c, i) => (i === idx ? raw : c));
    onChange(next.join(''));
    if (idx < digits - 1) refs.current[idx + 1]?.focus();
  };

  const handleFocus = (e) => e.target.select();

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-label-caps text-on-surface-variant">One-time code</span>
      <div className="flex gap-2 justify-between">
        {chars.map((char, idx) => (
          <input
            key={idx}
            ref={(el) => (refs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={char}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKey(e, idx)}
            onFocus={handleFocus}
            aria-label={`Digit ${idx + 1}`}
            className={[
              'h-12 w-full rounded border bg-surface-container text-center text-body-md font-bold text-on-surface outline-none transition-all duration-200',
              'placeholder:text-on-surface-variant/30 focus:border-crimson focus:ring-1 focus:ring-crimson/30',
              char ? 'border-crimson/60' : 'border-white/[0.08]',
              error ? 'border-error' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        ))}
      </div>
      {error && <span className="text-body-sm text-error">{error}</span>}
    </div>
  );
}

// ─── Password strength indicator ─────────────────────────────────────────────
function PasswordStrength({ password }) {
  const rules = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
    { label: 'Special character', ok: /[^A-Za-z0-9]/.test(password) },
  ];

  const passedCount = rules.filter((r) => r.ok).length;
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][passedCount];
  const strengthColor = ['', 'bg-error', 'bg-amber-400', 'bg-yellow-300', 'bg-emerald-400'][passedCount];

  if (!password) return null;

  return (
    <div className="flex flex-col gap-2 rounded border border-white/[0.06] bg-surface-container/60 p-3">
      {/* bar */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                n <= passedCount ? strengthColor : 'bg-white/[0.08]'
              }`}
            />
          ))}
        </div>
        <span className={`text-label-caps ${passedCount >= 3 ? 'text-emerald-400' : 'text-on-surface-variant'}`}>
          {strengthLabel}
        </span>
      </div>
      {/* rules */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {rules.map((rule) => (
          <span
            key={rule.label}
            className={`flex items-center gap-1.5 text-body-sm transition-colors duration-200 ${
              rule.ok ? 'text-emerald-400' : 'text-on-surface-variant/60'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${rule.ok ? 'bg-emerald-400' : 'bg-white/20'}`} />
            {rule.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepDots({ step }) {
  const steps = [
    { icon: Mail, label: 'Email' },
    { icon: KeyRound, label: 'Verify' },
    { icon: ShieldCheck, label: 'Done' },
  ];

  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map(({ icon: Icon, label }, idx) => {
        const state = idx < step ? 'done' : idx === step ? 'active' : 'idle';
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  'flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300',
                  state === 'done'
                    ? 'border-crimson/40 bg-crimson/20 text-crimson'
                    : state === 'active'
                    ? 'border-crimson bg-crimson/10 text-crimson shadow-[0_0_12px_rgba(230,57,70,0.35)]'
                    : 'border-white/[0.08] bg-white/[0.03] text-on-surface-variant/40',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {state === 'done' ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <Icon size={16} />
                )}
              </div>
              <span
                className={`text-label-caps transition-colors duration-300 ${
                  state === 'active' ? 'text-on-surface' : 'text-on-surface-variant/40'
                }`}
              >
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`mx-2 mb-5 h-px w-10 transition-all duration-500 ${
                  idx < step ? 'bg-crimson/40' : 'bg-white/[0.06]'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Resend countdown ─────────────────────────────────────────────────────────
const RESEND_SECONDS = 60;

function useResendTimer() {
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    setSeconds(RESEND_SECONDS);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return { seconds, start, canResend: seconds === 0 };
}

// ─── Main form ────────────────────────────────────────────────────────────────
export function ChangePasswordForm() {
  const router = useRouter();

  // step 0 = email, step 1 = otp + new password, step 2 = success
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { seconds, start: startTimer, canResend } = useResendTimer();

  const [requestOtp, { isLoading: isRequesting, error: requestError }] =
    useRequestPasswordOtpMutation();
  const [changePassword, { isLoading: isChanging, error: changeError }] =
    useChangePasswordMutation();

  // Step 1 — email form
  const emailForm = useForm({ resolver: zodResolver(requestOtpSchema) });

  // Step 2 — otp + new password form
  const passwordForm = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { otp: '', newPassword: '', confirmPassword: '' },
    mode: 'onChange',
  });

  const watchedPassword = passwordForm.watch('newPassword', '');

  // ── Step 1 submit ─────────────────────────────────────────────────────────
  const onRequestOtp = async ({ email: submittedEmail }) => {
    try {
      await requestOtp({ email: submittedEmail }).unwrap();
      setEmail(submittedEmail);
      startTimer();
      setStep(1);
    } catch {
      // error shown via requestError
    }
  };

  // ── Resend ────────────────────────────────────────────────────────────────
  const onResend = async () => {
    if (!canResend) return;
    try {
      await requestOtp({ email }).unwrap();
      passwordForm.resetField('otp');
      startTimer();
    } catch {
      // silently ignore — the API always returns success per spec
    }
  };

  // ── Step 2 submit ─────────────────────────────────────────────────────────
  const onChangePassword = async ({ otp, newPassword }) => {
    try {
      await changePassword({ email, otp, newPassword }).unwrap();
      setStep(2);
    } catch {
      // error shown via changeError
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (step === 2) {
    return (
      <div className="flex flex-col items-center gap-md text-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
          <CheckCircle2 size={36} className="text-emerald-400" />
          <span className="absolute inset-0 animate-ping rounded-full border border-emerald-400/20" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-headline-sm text-on-surface">Password updated</p>
          <p className="text-body-sm text-on-surface-variant">
            Your password has been changed successfully. You can now sign in with your new credentials.
          </p>
        </div>
        <Button variant="primary" className="w-full" onClick={() => router.replace('/login')}>
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-md">
      <StepDots step={step} />

      {/* ── Step 0: Email ────────────────────────────────────────────────── */}
      {step === 0 && (
        <form onSubmit={emailForm.handleSubmit(onRequestOtp)} className="flex flex-col gap-sm">
          <p className="text-body-sm text-on-surface-variant">
            Enter the email address associated with your account and we&apos;ll send you a one-time code.
          </p>

          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...emailForm.register('email')}
            error={emailForm.formState.errors.email?.message}
          />

          {requestError && (
            <p className="text-body-sm text-error">
              {requestError?.data?.message ?? 'Something went wrong. Please try again.'}
            </p>
          )}

          <Button type="submit" variant="primary" disabled={isRequesting}>
            {isRequesting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Sending code…
              </span>
            ) : (
              'Send One-Time Code'
            )}
          </Button>

          <p className="text-center text-body-sm text-on-surface-variant">
            Remember your password?{' '}
            <Link href="/login" className="text-on-surface hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      )}

      {/* ── Step 1: OTP + new password ───────────────────────────────────── */}
      {step === 1 && (
        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="flex flex-col gap-sm">
          {/* email reminder */}
          <div className="flex items-center justify-between rounded border border-white/[0.06] bg-surface-container/60 px-sm py-2.5">
            <span className="text-body-sm text-on-surface-variant">
              Code sent to{' '}
              <span className="font-medium text-on-surface">{email}</span>
            </span>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="ml-2 flex items-center gap-1 text-body-sm text-on-surface-variant transition-colors hover:text-on-surface"
              aria-label="Change email"
            >
              <ArrowLeft size={12} />
              Change
            </button>
          </div>

          {/* OTP boxes */}
          <Controller
            name="otp"
            control={passwordForm.control}
            render={({ field, fieldState }) => (
              <OtpInput
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          {/* resend */}
          <div className="flex items-center justify-end gap-1 text-body-sm">
            {canResend ? (
              <button
                type="button"
                onClick={onResend}
                disabled={isRequesting}
                className="flex items-center gap-1.5 text-on-surface-variant transition-colors hover:text-on-surface disabled:opacity-40"
              >
                {isRequesting ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <RotateCcw size={12} />
                )}
                Resend code
              </button>
            ) : (
              <span className="text-on-surface-variant/50">
                Resend in{' '}
                <span className="tabular-nums text-on-surface-variant">{seconds}s</span>
              </span>
            )}
          </div>

          {/* new password */}
          <div className="relative">
            <Input
              label="New password"
              type={showNew ? 'text' : 'password'}
              autoComplete="new-password"
              {...passwordForm.register('newPassword')}
              error={passwordForm.formState.errors.newPassword?.message}
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              aria-label={showNew ? 'Hide password' : 'Show password'}
              tabIndex={-1}
              className="absolute right-3 top-[38px] text-on-surface-variant transition-colors hover:text-on-surface"
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <PasswordStrength password={watchedPassword} />

          {/* confirm password */}
          <div className="relative">
            <Input
              label="Confirm new password"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              {...passwordForm.register('confirmPassword')}
              error={passwordForm.formState.errors.confirmPassword?.message}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              tabIndex={-1}
              className="absolute right-3 top-[38px] text-on-surface-variant transition-colors hover:text-on-surface"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {changeError && (
            <p className="text-body-sm text-error">
              {changeError?.data?.message ?? 'Invalid code or something went wrong. Please try again.'}
            </p>
          )}

          <Button type="submit" variant="primary" disabled={isChanging}>
            {isChanging ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Updating password…
              </span>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
