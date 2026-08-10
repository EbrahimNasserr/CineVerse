'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCreateMovieMutation, useUpdateMovieMutation } from '@/features/movies/moviesApi';

// ─── Validation schema ────────────────────────────────────────────────────────
const schema = z.object({
  title:       z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  duration:    z.coerce.number().min(1, 'Duration must be at least 1 minute'),
  director:    z.string().min(1, 'Director is required'),
  releaseDate: z.string().min(1, 'Release date is required'),
  poster:      z.string().optional(),
  backdrop:    z.string().optional(),
  trailer:     z.string().optional(),
  genres:      z.string().optional(), // comma-separated
  languages:   z.string().optional(), // comma-separated
  cast:        z.string().optional(), // comma-separated IDs or names
  writer:      z.string().optional(),
  production:  z.string().optional(),
  country:     z.string().optional(),
  imdbRating:  z.coerce.number().min(0).max(10).optional().or(z.literal('')),
  ageRating:   z.string().optional(),
  status:      z.string().optional(),
  featured:    z.boolean().optional(),
  trending:    z.boolean().optional(),
  isActive:    z.boolean().optional(),
});

const AGE_RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
const STATUSES    = ['Upcoming', 'Now Playing', 'Released'];

// ─── Reusable field-set section ───────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 text-label-caps text-on-surface-variant">{title}</legend>
      {children}
    </fieldset>
  );
}

// ─── Checkbox row ─────────────────────────────────────────────────────────────
function CheckboxField({ id, label, register }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2 text-body-sm">
      <input
        id={id}
        type="checkbox"
        {...register(id)}
        className="h-4 w-4 rounded border border-white/20 bg-surface-container accent-crimson"
      />
      {label}
    </label>
  );
}

// ─── Select field ─────────────────────────────────────────────────────────────
function SelectField({ id, label, options, register, error }) {
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
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-surface-container">
            {opt}
          </option>
        ))}
      </select>
      {error && <span className="text-body-sm text-error">{error}</span>}
    </div>
  );
}

