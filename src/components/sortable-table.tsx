import * as React from "react";
import { GripVertical } from "lucide-react";
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

/**
 * Native (no library) sortable table body, built on pointer events.
 *
 * - The real row follows the pointer, vertically only and clamped to the table,
 *   so nothing floats outside the app (no browser drag ghost).
 * - The other rows slide out of the way with a smooth transition.
 * - Works with mouse and touch (from the grip handle) and keyboard (arrows on the handle).
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

interface DragState {
  readonly id: string;
  readonly from: number;
  readonly to: number;
  readonly dy: number;
  readonly height: number;
}

interface Ctx {
  readonly disabled: boolean;
  readonly drag: DragState | null;
  readonly settling: boolean;
  readonly ids: readonly string[];
  register: (id: string, el: HTMLTableRowElement | null) => void;
  start: (id: string, clientY: number) => void;
  move: (clientY: number) => void;
  end: () => void;
  nudge: (id: string, delta: number) => void;
}

const SortCtx = React.createContext<Ctx | null>(null);

function arrayMove<T>(arr: readonly T[], from: number, to: number): T[] {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function SortableTableBody(props: SortableTableBodyProps): React.ReactElement {
  const rowsRef = React.useRef(new Map<string, HTMLTableRowElement>());
  const geomRef = React.useRef<{ startY: number; rects: DOMRect[] } | null>(null);
  const [drag, setDrag] = React.useState<DragState | null>(null);
  const [settling, setSettling] = React.useState(false);
  const dragRef = React.useRef<DragState | null>(null);
  dragRef.current = drag;

  const register = React.useCallback((id: string, el: HTMLTableRowElement | null) => {
    if (el) rowsRef.current.set(id, el);
    else rowsRef.current.delete(id);
  }, []);

  const start = (id: string, clientY: number) => {
    const from = props.ids.indexOf(id);
    if (from < 0 || props.disabled) return;
    const rects = props.ids.map((rid) => rowsRef.current.get(rid)?.getBoundingClientRect() ?? new DOMRect());
    geomRef.current = { startY: clientY, rects };
    setDrag({ id, from, to: from, dy: 0, height: rects[from].height });
  };

  const move = (clientY: number) => {
    const d = dragRef.current;
    const g = geomRef.current;
    if (!d || !g) return;
    const self = g.rects[d.from];
    const minDy = g.rects[0].top - self.top;
    const maxDy = g.rects[g.rects.length - 1].bottom - self.bottom;
    const dy = Math.max(minDy, Math.min(maxDy, clientY - g.startY));
    const center = self.top + self.height / 2 + dy;
    let to = 0;
    g.rects.forEach((r, i) => {
      if (i !== d.from && r.top + r.height / 2 < center) to++;
    });
    setDrag({ ...d, dy, to });
  };

  const end = () => {
    const d = dragRef.current;
    if (!d) return;
    const g = geomRef.current;
    // Snap the dragged row into its final slot, then commit.
    const snapDy = g ? g.rects[d.to].top - g.rects[d.from].top + (d.to > d.from ? g.rects[d.to].height - d.height : 0) : 0;
    setSettling(true);
    setDrag({ ...d, dy: snapDy });
    window.setTimeout(() => {
      setDrag(null);
      setSettling(false);
      geomRef.current = null;
      if (d.to !== d.from) props.onReorder(arrayMove(props.ids, d.from, d.to));
    }, 180);
  };

  const nudge = (id: string, delta: number) => {
    const from = props.ids.indexOf(id);
    const to = from + delta;
    if (props.disabled || from < 0 || to < 0 || to >= props.ids.length) return;
    props.onReorder(arrayMove(props.ids, from, to));
  };

  const ctx: Ctx = {
    disabled: props.disabled === true,
    drag,
    settling,
    ids: props.ids,
    register,
    start,
    move,
    end,
    nudge,
  };

  return (
    <SortCtx.Provider value={ctx}>
      <TableBody className={cn(drag && "select-none", props.className)}>{props.children}</TableBody>
    </SortCtx.Provider>
  );
}

export interface SortableRowProps {
  readonly id: string;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly handleLabel?: string;
}

const EASE = "cubic-bezier(0.2, 0, 0, 1)";

export function SortableRow(props: SortableRowProps): React.ReactElement {
  const ctx = React.useContext(SortCtx);
  if (!ctx) throw new Error("SortableRow must be used inside SortableTableBody");
  const { drag, settling, disabled } = ctx;
  const index = ctx.ids.indexOf(props.id);
  const isActive = drag?.id === props.id;

  let translate = 0;
  if (drag && !isActive) {
    if (drag.from < drag.to && index > drag.from && index <= drag.to) translate = -drag.height;
    if (drag.from > drag.to && index >= drag.to && index < drag.from) translate = drag.height;
  }
  if (isActive && drag) translate = drag.dy;

  const style: React.CSSProperties = drag
    ? {
        transform: `translate3d(0, ${translate}px, 0)${isActive && !settling ? " scale(1.01)" : ""}`,
        transition: isActive && !settling ? "box-shadow 150ms ease" : `transform 180ms ${EASE}, box-shadow 150ms ease`,
        position: "relative",
        zIndex: isActive ? 10 : undefined,
      }
    : {};

  return (
    <TableRow
      ref={(el) => ctx.register(props.id, el)}
      style={style}
      data-dragging={isActive ? "true" : undefined}
      className={cn(
        "bg-card",
        isActive && "rounded-lg shadow-xl ring-1 ring-primary/30 [&>td]:bg-card",
        props.className,
      )}
    >
      <TableCell className="w-8 pr-0">
        <button
          type="button"
          disabled={disabled}
          aria-label={props.handleLabel ?? "Drag to reorder"}
          aria-roledescription="sortable"
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            e.currentTarget.setPointerCapture(e.pointerId);
            ctx.start(props.id, e.clientY);
          }}
          onPointerMove={(e) => {
            if (isActive) ctx.move(e.clientY);
          }}
          onPointerUp={() => {
            if (isActive) ctx.end();
          }}
          onPointerCancel={() => {
            if (isActive) ctx.end();
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") { e.preventDefault(); ctx.nudge(props.id, -1); }
            if (e.key === "ArrowDown") { e.preventDefault(); ctx.nudge(props.id, 1); }
          }}
          className={cn(
            "flex size-7 touch-none items-center justify-center rounded-md text-text-muted transition-colors",
            "hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            disabled ? "cursor-not-allowed opacity-50" : isActive ? "cursor-grabbing bg-accent text-foreground" : "cursor-grab",
          )}
        >
          <GripVertical className="size-4" aria-hidden="true" />
        </button>
      </TableCell>
      {props.children}
    </TableRow>
  );
}
