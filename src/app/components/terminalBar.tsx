"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import confetti from "canvas-confetti";
import { Fireworks } from "fireworks-js";
import { useTheme } from "../themeProvider";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalLine {
  content: string;
  isCommand?: boolean;
}

interface Command {
  description: string;
  execute: (args?: string) => string | Promise<string>;
}

type Commands = {
  [key: string]: Command;
};

// Convert hex color to hue value (0-360)
const hexToHue = (hex: string): number => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0;

  if (max === min) {
    h = 0;
  } else {
    const d = max - min;
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return h;
};

export default function TerminalBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentHue, setCurrentHue] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);

  const { theme, handleThemeChange } = useTheme();
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fireworksRef = useRef<HTMLDivElement>(null);

  // Update hue when theme changes
  useEffect(() => {
    if (theme?.config.primary) {
      setCurrentHue(hexToHue(theme.config.primary));
    }
  }, [theme?.config.primary]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  // Scroll to bottom when new lines added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const confettiDefaults = {
    colors: [theme?.config.primary],
    ticks: 100,
    particleCount: 100,
    scalar: 1.2,
    disableForReducedMotion: true,
    gravity: 1.2,
  };

  const commands: Commands = {
    help: {
      description: "Show available commands",
      execute: (): string => {
        const commandList: string = Object.entries(commands)
          .map(([cmd, info]) => `  ${cmd.padEnd(15)} - ${info.description}`)
          .join("\n");
        return `Available commands:\n${commandList}`;
      },
    },
    "set-theme": {
      description:
        "Change the theme (green, amber, purple, blue, red, cyan, pink, sunrise, evangelion, synthwave, neotokyo, custom)",
      execute: (args: string = "") => {
        handleThemeChange(args);
        return `Theme changed to ${args}`;
      },
    },
    github: {
      description: "Open GitHub profile",
      execute: () => {
        if (typeof window !== "undefined") {
          window.open("https://github.com/joshkotrous", "_blank");
        }
        return "Opening GitHub...";
      },
    },
    linkedin: {
      description: "Open LinkedIn profile",
      execute: () => {
        if (typeof window !== "undefined") {
          window.open("https://www.linkedin.com/in/joshkotrous/", "_blank");
        }
        return "Opening LinkedIn...";
      },
    },
    email: {
      description: "Email me!",
      execute: () => {
        if (typeof window !== "undefined") {
          window.location.href = "mailto:josh@kotrous.dev";
        }
        return "Opening email client...";
      },
    },
    resume: {
      description: "View my resume",
      execute: () => {
        if (typeof window !== "undefined") {
          window.open("/resume.pdf", "_blank");
        }
        return "Opening resume...";
      },
    },
    confetti: {
      description: "Celebrate with confetti!",
      execute: () => {
        confetti({
          ...confettiDefaults,
          origin: { y: 0.7 },
          spread: 90,
          startVelocity: 45,
          colors: [theme?.config.primary],
        });
        return "";
      },
    },
    fireworks: {
      description: "Display colorful fireworks",
      execute: async () => {
        if (!fireworksRef.current) return "";

        setShowFireworks(true);
        fireworksRef.current.innerHTML = "";

        const fw = new Fireworks(fireworksRef.current, {
          hue: {
            min: Math.max(0, currentHue - 10),
            max: Math.min(360, currentHue + 10),
          },
          delay: { min: 15, max: 30 },
          rocketsPoint: { min: 30, max: 70 },
          opacity: 0.8,
          acceleration: 1.05,
          friction: 0.97,
          gravity: 2,
          particles: 90,
          explosion: 6,
          autoresize: true,
          brightness: { min: 50, max: 80 },
          sound: { enabled: false },
          mouse: { click: false, move: false, max: 1 },
        });

        fw.start();

        setTimeout(() => {
          fw.stop();
          setShowFireworks(false);
        }, 5000);

        return "";
      },
    },
    echo: {
      description: "Echo back your text",
      execute: (args: string = "") => args || "Echo what?",
    },
    clear: {
      description: "Clear the terminal",
      execute: () => {
        setLines([]);
        return "";
      },
    },
  };

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();

    setLines((prev) => [
      ...prev,
      { content: `$ ${trimmedCmd}`, isCommand: true },
    ]);

    if (trimmedCmd) {
      const [command, ...args] = trimmedCmd.split(" ");
      const commandFn = commands[command as keyof typeof commands];

      if (commandFn) {
        const result = await commandFn.execute(args.join(" "));
        if (result) {
          setLines((prev) => [...prev, { content: result }]);
        }
      } else {
        setLines((prev) => [
          ...prev,
          {
            content: `Command not found: ${command}. Type 'help' for available commands.`,
          },
        ]);
      }

      setCommandHistory((prev) => [trimmedCmd, ...prev]);
    }

    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      void handleCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Escape") {
      setIsExpanded(false);
    }
  };

  return (
    <>
      {/* Fireworks container */}
      <div
        ref={fireworksRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 9999,
          display: showFireworks ? "block" : "none",
        }}
      />

      {/* Terminal Bar */}
      <div className="border-t border-[var(--color-primary)] bg-background">
        {/* Collapsed Header - Always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-1.5 px-2 sm:p-2 sm:px-4 hover:bg-primary/10 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <span className="text-primary">{">"}</span>
            <span>terminal</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="size-3 sm:size-4 text-primary" />
          ) : (
            <ChevronUp className="size-3 sm:size-4 text-primary" />
          )}
        </button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-t border-[var(--color-primary)]">
                <div
                  ref={terminalRef}
                  className="h-32 sm:h-48 overflow-y-auto p-1.5 sm:p-2 font-mono text-xs sm:text-sm"
                  onClick={() => inputRef.current?.focus()}
                >
                  {/* Initial help hint */}
                  {lines.length === 0 && (
                    <p className="opacity-50 mb-2">
                      Type &apos;help&apos; for available commands
                    </p>
                  )}

                  {/* Command output */}
                  {lines.map((line, i) => (
                    <p
                      key={i}
                      className={`whitespace-pre-wrap break-words ${
                        line.isCommand ? "text-primary" : ""
                      }`}
                    >
                      {line.content}
                    </p>
                  ))}

                  {/* Input line */}
                  <div className="flex items-start">
                    <span className="text-primary mr-2">$</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 bg-transparent outline-none font-mono text-primary"
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
