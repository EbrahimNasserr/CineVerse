import PropTypes from 'prop-types';
import { Frown } from 'lucide-react';

export function EmptyState({ icon: Icon = Frown, title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-surface-container py-xl text-center">
      <Icon size={32} className="text-on-surface-variant" />
      <h3 className="text-title-lg">{title}</h3>
      {description && <p className="max-w-sm text-body-sm text-on-surface-variant">{description}</p>}
      {action}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
};
