'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useGetMoviesQuery } from '@/features/movies/moviesApi';
import {
  useCreateSlotMutation,
  useUpdateSlotMutation,
} from '@/features/showtimes/showtimesApi';

// ─── Constants ────────────────────────────────────────────────────────────────
const FORMATS   = ['2D', '3D', 'IMAX', '4DX', 'IMAX 3D'];
const LANGUAGES = ['English', 'Arabic', 'French', 'Spanish', 'Hindi', 'German'];

// ─── Validation schema ────────────────────────────────────────────────────────
const schema = z.object({
  movie:     z.string().min(1, 'Movie is required'),
  theater:   z.string().min(1, 'Theater name is required'),
  screen:    z.string().min(1, 'Screen is required'),
  date:      z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime:   z.string().min(1, 'End time is required'),
  language:  z.string().min(1, 'Language is required'),
  format:    z.string().min(1, 'Format is required'),
  price:     z.coerce.number().min(0, 'Price must be ≥ 0'),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function SelectField({ id, label, options, register, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-label-caps text-on-surface-variant">
          {label}
        </label>
      )}
      <select
        id={id}
        {...register(id)}
        className="rounded border border-white/[0.08] bg-surface-container px-sm py-xs text-body-md text-on-surface outline-none transition-colors focus:border-crimson"
      >
        {children ??
          options?.map((opt) => (
            <option key={opt} value={opt} className="bg-surface-container">
              {opt}
            </option>
          ))}
      </select>
      {error && <span className="text-body-sm text-error">{error}</span>}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
/**
 * Create / Edit slot (showtime) modal.
 *
 * @param {boolean}  open        - Controls visibility
 * @param {function} onClose     - Dismissal callback
 * @param {object}   [slot]      - Pass an existing slot to enter edit mode
 * @param {function} [onSuccess] - Called after a successful save
 */
export function SlotFormModal({ open, onClose, slot, onSuccess }) {
  const isEditing = Boolean(slot);

  const [createSlot, { isLoading: creating }] = useCreateSlotMutation();
  const [updateSlot, { isLoading: updating }] = useUpdateSlotMutation();
  const isLoading = creating || updating;

  // Fetch all movies for the movie selector (up to 200 for the dropdown)
  const { data: moviesData } = useGetMoviesQuery({ limit: 200 });
  const movies = moviesData?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      movie:     '',
      theater:   '',
      screen:    '',
      date:      '',
      startTime: '',
      endTime:   '',
      language:  'English',
      format:    '2D',
      price:     '',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (slot) {
      reset({
        movie:     slot.movie?._id ?? slot.movie ?? '',
        theater:   slot.theater   ?? '',
        screen:    slot.screen    ?? '',
        date:      slot.date ? slot.date.slice(0, 10) : '',
        startTime: slot.startTime ?? '',
        endTime:   slot.endTime   ?? '',
        language:  slot.language  ?? 'English',
        format:    slot.format    ?? '2D',
        price:     slot.price     ?? '',
      });
    } else {
      reset();
    }
  }, [slot, reset, open]);

  const onSubmit = async (values) => {
    try {
      if (isEditing) {
        await updateSlot({ id: slot._id, ...values }).unwrap();
      } else {
        await createSlot(values).unwrap();
      }
      onSuccess?.();
      onClose();
    } catch {
      // Error state is handled at the page level via RTK Query's rejected status
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Showtime' : 'Add Showtime'}
      className="max-h-[90vh] max-w-xl overflow-y-auto"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-md" noValidate>

        {/* ── Movie ────────────────────────────────────────────────── */}
        <SelectField
          id="movie"
          label="Movie *"
          register={register}
          error={errors.movie?.message}
        >
          <option value="" className="bg-surface-container">
            — Select a movie —
          </option>
          {movies.map((m) => (
            <option key={m._id} value={m._id} className="bg-surface-container">
              {m.title}
            </option>
          ))}
        </SelectField>

        {/* ── Venue ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-sm">
          <Input
            id="theater"
            label="Theater *"
            placeholder="e.g. Grand Cineplex"
            error={errors.theater?.message}
            {...register('theater')}
          />
          <Input
            id="screen"
            label="Screen *"
            placeholder="e.g. Screen 1"
            error={errors.screen?.message}
            {...register('screen')}
          />
        </div>

        {/* ── Schedule ─────────────────────────────────────────────── */}
        <Input
          id="date"
          label="Date *"
          type="date"
          error={errors.date?.message}
          {...register('date')}
        />
        <div className="grid grid-cols-2 gap-sm">
          <Input
            id="startTime"
            label="Start Time *"
            type="time"
            error={errors.startTime?.message}
            {...register('startTime')}
          />
          <Input
            id="endTime"
            label="End Time *"
            type="time"
            error={errors.endTime?.message}
            {...register('endTime')}
          />
        </div>

        {/* ── Presentation ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-sm">
          <SelectField
            id="language"
            label="Language *"
            options={LANGUAGES}
            register={register}
            error={errors.language?.message}
          />
          <SelectField
            id="format"
            label="Format *"
            options={FORMATS}
            register={register}
            error={errors.format?.message}
          />
        </div>

        {/* ── Pricing ──────────────────────────────────────────────── */}
        <Input
          id="price"
          label="Ticket Price ($) *"
          type="number"
          min={0}
          step="0.01"
          placeholder="12.50"
          error={errors.price?.message}
          {...register('price')}
        />

        {/* ── Actions ──────────────────────────────────────────────── */}
        <div className="flex justify-end gap-2 border-t border-white/[0.08] pt-md">
          <Button variant="secondary" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 size={14} className="mr-1 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Create Showtime'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
