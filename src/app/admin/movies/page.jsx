'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Edit2, PlusCircle, Star, Trash2, TrendingUp } from 'lucide-react';
import {
  useGetMoviesQuery,
  useDeleteMovieMutation,
} from '@/features/movies/moviesApi';
import { MovieFormModal } from '@/features/movies/components/MovieFormModal';
import { PageHeader } from '@/components/admin/PageHeader';
import { Table } from '@/components/admin/Table';
import { Pagination } from '@/components/admin/Pagination';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/Button';

const LIMIT = 10;

// ─── Inline search / filter bar ──────────────────────────────────────────────
function FilterBar({ search, onSearch, status, onStatus }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        type="search"
        placeholder="Search movies…"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        className="flex-1 rounded border border-white/[0.08] bg-surface-container px-sm py-xs text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant/60 focus:border-crimson"
      />
      <select
        value={status}
        onChange={(e) => onStatus(e.target.value)}
        className="rounded border border-white/[0.08] bg-surface-container px-sm py-xs text-body-sm text-on-surface outline-none focus:border-crimson"
      >
        <option value="">All Statuses</option>
        <option value="Upcoming">Upcoming</option>
        <option value="Now Playing">Now Playing</option>
        <option value="Released">Released</option>
      </select>
    </div>
  );
}

// ─── Table columns definition ─────────────────────────────────────────────────
function useColumns({ onEdit, onDelete }) {
  return [
    {
      key: 'poster',
      header: '',
      className: 'w-12',
      render: (row) =>
        row.poster ? (
          <div className="relative h-12 w-8 overflow-hidden rounded">
            <Image
              src={row.poster}
              alt={row.title}
              fill
              sizes="32px"
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="h-12 w-8 rounded bg-surface-container-lowest" />
        ),
    },
    {
      key: 'title',
      header: 'Title',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold">{row.title}</span>
          <span className="text-body-sm text-on-surface-variant">
            {row.director} · {row.duration} min
          </span>
        </div>
      ),
    },
    {
      key: 'releaseDate',
      header: 'Release',
      render: (row) =>
        row.releaseDate
          ? new Date(row.releaseDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge value={row.status} />,
    },
    {
      key: 'flags',
      header: 'Flags',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.featured && (
            <span title="Featured">
              <Star size={14} className="text-amber-400" />
            </span>
          )}
          {row.trending && (
            <span title="Trending">
              <TrendingUp size={14} className="text-sky-400" />
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'imdbRating',
      header: 'IMDb',
      render: (row) =>
        row.imdbRating ? (
          <span className="tabular-nums text-amber-400">{row.imdbRating}</span>
        ) : (
          '—'
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
            aria-label={`Edit ${row.title}`}
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(row)}
            className="rounded p-1.5 text-on-surface-variant transition-colors hover:bg-rose-500/10 hover:text-rose-400"
            aria-label={`Delete ${row.title}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminMoviesPage() {
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('');

  // Modal state
  const [formOpen, setFormOpen]       = useState(false);
  const [editTarget, setEditTarget]   = useState(null); // null = create mode
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isFetching } = useGetMoviesQuery({
    page,
    limit: LIMIT,
    search: search || undefined,
    status: status || undefined,
  });

  const [deleteMovie, { isLoading: deleting }] = useDeleteMovieMutation();

  const movies     = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  // Reset to page 1 whenever filters change
  const handleSearch = useCallback((val) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleStatus = useCallback((val) => {
    setStatus(val);
    setPage(1);
  }, []);

  const handleEdit = (movie) => {
    setEditTarget(movie);
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
    await deleteMovie(deleteTarget._id).unwrap();
    setDeleteTarget(null);
  };

  const columns = useColumns({
    onEdit:   handleEdit,
    onDelete: setDeleteTarget,
  });

  return (
    <div className="flex flex-col gap-md px-md py-md">
      <PageHeader
        title="Movies"
        subtitle={`${data?.pagination?.total ?? 0} movies in the catalogue`}
        action={
          <Button onClick={handleAdd}>
            <PlusCircle size={14} className="mr-1" />
            Add Movie
          </Button>
        }
      />

      <FilterBar
        search={search}
        onSearch={handleSearch}
        status={status}
        onStatus={handleStatus}
      />

      <Table
        columns={columns}
        data={movies}
        isLoading={isLoading || isFetching}
        emptyTitle="No movies found"
        emptyDescription="Add your first movie or adjust the filters."
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Create / Edit modal */}
      <MovieFormModal
        open={formOpen}
        onClose={handleCloseForm}
        movie={editTarget}
        onSuccess={handleCloseForm}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleting}
        title="Delete Movie"
        description={`"${deleteTarget?.title}" will be permanently removed along with its poster and backdrop files. This cannot be undone.`}
        confirmLabel="Delete Movie"
      />
    </div>
  );
}
