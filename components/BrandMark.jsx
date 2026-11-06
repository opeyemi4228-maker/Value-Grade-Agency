// Vector redraw of the official VGA mark (taken from the brand letterhead): the V doubles as a
// check, the G holds a performance gauge, the A carries the orange triangle. Swap in VGA's
// master SVG when supplied; keep the viewBox so sizing stays the same.
export const MARK_VIEWBOX = "0 0 128 52";

// Plain shape data so next/og (which only accepts intrinsic <svg> children) can use it too.
export function markShapes(ink = "#002F1F", accent = "#FF6A00") {
  return [
    { d: "M0 15h13.5l12 24.5L46.5 1.5l2 1.2L30 50h-9z", fill: ink },
    { d: "M65.4 15.3A17 17 0 1 0 79 32H68", fill: "none", stroke: ink, strokeWidth: 7 },
    { d: "M68.6 17.3A17 17 0 0 1 78.8 29.5", fill: "none", stroke: accent, strokeWidth: 5, strokeDasharray: "3.4 1.6" },
    { d: "M60.5 34 73 21", stroke: accent, strokeWidth: 2.6, strokeLinecap: "round" },
    { d: "M57.9 34a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0 -5.2 0z", fill: accent },
    { d: "M85 50l20-40 20 40h-9.5L105 29 94.5 50z", fill: ink },
    { d: "M98 50l7-14 7 14z", fill: accent },
  ];
}
