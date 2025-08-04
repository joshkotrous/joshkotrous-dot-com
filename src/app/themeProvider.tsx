"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext({
  theme: null,
  isLoading: true,
  handleThemeChange: (theme: "green" | "amber") => {},
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

const themes = [
  {
    name: "green",
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
    config: {
      primary: "#fe9a00",
      border: "#fe9a00",
      background: "#121212",
      text: "#fe9a00",
      glow: "#fe9a00",
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
