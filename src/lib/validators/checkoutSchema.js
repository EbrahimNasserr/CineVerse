import { z } from 'zod';

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email address'),
  paymentMethod: z.enum(['card', 'paypal', 'apple-pay']),
  cardNumber: z.string().optional(),
});
