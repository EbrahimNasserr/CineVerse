import PropTypes from "prop-types";
import { cn } from "@/lib/utils/cn";

/**
 * Colour-coded pill badge used in admin tables.
 *
 * Supported preset values (case-insensitive):
 *   booking status  → confirmed | pending | cancelled
 *   payment status  → paid | unpaid | refunded
 *   movie status    → released | upcoming | nowplaying
 *   generic         → active | inactive | true | false
 */
const PRESETS = {
  // booking
  confirmed:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  pending:    "bg-amber-500/15   text-amber-400   border-amber-500/30",
  cancelled:  "bg-rose-500/15   text-rose-400    border-rose-500/30",
  // payment
  paid:       "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  unpaid:     "bg-amber-500/15   text-amber-400   border-amber-500/30",
  refunded:   "bg-sky-500/15     text-sky-400     border-sky-500/30",
  // movie
  released:   "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  upcoming:   "bg-violet-500/15  text-violet-400  border-violet-500/30",
  nowplaying: "bg-sky-500/15     text-sky-400     border-sky-500/30",
  // generic
  active:     "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  inactive:   "bg-white/[0.06]   text-on-surface-variant border-white/[0.08]",
  true:       "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  false:      "bg-white/[0.06]   text-on-surface-variant border-white/[0.08]",
};

export function StatusBadge({ value, className }) {
  const key   = String(value).toLowerCase().replace(/\s+/g, "");
  const style = PRESETS[key] ?? "bg-white/[0.06] text-on-surface-variant border-white/[0.08]";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
        style,
        className
      )}
    >
      {value}
    </span>
  );
}

StatusBadge.propTypes = {
  value:     PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  className: PropTypes.string,
};
