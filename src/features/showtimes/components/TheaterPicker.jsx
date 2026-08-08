"use client";

import { Chip } from '@/components/ui/Chip';

export function TheaterPicker({ theaters, selected, onChange }) {
  if (!theaters.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {theaters.map((name) => (
        <Chip
          key={name}
          active={name === selected}
          onClick={() => onChange(name)}
          className="text-body-sm"
        >
          {name}
        </Chip>
      ))}
    </div>
  );
}
