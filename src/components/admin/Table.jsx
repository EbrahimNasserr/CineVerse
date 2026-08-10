import PropTypes from "prop-types";
import { cn } from "@/lib/utils/cn";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/common/EmptyState";

/**
 * Reusable admin data table.
 *
 * Usage:
 * <Table
 *   columns={[
 *     { key: "title", header: "Title", render: (row) => row.title },
 *     { key: "actions", header: "", className: "text-right" },
 *   ]}
 *   data={movies}
 *   isLoading={isFetching}
 *   emptyTitle="No movies yet"
 *   emptyDescription="Add your first movie to get started."
 * />
 */
export function Table({
  columns,
  data,
  isLoading,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  rowKey = "_id",
  className,
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-xl">
        <Spinner size={32} />
      </div>
    );
  }

  if (!data?.length) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle ?? "Nothing here yet"}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className={cn("w-full overflow-x-auto rounded-lg border border-white/[0.08]", className)}>
      <table className="min-w-full divide-y divide-white/[0.06]">
        <thead className="bg-surface-container-lowest">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "px-md py-sm text-left text-label-caps text-on-surface-variant",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04] bg-surface-container">
          {data.map((row) => (
            <tr
              key={row[rowKey]}
              className="transition-colors hover:bg-white/[0.03]"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-md py-sm text-body-sm text-on-surface",
                    col.className
                  )}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key:       PropTypes.string.isRequired,
      header:    PropTypes.string,
      render:    PropTypes.func,
      className: PropTypes.string,
    })
  ).isRequired,
  data:             PropTypes.array,
  isLoading:        PropTypes.bool,
  emptyTitle:       PropTypes.string,
  emptyDescription: PropTypes.string,
  emptyIcon:        PropTypes.elementType,
  rowKey:           PropTypes.string,
  className:        PropTypes.string,
};