// ─── Textarea field ───────────────────────────────────────────────────────────
function TextareaField({ id, label, register, error, rows = 3, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-label-caps text-on-surface-variant">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        {...register(id)}
        className="rounded border border-white/[0.08] bg-surface-container px-sm py-xs text-body-md text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-crimson"
      />
      {error && <span className="text-body-sm text-error">{error}</span>}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
/**
 * Create / Edit movie modal.
 *
 * @param {boolean}  open        - Controls visibility
 * @param {function} onClose     - Dismissal callback
 * @param {object}   [movie]     - Pass an existing movie to enter edit mode
 * @param {function} [onSuccess] - Called after a successful save
 */
export function MovieFormModal({ open, onClose, movie, onSuccess }) {
  const isEditing = Boolean(movie);

  const [createMovie, { isLoading: creating }] = useCreateMovieMutation();
  const [updateMovie, { isLoading: updating }] = useUpdateMovieMutation();
  const isLoading = creating || updating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title:       '',
      description: '',
      duration:    '',
      director:    '',
      releaseDate: '',
      poster:      '',
      backdrop:    '',
      trailer:     '',
      genres:      '',
      languages:   'English',
      cast:        '',
      writer:      '',
      production:  '',
      country:     '',
      imdbRating:  '',
      ageRating:   'PG-13',
      status:      'Upcoming',
      featured:    false,
      trending:    false,
      isActive:    true,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (movie) {
      reset({
        title:       movie.title       ?? '',
        description: movie.description ?? '',
        duration:    movie.duration    ?? '',
        director:    movie.director    ?? '',
        releaseDate: movie.releaseDate
          ? movie.releaseDate.slice(0, 10)
          : '',
        poster:      movie.poster      ?? '',
        backdrop:    movie.backdrop    ?? '',
        trailer:     movie.trailer     ?? '',
        genres:      Array.isArray(movie.genres)    ? movie.genres.join(', ')    : '',
        languages:   Array.isArray(movie.languages) ? movie.languages.join(', ') : 'English',
        cast:        Array.isArray(movie.cast)
          ? movie.cast.map((c) => c.name ?? c).join(', ')
          : '',
        writer:      movie.writer      ?? '',
        production:  movie.production  ?? '',
        country:     movie.country     ?? '',
        imdbRating:  movie.imdbRating  ?? '',
        ageRating:   movie.ageRating   ?? 'PG-13',
        status:      movie.status      ?? 'Upcoming',
        featured:    movie.featured    ?? false,
        trending:    movie.trending    ?? false,
        isActive:    movie.isActive    ?? true,
      });
    } else {
      reset();
    }
  }, [movie, reset, open]);

  const onSubmit = async (values) => {
    // Build FormData so the server's multer middleware can parse file uploads
    // if the user uploads files in a future iteration. For now we pass JSON
    // fields via FormData so the controller stays compatible.
    const fd = new FormData();

    const append = (key, val) => {
      if (val !== undefined && val !== null && val !== '') {
        fd.append(key, val);
      }
    };

    append('title',       values.title);
    append('description', values.description);
    append('duration',    values.duration);
    append('director',    values.director);
    append('releaseDate', values.releaseDate);
    append('poster',      values.poster);
    append('backdrop',    values.backdrop);
    append('trailer',     values.trailer);
    append('genres',      values.genres);
    append('languages',   values.languages);
    append('cast',        values.cast);
    append('writer',      values.writer);
    append('production',  values.production);
    append('country',     values.country);
    append('imdbRating',  values.imdbRating);
    append('ageRating',   values.ageRating);
    append('status',      values.status);
    fd.append('featured', values.featured  ? 'true' : 'false');
    fd.append('trending', values.trending  ? 'true' : 'false');
    fd.append('isActive', values.isActive  ? 'true' : 'false');

    try {
      if (isEditing) {
        await updateMovie({ id: movie._id, formData: fd }).unwrap();
      } else {
        await createMovie(fd).unwrap();
      }
      onSuccess?.();
      onClose();
    } catch {
      // Errors bubble up to the page level via RTK Query's rejected state —
      // no need to duplicate state here.
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Movie' : 'Add Movie'}
      className="max-h-[90vh] max-w-2xl overflow-y-auto"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-md" noValidate>

        {/* ── Core details ─────────────────────────────────────────── */}
        <Section title="Core Details">
          <Input
            id="title"
            label="Title *"
            placeholder="e.g. Inception"
            error={errors.title?.message}
            {...register('title')}
          />
          <TextareaField
            id="description"
            label="Description *"
            placeholder="Brief synopsis…"
            register={register}
            error={errors.description?.message}
            rows={4}
          />
          <div className="grid grid-cols-2 gap-sm">
            <Input
              id="duration"
              label="Duration (min) *"
              type="number"
              min={1}
              placeholder="148"
              error={errors.duration?.message}
              {...register('duration')}
            />
            <Input
              id="releaseDate"
              label="Release Date *"
              type="date"
              error={errors.releaseDate?.message}
              {...register('releaseDate')}
            />
          </div>
        </Section>

        {/* ── Credits ──────────────────────────────────────────────── */}
        <Section title="Credits">
          <div className="grid grid-cols-2 gap-sm">
            <Input
              id="director"
              label="Director *"
              placeholder="Christopher Nolan"
              error={errors.director?.message}
              {...register('director')}
            />
            <Input
              id="writer"
              label="Writer"
              placeholder="Jonathan Nolan"
              {...register('writer')}
            />
          </div>
          <div className="grid grid-cols-2 gap-sm">
            <Input
              id="production"
              label="Production"
              placeholder="Warner Bros."
              {...register('production')}
            />
            <Input
              id="country"
              label="Country"
              placeholder="USA"
              {...register('country')}
            />
          </div>
          <Input
            id="cast"
            label="Cast (comma-separated names)"
            placeholder="Leonardo DiCaprio, Joseph Gordon-Levitt"
            {...register('cast')}
          />
        </Section>

        {/* ── Media ────────────────────────────────────────────────── */}
        <Section title="Media URLs">
          <Input
            id="poster"
            label="Poster URL *"
            placeholder="https://…/poster.jpg"
            error={errors.poster?.message}
            {...register('poster')}
          />
          <Input
            id="backdrop"
            label="Backdrop URL"
            placeholder="https://…/backdrop.jpg"
            {...register('backdrop')}
          />
          <Input
            id="trailer"
            label="Trailer URL / YouTube ID"
            placeholder="https://youtube.com/watch?v=…"
            {...register('trailer')}
          />
        </Section>

        {/* ── Metadata ─────────────────────────────────────────────── */}
        <Section title="Metadata">
          <div className="grid grid-cols-2 gap-sm">
            <Input
              id="genres"
              label="Genres (comma-separated)"
              placeholder="Action, Sci-Fi"
              {...register('genres')}
            />
            <Input
              id="languages"
              label="Languages (comma-separated)"
              placeholder="English, French"
              {...register('languages')}
            />
          </div>
          <div className="grid grid-cols-3 gap-sm">
            <Input
              id="imdbRating"
              label="IMDb Rating"
              type="number"
              step="0.1"
              min={0}
              max={10}
              placeholder="8.8"
              {...register('imdbRating')}
            />
            <SelectField
              id="ageRating"
              label="Age Rating"
              options={AGE_RATINGS}
              register={register}
            />
            <SelectField
              id="status"
              label="Status"
              options={STATUSES}
              register={register}
            />
          </div>
        </Section>

        {/* ── Flags ────────────────────────────────────────────────── */}
        <Section title="Flags">
          <div className="flex flex-wrap gap-lg">
            <CheckboxField id="featured" label="Featured"  register={register} />
            <CheckboxField id="trending" label="Trending"  register={register} />
            <CheckboxField id="isActive" label="Active"    register={register} />
          </div>
        </Section>

        {/* ── Actions ──────────────────────────────────────────────── */}
        <div className="flex justify-end gap-2 border-t border-white/[0.08] pt-md">
          <Button variant="secondary" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 size={14} className="mr-1 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Create Movie'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
