"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext({
  theme: null,
  isLoading: true,
  handleThemeChange: (theme: "green" | "amber" | "purple") => {},
});

type Theme = {
  name: string;
  config: {
    primary: string;
    border: string;
    background: string;
    text: string;
    glow: string;
  };
};

export const themes = [
  {
    name: "green",
    label: "Green",
    labelColor: "!text-green-500",
    config: {
      primary: "#22c55e",
      border: "#22c55e",
      background: "#121212",
      text: "#22c55e",
      glow: "#22c55e",
    },
  },
  {
    name: "amber",
    label: "Amber",
    labelColor: "!text-amber-500",
    config: {
      primary: "#fe9a00",
      border: "#fe9a00",
      background: "#121212",
      text: "#fe9a00",
      glow: "#fe9a00",
    },
  },
  {
    name: "purple",
    label: "Purple",
    labelColor: "!text-purple-500",
    config: {
      primary: "#8b5cf6",
      border: "#8b5cf6",
      background: "#121212",
      text: "#8b5cf6",
      glow: "#8b5cf6",
    },
  },
  {
    name: "blue",
    label: "Blue",
    labelColor: "!text-blue-500",
    config: {
      primary: "#3b82f6",
      border: "#3b82f6",
      background: "#121212",
      text: "#3b82f6",
    },
  },
  {
    name: "red",
    label: "Red",
    labelColor: "!text-red-500",
    config: {
      primary: "#ef4444",
      border: "#ef4444",
      background: "#121212",
      text: "#ef4444",
      glow: "#ef4444",
    },
  },
  {
    name: "cyan",
    label: "Cyan",
    labelColor: "!text-cyan-500",
    config: {
      primary: "#06b6d4",
      border: "#06b6d4",
      background: "#121212",
    },
  },
  {
    name: "pink",
    label: "Pink",
    labelColor: "!text-pink-500",
    config: {
      primary: "#ec4899",
      border: "#ec4899",
      background: "#121212",
      text: "#ec4899",
      glow: "#ec4899",
    },
  },
];

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const _theme = localStorage.getItem("theme");
    if (!_theme) {
      handleThemeChange("amber");
      setIsLoading(false);
      return;
    }
    setTheme(themes.find((theme) => theme.name === _theme) || themes[0]);
    setIsLoading(false);
  }, []);

  // Apply CSS variables when theme changes
  useEffect(() => {
    if (theme) {
      const root = document.documentElement;
      root.style.setProperty("--color-primary", theme.config.primary);
      root.style.setProperty("--color-border", theme.config.border);
      root.style.setProperty("--glow-color", theme.config.glow);
      root.style.setProperty("--color-background", theme.config.background);
      root.style.setProperty("--color-text", theme.config.text);
    }
  }, [theme]);

  function handleThemeChange(newTheme: "green" | "amber") {
    const _theme = themes.find((theme) => theme.name === newTheme);
    if (_theme) {
      setTheme(_theme);
      localStorage.setItem("theme", _theme.name);
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isLoading,
        handleThemeChange,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  if (!ThemeContext) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return useContext(ThemeContext);
};
