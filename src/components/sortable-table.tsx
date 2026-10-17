import * as React from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

/**
 * Drag-and-drop sortable table body (dnd-kit).
 *
 * - Rows slide smoothly into place while dragging; the drag stays inside the
 *   table (vertical axis only, clamped to the scroll container).
 * - Drag starts from the grip handle (mouse, touch, or keyboard: Space + arrows).
 *
 *   <SortableTableBody ids={ids} onReorder={(next) => save(next)}>
 *     {rows.map((r) => <SortableRow key={r.id} id={r.id}>…cells…</SortableRow>)}
 *   </SortableTableBody>
 */
export interface SortableTableBodyProps {
  readonly ids: readonly string[];
  readonly onReorder: (orderedIds: string[]) => void;
  readonly disabled?: boolean;
  readonly children: React.ReactNode;
  readonly className?: string;
}

const DisabledContext = React.createContext(false);

export function SortableTableBody(props: SortableTableBodyProps): React.ReactElement {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleStart = (e: DragStartEvent) => setActiveId(String(e.active.id));
  const handleEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const ids = [...props.ids];
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from < 0 || to < 0) return;
    props.onReorder(arrayMove(ids, from, to));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
      onDragStart={handleStart}
      onDragEnd={handleEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={[...props.ids]} strategy={verticalListSortingStrategy} disabled={props.disabled}>
        <DisabledContext.Provider value={props.disabled === true}>
          <TableBody className={cn(activeId !== null && "select-none", props.className)}>
            {props.children}
          </TableBody>
        </DisabledContext.Provider>
      </SortableContext>
      {/* No floating clone: the real row moves, so nothing escapes the app. */}
      <DragOverlay dropAnimation={null}>{null}</DragOverlay>
    </DndContext>
  );
}

export interface SortableRowProps {
  readonly id: string;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly handleLabel?: string;
}

export function SortableRow(props: SortableRowProps): React.ReactElement {
  const disabled = React.useContext(DisabledContext);
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: props.id, disabled });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: transition ?? "transform 200ms cubic-bezier(0.2, 0, 0, 1)",
    position: "relative",
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-dragging={isDragging ? "true" : undefined}
      className={cn(
        "bg-card",
        isDragging && "bg-card shadow-lg ring-1 ring-primary/30 [&>td]:bg-card",
        props.className,
      )}
    >
      <TableCell className="w-8 pr-0">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          disabled={disabled}
          aria-label={props.handleLabel ?? "Drag to reorder"}
          className={cn(
            "flex size-7 touch-none items-center justify-center rounded-md text-text-muted transition-colors",
            "hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            disabled ? "cursor-not-allowed opacity-50" : isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
        >
          <GripVertical className="size-4" aria-hidden="true" />
        </button>
      </TableCell>
      {props.children}
    </TableRow>
  );
}
