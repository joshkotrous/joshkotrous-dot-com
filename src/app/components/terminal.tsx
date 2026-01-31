"use client";
import { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import { Fireworks } from "fireworks-js";
import { useTheme } from "../themeProvider";
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
  // Remove the # if present
  hex = hex.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Find min and max values
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0;

  if (max === min) {
    h = 0; // achromatic
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

export default function Terminal() {
  const [input, setInput] = useState("");

  const { theme } = useTheme();
  const { handleThemeChange } = useTheme();
  const [currentHue, setCurrentHue] = useState(0);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fireworksRef = useRef<HTMLDivElement>(null);
  const [showFireworks, setShowFireworks] = useState(false);

  // Update hue when theme changes
  useEffect(() => {
    if (theme?.config.primary) {
      setCurrentHue(hexToHue(theme.config.primary));
    }
  }, [theme?.config.primary]);

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
        "Change the theme (green, amber, purple, blue, red, cyan, pink, sunrise, evangelion, synthwave, neotokyo)",
      execute: (args: string = "") => {
        handleThemeChange(args);
        return `Theme changed to ${args}`;
      },
    },
    github: {
      description: "Open GitHub profile",
      execute: () => {
        if (window !== undefined) {
          window.open("https://github.com/joshkotrous", "_blank");
        }
        return "";
      },
    },
    linkedin: {
      description: "Open LinkedIn profile",
      execute: () => {
        if (window !== undefined) {
          window.open("https://www.linkedin.com/in/joshkotrous/", "_blank");
        }
        return "";
      },
    },
    email: {
      description: "Email me!",
      execute: () => {
        if (window !== undefined) {
          window.location.href = "mailto:josh@kotrous.dev";
        }
        return "";
      },
    },
    resume: {
      description: "View my resume",
      execute: () => {
        if (window !== undefined) {
          window.open("/resume.pdf", "_blank");
        }
        return "";
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
          colors: [theme?.config.primary], // bg-primary
        });
        return "";
      },
    },
    fireworks: {
      description: "Display colorful fireworks",
      execute: async () => {
        if (!fireworksRef.current) return "";

        // Show container via state
        setShowFireworks(true);

        // Clear any previous canvases inside the container
        fireworksRef.current.innerHTML = "";

        // Create and start fireworks
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

        // Run for 5 seconds then cleanup
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

  // Common confetti settings to match the green glow theme
  const confettiDefaults = {
    colors: [theme?.config.primary], // bg-primary
    ticks: 100,
    particleCount: 100,
    scalar: 1.2,
    disableForReducedMotion: true,
    gravity: 1.2,
  };

  const [lines, setLines] = useState<TerminalLine[]>([
    { content: "Available commands:" },
    ...Object.entries(commands).map(([cmd, info]) => ({
      content: `  ${cmd.padEnd(15)} - ${info.description}`,
    })),
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLocaleLowerCase();

    // Always add the command line, even if empty
    setLines((prev) => [
      ...prev,
      { content: `$ ${trimmedCmd}`, isCommand: true }, // Use original cmd to preserve spaces
    ]);

    // Only process command if it's not empty
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
          { content: `Command not found: ${command}` },
        ]);
      }

      // Only add non-empty commands to history
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
    }
  };

  useEffect(() => {
    // Focus input on mount and when clicking terminal
    inputRef.current?.focus();
  }, []);

  return (
    <>
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
      <div className="relative size-full text-sm">
        <div
          ref={terminalRef}
          className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="sticky top-0 border-b border-[var(--color-primary)] p-1 px-2 text-xs bg-background z-50 flex justify-between">
            <p>terminal</p>
            <Clock />
          </div>

          <div className="space-y-1 font-mono p-2 ">
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
            <div className="flex items-start">
              <span className="text-primary mr-2">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none font-mono text-primary"
                autoFocus
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <p>
      {time.toLocaleDateString()} {time.toLocaleTimeString()}
    </p>
  );
}
