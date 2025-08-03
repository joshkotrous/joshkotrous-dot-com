"use client";

import { useEffect } from "react";

export default function CleanBloomEffect() {
  useEffect(() => {
    // Inject clean, minimal bloom styles
    const style = document.createElement("style");
    style.id = "clean-bloom-effect";
    style.textContent = `
      /* Clean bloom for text elements */
      .bloom-text {
        text-shadow: 
          0 0 4px currentColor,
          0 0 8px currentColor;
        filter: brightness(1.08);
        transition: all 0.2s ease;
      }

      /* Clean bloom for interactive elements */
      .bloom-interactive:hover {
        text-shadow: 
          0 0 6px currentColor,
          0 0 12px currentColor,
          0 0 18px currentColor;
        filter: brightness(1.12) contrast(1.05);
        transition: all 0.3s ease;
      }

      /* Clean bloom for borders */
      .bloom-border {
        box-shadow: 
          0 0 4px currentColor,
          0 0 8px rgba(255, 255, 255, 0.2);
        transition: box-shadow 0.2s ease;
      }

      /* Subtle backdrop bloom */
      .bloom-backdrop::before {
        content: '';
        position: absolute;
        inset: -8px;
        background: radial-gradient(
          circle at center,
          rgba(255, 255, 255, 0.05),
          transparent 60%
        );
        backdrop-filter: blur(2px);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: -1;
      }

      .bloom-backdrop:hover::before {
        opacity: 1;
      }

      /* Respect user preferences */
      @media (prefers-reduced-motion: reduce) {
        .bloom-text,
        .bloom-interactive,
        .bloom-border,
        .bloom-backdrop::before {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById("clean-bloom-effect");
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return null;
}
