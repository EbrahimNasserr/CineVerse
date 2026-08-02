import Image from 'next/image';
import PropTypes from 'prop-types';

/**
 * CastCard: 48px circular avatar, name + role in body-sm to the right.
 */
export function CastCard({ name, role, avatarUrl }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface-container-high">
        {avatarUrl && <Image src={avatarUrl} alt={name} fill className="object-cover" />}
      </div>
      <div className="text-body-sm">
        <p className="text-on-surface">{name}</p>
        <p className="text-on-surface-variant">{role}</p>
      </div>
    </div>
  );
}

CastCard.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string,
  avatarUrl: PropTypes.string,
};
