import PropTypes from 'prop-types';
import { PAYMENT_METHODS } from '@/lib/constants';

export function PaymentMethod({ register }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-label-caps text-on-surface-variant">Payment Method</legend>
      {PAYMENT_METHODS.map((method) => (
        <label
          key={method.id}
          className="flex items-center gap-2 rounded border border-white/[0.08] px-sm py-xs text-body-sm has-[:checked]:border-crimson"
        >
          <input type="radio" value={method.id} {...(register ? register('paymentMethod') : {})} />
          {method.label}
        </label>
      ))}
    </fieldset>
  );
}

PaymentMethod.propTypes = {
  register: PropTypes.func,
};
