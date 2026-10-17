import * as React from "react";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Reusable delete confirmation modal.
 *
 * Controlled: the parent owns `open` and decides what is being deleted.
 *   <ConfirmDeleteDialog
 *     open={target !== null}
 *     onOpenChange={(o) => !o && setTarget(null)}
 *     itemName={target?.name}
 *     onConfirm={() => remove(target.id)}
 *   />
 */
export interface ConfirmDeleteDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onConfirm: () => void;
  /** Name of the thing being deleted, shown in bold in the description. */
  readonly itemName?: string;
  /** Overrides the default title. */
  readonly title?: string;
  /** Overrides the default description. */
  readonly description?: React.ReactNode;
  /** Overrides the confirm button label. */
  readonly confirmLabel?: string;
  /** Disables the buttons while the delete runs. */
  readonly pending?: boolean;
}

export function ConfirmDeleteDialog(props: ConfirmDeleteDialogProps): React.ReactElement {
  const { t } = useTranslation();
  const tr = (key: string, fallback: string, opts?: Record<string, unknown>): string =>
    t(key, { defaultValue: fallback, ...opts });

  const title = props.title ?? tr("confirmDelete.title", "Delete this item?");
  const confirmLabel = props.confirmLabel ?? tr("confirmDelete.confirm", "Delete");

  return (
    <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <Trash2 className="size-5" aria-hidden="true" />
          </div>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {props.description ?? (
              <>
                {props.itemName ? (
                  <>
                    <strong className="font-medium text-foreground">{props.itemName}</strong>{" "}
                    {tr("confirmDelete.willBeRemoved", "will be removed.")}{" "}
                  </>
                ) : null}
                {tr("confirmDelete.cannotUndo", "This action cannot be undone.")}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={props.pending}>
            {tr("confirmDelete.cancel", "Cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={props.pending}
            onClick={() => props.onConfirm()}
            className="bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/30"
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
