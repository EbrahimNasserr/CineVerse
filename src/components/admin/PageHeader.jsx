import PropTypes from "prop-types";

/**
 * Consistent page header for all admin sections.
 * Renders a title, optional subtitle, and an optional action slot (e.g. a
 * "+ Add" button) aligned to the right on wider screens.
 */
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-headline-sm">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-body-sm text-on-surface-variant">{subtitle}</p>
        )}
      </div>
      {action && <div className="mt-2 shrink-0 sm:mt-0">{action}</div>}
    </div>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  action: PropTypes.node,
};
