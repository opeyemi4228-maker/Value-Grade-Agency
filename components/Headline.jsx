import { Fragment } from "react";

// Renders text where [bracketed] words get an orange accent.
// "block": solid highlight for page H1s and the closing CTA (the focal points).
// "line": underline for section headings, so they support rather than compete.
export function highlight(text, variant = "block") {
  return text.split(/(\[[^\]]+\])/g).map((part, i) =>
    part.startsWith("[") ? (
      <span key={i} className={variant === "line" ? "mark-line" : "mark-block"}>{part.slice(1, -1)}</span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function plain(text) {
  return text.replace(/[[\]]/g, "");
}
