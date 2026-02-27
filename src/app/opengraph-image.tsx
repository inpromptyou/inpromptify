import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "InpromptiFy — AI Proficiency Assessment";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0F1C",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Subtle gradient */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 400,
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.08)",
            filter: "blur(80px)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 24,
          }}
        >
          <span style={{ color: "rgba(99, 102, 241, 0.6)", fontSize: 48, fontWeight: 400 }}>[</span>
          <span style={{ color: "white", fontSize: 48, fontWeight: 700 }}>InpromptiFy</span>
          <span style={{ color: "rgba(99, 102, 241, 0.6)", fontSize: 48, fontWeight: 400 }}>]</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255, 255, 255, 0.5)",
            fontWeight: 500,
            marginBottom: 48,
          }}
        >
          AI Proficiency Assessment
        </div>

        {/* Score dimensions */}
        <div
          style={{
            display: "flex",
            gap: 32,
          }}
        >
          {[
            { label: "Prompt Quality", pct: 87 },
            { label: "Efficiency", pct: 72 },
            { label: "Speed", pct: 91 },
            { label: "Response Quality", pct: 78 },
            { label: "Iteration IQ", pct: 65 },
          ].map((dim) => (
            <div
              key={dim.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  border: "3px solid rgba(99, 102, 241, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#818cf8",
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                {dim.pct}
              </div>
              <span style={{ color: "rgba(255, 255, 255, 0.3)", fontSize: 11, fontWeight: 500 }}>
                {dim.label}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            color: "rgba(255, 255, 255, 0.2)",
            fontSize: 14,
          }}
        >
          inpromptify.com — Measure how your team uses AI
        </div>
      </div>
    ),
    { ...size }
  );
}
