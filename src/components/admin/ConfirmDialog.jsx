import PropTypes from "prop-types";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

/**
 * Confirmation dialog for destructive actions (delete, cancel, etc.).
 *
 * @param {boolean}  open        - Controls visibility
 * @param {function} onClose     - Called when dismissed
 * @param {function} onConfirm   - Called when the destructive action is confirmed
 * @param {boolean}  isLoading   - Shows spinner on confirm button while processing
 * @param {string}   title       - Dialog heading
 * @param {string}   description - Supporting copy explaining what will be deleted/cancelled
 * @param {string}   [confirmLabel] - Label for the confirm button (default "Delete")
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  isLoading,
  title = "Are you sure?",
  description,
  confirmLabel = "Delete",
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} className="max-w-sm">
      <div className="flex flex-col gap-md">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-500/15">
            <AlertTriangle size={18} className="text-rose-400" />
          </span>
          <p className="text-body-sm text-on-surface-variant">{description}</p>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded bg-rose-600 px-sm py-xs text-body-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-rose-500 disabled:opacity-40"
          >
            {isLoading && <Spinner size={14} />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

ConfirmDialog.propTypes = {
  open:         PropTypes.bool.isRequired,
  onClose:      PropTypes.func.isRequired,
  onConfirm:    PropTypes.func.isRequired,
  isLoading:    PropTypes.bool,
  title:        PropTypes.string,
  description:  PropTypes.string,
  confirmLabel: PropTypes.string,
};
