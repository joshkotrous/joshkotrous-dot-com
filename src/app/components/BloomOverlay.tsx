"use client";

export default function CRTOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        // Use backdrop-filter to sample the actual content
        backdropFilter: `
          hue-rotate(5deg)
          saturate(1.1)
          brightness(1.05)
          contrast(1.1)
        `,
        // Apply the CRT effect using CSS filters
        filter: `
          drop-shadow(0 0 1px #22c55e)
          drop-shadow(0 0 2px #22c55e)
          drop-shadow(0 0 4px #22c55e)
          drop-shadow(0 0 8px #22c55e)
        `,
        // Add scan lines using CSS
        background: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(34, 197, 94, 0.03) 2px,
            rgba(34, 197, 94, 0.03) 4px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 1px,
            rgba(34, 197, 94, 0.01) 1px,
            rgba(34, 197, 94, 0.01) 2px
          )
        `,
        // Vignette effect
        boxShadow: `
          inset 0 0 200px rgba(0, 0, 0, 0.3),
          inset 0 0 100px rgba(0, 0, 0, 0.2)
        `,
        // Subtle screen curve using border-radius
        borderRadius: "8px",
        // Screen flicker animation
        animation: "crt-flicker 0.15s infinite linear alternate",
        mixBlendMode: "screen",
      }}
    >
      {/* Add the animation keyframes */}
      <style jsx>{`
        @keyframes crt-flicker {
          0% {
            opacity: 1;
            filter: brightness(1) contrast(1.1);
          }
          2% {
            opacity: 0.98;
            filter: brightness(1.02) contrast(1.12);
          }
          4% {
            opacity: 1;
            filter: brightness(0.98) contrast(1.08);
          }
          100% {
            opacity: 1;
            filter: brightness(1) contrast(1.1);
          }
        }

        @keyframes crt-noise {
          0%,
          100% {
            background-image:
              radial-gradient(
                circle at 25% 25%,
                rgba(34, 197, 94, 0.01) 0%,
                transparent 50%
              ),
              radial-gradient(
                circle at 75% 75%,
                rgba(34, 197, 94, 0.01) 0%,
                transparent 50%
              );
          }
          50% {
            background-image:
              radial-gradient(
                circle at 75% 25%,
                rgba(34, 197, 94, 0.015) 0%,
                transparent 50%
              ),
              radial-gradient(
                circle at 25% 75%,
                rgba(34, 197, 94, 0.015) 0%,
                transparent 50%
              );
          }
        }
      `}</style>

      {/* Subtle noise overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, transparent 0%, rgba(34, 197, 94, 0.005) 100%)
          `,
          animation: "crt-noise 2s infinite ease-in-out",
          opacity: 0.3,
        }}
      />
    </div>
  );
}
