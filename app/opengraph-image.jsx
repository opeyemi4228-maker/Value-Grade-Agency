import { ImageResponse } from "next/og";
import { MARK_VIEWBOX, markShapes } from "@/components/BrandMark";

export const alt = "Value Grade Agency: Performance Marketing Built on Trust, Transparency, and Results";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #011C13 0%, #002F1F 55%, #01402B 100%)",
          color: "#F4F4F2",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="148" height="60" viewBox={MARK_VIEWBOX}>
            {markShapes("#F4F4F2").map((p) => (
              <path key={p.d} {...p} />
            ))}
          </svg>
          <div style={{ width: 2, height: 52, background: "rgba(244,244,242,0.3)" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: 4 }}>VALUE GRADE</span>
            <span style={{ fontSize: 16, letterSpacing: 12, color: "#FF6A00", marginTop: 4 }}>AGENCY</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.08, maxWidth: 980 }}>
            Performance Marketing Built on Trust, Transparency, and Results
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 36 }}>
            {["TRUST", "TRANSPARENCY", "RESULTS"].map((s) => (
              <span key={s} style={{ fontSize: 18, letterSpacing: 4, color: "#FF6A00", border: "2px solid rgba(255,106,0,0.5)", borderRadius: 999, padding: "8px 20px" }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
