"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Chip } from "@/components/ui/Chip";

export function TheaterSelector({ theaters = [], value = null, onChange }) {
  const [internalActiveId, setInternalActiveId] = useState(
    theaters[0]?.id ?? null,
  );

  useEffect(() => {
    if (!theaters.length) {
      setInternalActiveId(null);
      return;
    }

    const nextValue = value ?? internalActiveId;
    if (!nextValue || !theaters.some((theater) => theater.id === nextValue)) {
      const fallbackTheater = theaters[0];
      setInternalActiveId(fallbackTheater.id);
      onChange?.(fallbackTheater.id);
    }
  }, [theaters, value, internalActiveId, onChange]);

  const activeId = value ?? internalActiveId;

  const handleSelect = (theaterId) => {
    setInternalActiveId(theaterId);
    onChange?.(theaterId);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {theaters.map((theater) => (
        <Chip
          key={theater.id}
          active={theater.id === activeId}
          onClick={() => handleSelect(theater.id)}
        >
          {theater.name}
        </Chip>
      ))}
    </div>
  );
}

TheaterSelector.propTypes = {
  theaters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  value: PropTypes.string,
  onChange: PropTypes.func,
};
