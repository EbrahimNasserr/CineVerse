'use client';

import { useState, useCallback } from 'react';
import { CalendarClock, Edit2, PlusCircle, Trash2 } from 'lucide-react';
import {
  useGetSlotsQuery,
  useDeleteSlotMutation,
} from '@/features/showtimes/showtimesApi';
import { useGetMoviesQuery } from '@/features/movies/moviesApi';
import { SlotFormModal } from '@/features/showtimes/components/SlotFormModal';
import { PageHeader } from '@/components/admin/PageHeader';
import { Table } from '@/components/admin/Table';
import { Pagination } from '@/components/admin/Pagination';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/Button';

const LIMIT = 10;

// ─── Filter bar ───────────────────────────────────────────────────────────────
function FilterBar({ movieId, onMovie, date, onDate, movies }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <select
        value={movieId}
        onChange={(e) => onMovie(e.target.value)}
        className="flex-1 rounded border border-white/[0.08] bg-surface-container px-sm py-xs text-body-sm text-on-surface outline-none focus:border-crimson"
      >
        <option value="">All Movies</option>
        {movies.map((m) => (
          <option key={m._id} value={m._id}>
            {m.title}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => onDate(e.target.value)}
        className="rounded border border-white/[0.08] bg-surface-container px-sm py-xs text-body-sm text-on-surface outline-none focus:border-crimson"
      />
      {(movieId || date) && (
        <button
          type="button"
          onClick={() => {
            onMovie('');
            onDate('');
          }}
          className="text-body-sm text-on-surface-variant underline hover:text-on-surface"
        >
          Clear
        </button>
      )}
    </div>
  );
}

// ─── Format pill ──────────────────────────────────────────────────────────────
function FormatPill({ value }) {
  return (
    <span className="inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-xs font-medium text-sky-400">
      {value}
    </span>
  );
}

// ─── Table columns ────────────────────────────────────────────────────────────
function useColumns({ onEdit, onDelete }) {
  return [
    {
      key: 'movie',
      header: 'Movie',
      render: (row) => (
        <span className="font-semibold">
          {row.movie?.title ?? row.movie ?? '—'}
        </span>
      ),
    },
    {
      key: 'theater',
      header: 'Theater / Screen',
      render: (row) => (
        <div className="flex flex-col">
          <span>{row.theater}</span>
          <span className="text-body-sm text-on-surface-variant">{row.screen}</span>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) =>
        row.date
          ? new Date(row.date).toLocaleDateString('en-US', {
              weekday: 'short',
              year:    'numeric',
              month:   'short',
              day:     'numeric',
            })
          : '—',
    },
    {
      key: 'time',
      header: 'Time',
      render: (row) => (
        <span className="tabular-nums">
          {row.startTime} – {row.endTime}
        </span>
      ),
    },
    {
      key: 'format',
      header: 'Format',
      render: (row) => (
        <div className="flex flex-col gap-1">
          <FormatPill value={row.format ?? '2D'} />
          <span className="text-body-sm text-on-surface-variant">
            {row.language ?? 'English'}
          </span>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (row) => (
        <span className="tabular-nums text-emerald-400">
          ${Number(row.price).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'availableSeats',
      header: 'Seats',
      render: (row) => (
        <span className="tabular-nums">{row.availableSeats ?? '—'}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(row)}
            className="rounded p-1.5 text-on-surface-variant transition-colors hover:bg-white/[0.06] hover:text-on-surface"
            aria-label="Edit showtime"
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(row)}
            className="rounded p-1.5 text-on-surface-variant transition-colors hover:bg-rose-500/10 hover:text-rose-400"
            aria-label="Delete showtime"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminShowtimesPage() {
  const [page, setPage]           = useState(1);
  const [movieId, setMovieId]     = useState('');
  const [date, setDate]           = useState('');
  const [formOpen, setFormOpen]   = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isFetching } = useGetSlotsQuery({
    page,
    limit: LIMIT,
    movie: movieId || undefined,
    date:  date    || undefined,
  });

  const { data: moviesData } = useGetMoviesQuery({ limit: 200 });
  const movies = moviesData?.data ?? [];

  const [deleteSlot, { isLoading: deleting }] = useDeleteSlotMutation();

  const slots      = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  const handleMovieFilter = useCallback((val) => {
    setMovieId(val);
    setPage(1);
  }, []);

  const handleDateFilter = useCallback((val) => {
    setDate(val);
    setPage(1);
  }, []);

  const handleEdit = (slot) => {
    setEditTarget(slot);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditTarget(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteSlot(deleteTarget._id).unwrap();
    setDeleteTarget(null);
  };

  const columns = useColumns({
    onEdit:   handleEdit,
    onDelete: setDeleteTarget,
  });

  return (
    <div className="flex flex-col gap-md px-md py-md">
      <PageHeader
        title="Showtimes"
        subtitle={`${data?.pagination?.total ?? 0} active slots`}
        action={
          <Button onClick={handleAdd}>
            <PlusCircle size={14} className="mr-1" />
            Add Showtime
          </Button>
        }
      />

      <FilterBar
        movieId={movieId}
        onMovie={handleMovieFilter}
        date={date}
        onDate={handleDateFilter}
        movies={movies}
      />

      <Table
        columns={columns}
        data={slots}
        isLoading={isLoading || isFetching}
        emptyTitle="No showtimes found"
        emptyDescription="Schedule a new showtime or adjust the filters."
        emptyIcon={CalendarClock}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Create / Edit modal */}
      <SlotFormModal
        open={formOpen}
        onClose={handleCloseForm}
        slot={editTarget}
        onSuccess={handleCloseForm}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleting}
        title="Delete Showtime"
        description={
          deleteTarget
            ? `The showtime for "${deleteTarget.movie?.title ?? 'this movie'}" on ${
                deleteTarget.date
                  ? new Date(deleteTarget.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month:   'short',
                      day:     'numeric',
                    })
                  : 'selected date'
              } at ${deleteTarget.startTime} will be soft-deleted and all held seats will be released.`
            : ''
        }
        confirmLabel="Delete Showtime"
      />
    </div>
  );
}
