import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(232,114,28,0.15) 0%, transparent 60%)",
            display: "flex",
          }}
        />

        {/* Orange accent bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "#E8721C",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 80px",
            position: "relative",
          }}
        >
          {/* Logo text */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#E8721C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 800,
                color: "white",
              }}
            >
              F
            </div>
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              Færder Multiservice
            </span>
          </div>

          {/* Main headline */}
          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              margin: 0,
            }}
          >
            Rent hjem.
          </h1>
          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#E8721C",
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              margin: 0,
            }}
          >
            Null stress.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.7)",
              marginTop: 24,
              fontWeight: 500,
            }}
          >
            Skikkelig renhold i hele Vestfold — fra 550 kr
          </p>

          {/* Trust badges */}
          <div
            style={{
              display: "flex",
              gap: 24,
              marginTop: 40,
            }}
          >
            {["⭐ 4.8/5 på Google", "✓ Offentlig godkjent", "♻ EV-sertifisert"].map(
              (badge) => (
                <div
                  key={badge}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 16,
                    fontWeight: 600,
                    display: "flex",
                  }}
                >
                  {badge}
                </div>
              )
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 50,
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 500 }}>
            faerdermultiservice.no
          </span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>·</span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 500 }}>
            968 23 647
          </span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>·</span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 500 }}>
            NHO-medlem
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
