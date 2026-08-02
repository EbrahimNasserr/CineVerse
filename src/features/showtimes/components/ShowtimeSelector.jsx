"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils/cn";

/**
 * Horizontal scrollable pill list; active pill = crimson fill,
 * unavailable = line-through + reduced opacity.
 */
export function ShowtimeSelector({ showtimes = [], value = null, onChange }) {
  const [internalActiveId, setInternalActiveId] = useState(
    showtimes[0]?.id ?? null,
  );

  useEffect(() => {
    if (!showtimes.length) {
      setInternalActiveId(null);
      return;
    }

    const nextValue = value ?? internalActiveId;
    if (
      !nextValue ||
      !showtimes.some((showtime) => showtime.id === nextValue)
    ) {
      const fallbackShowtime =
        showtimes.find((showtime) => !showtime.isSoldOut) ?? showtimes[0];
      setInternalActiveId(fallbackShowtime.id);
      onChange?.(fallbackShowtime.id);
    }
  }, [showtimes, value, internalActiveId, onChange]);

  const activeId = value ?? internalActiveId;

  const handleSelect = (showtime) => {
    if (showtime.isSoldOut) return;
    setInternalActiveId(showtime.id);
    onChange?.(showtime.id);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {showtimes.map((showtime) => {
        const isActive = showtime.id === activeId;
        return (
          <button
            key={showtime.id}
            type="button"
            disabled={showtime.isSoldOut}
            onClick={() => handleSelect(showtime)}
            className={cn(
              "shrink-0 rounded-full px-sm py-xs text-body-sm transition-colors",
              isActive
                ? "bg-crimson text-white"
                : "border border-white/[0.08] bg-transparent text-on-surface",
              showtime.isSoldOut && "line-through opacity-30",
            )}
          >
            {showtime.startTime} · {showtime.format ?? "Screening"}
          </button>
        );
      })}
    </div>
  );
}

ShowtimeSelector.propTypes = {
  showtimes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      startTime: PropTypes.string.isRequired,
      format: PropTypes.string,
      isSoldOut: PropTypes.bool,
    }),
  ),
  value: PropTypes.string,
  onChange: PropTypes.func,
};
