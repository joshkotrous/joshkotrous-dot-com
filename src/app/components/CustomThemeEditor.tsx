"use client";

import { useState, useEffect } from "react";
import { useTheme, CustomThemeColors } from "../themeProvider";

// Convert HSL to Hex (saturation and lightness fixed for vibrant colors)
function hslToHex(h: number, s: number = 100, l: number = 50): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Convert Hex to Hue (0-360)
function hexToHue(hex: string): number {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 0;

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;

  if (max !== min) {
    const d = max - min;
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return Math.round(h * 360);
}

interface ColorSliderProps {
  label: string;
  color: string;
  onChange: (hex: string) => void;
}

function ColorSlider({ label, color, onChange }: ColorSliderProps) {
  const [hue, setHue] = useState(hexToHue(color));

  useEffect(() => {
    setHue(hexToHue(color));
  }, [color]);

  const handleChange = (value: number) => {
    setHue(value);
    onChange(hslToHex(value));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs">{label}</span>
        <div
          className="w-6 h-6 rounded border border-[var(--color-primary)]"
          style={{ backgroundColor: color }}
        />
      </div>
      <input
        type="range"
        min="0"
        max="360"
        value={hue}
        onChange={(e) => handleChange(parseInt(e.target.value))}
        className="w-full h-3 rounded-lg cursor-pointer appearance-none"
        style={{
          background: `linear-gradient(to right, 
            hsl(0, 100%, 50%), 
            hsl(60, 100%, 50%), 
            hsl(120, 100%, 50%), 
            hsl(180, 100%, 50%), 
            hsl(240, 100%, 50%), 
            hsl(300, 100%, 50%), 
            hsl(360, 100%, 50%))`,
        }}
      />
    </div>
  );
}

export default function CustomThemeEditor() {
  const { applyCustomTheme, customColors } = useTheme();
  const [colors, setColors] = useState<CustomThemeColors>({
    primary: customColors?.primary || "#ffffff",
    shader: customColors?.shader || "#00ffff",
    header: customColors?.header || "#ff00ff",
  });

  useEffect(() => {
    if (customColors) {
      setColors(customColors);
    }
  }, [customColors]);

  const handleColorChange = (key: keyof CustomThemeColors, value: string) => {
    const newColors = { ...colors, [key]: value };
    setColors(newColors);
    applyCustomTheme(newColors);
  };

  return (
    <div className="p-3 space-y-4 min-w-[200px]">
      <p className="text-xs font-bold text-header">Custom Theme</p>
      <ColorSlider
        label="Primary (Text/Borders)"
        color={colors.primary}
        onChange={(hex) => handleColorChange("primary", hex)}
      />
      <ColorSlider
        label="Shader (Animations)"
        color={colors.shader}
        onChange={(hex) => handleColorChange("shader", hex)}
      />
      <ColorSlider
        label="Header (Titles)"
        color={colors.header}
        onChange={(hex) => handleColorChange("header", hex)}
      />
    </div>
  );
}
