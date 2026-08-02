'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PaymentMethod } from './PaymentMethod';
import { checkoutSchema } from '@/lib/validators/checkoutSchema';

export function CheckoutForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'card' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit ?? (() => {}))} className="flex flex-col gap-sm">
      <Input label="Full name" placeholder="Jane Doe" {...register('name')} error={errors.name?.message} />
      <Input
        label="Email"
        type="email"
        placeholder="jane@example.com"
        {...register('email')}
        error={errors.email?.message}
      />
      <PaymentMethod register={register} />
      <Button type="submit" variant="primary" disabled={isSubmitting}>
        Confirm & Pay
      </Button>
    </form>
  );
}
