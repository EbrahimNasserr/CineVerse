import PropTypes from "prop-types";
import { cn } from "@/lib/utils/cn";

/**
 * A single KPI tile used on the admin dashboard overview.
 *
 * @param {string}      title   - Metric label
 * @param {string|number} value - Primary number/string to display
 * @param {ReactNode}   icon    - Lucide icon element (already sized + coloured by caller)
 * @param {string}      [trend] - Optional trend text, e.g. "+12% vs last month"
 * @param {string}      [trendPositive] - true → green, false → red, undefined → neutral
 * @param {string}      [className]
 */
export function StatCard({ title, value, icon, trend, trendPositive, className }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-white/[0.08] bg-surface-container p-md",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-body-sm text-on-surface-variant">{title}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06]">
          {icon}
        </span>
      </div>

      <p className="text-headline-sm tabular-nums">{value ?? "—"}</p>

      {trend !== undefined && (
        <p
          className={cn(
            "text-body-sm",
            trendPositive === true  && "text-emerald-400",
            trendPositive === false && "text-rose-400",
            trendPositive === undefined && "text-on-surface-variant"
          )}
        >
          {trend}
        </p>
      )}
    </div>
  );
}

StatCard.propTypes = {
  title:         PropTypes.string.isRequired,
  value:         PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon:          PropTypes.node.isRequired,
  trend:         PropTypes.string,
  trendPositive: PropTypes.bool,
  className:     PropTypes.string,
};
