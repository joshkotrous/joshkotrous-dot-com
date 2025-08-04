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

export default function Terminal() {
  const [input, setInput] = useState("");

  const { handleThemeChange } = useTheme();

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fireworksRef = useRef<HTMLDivElement>(null);
  const fireworksInstanceRef = useRef<Fireworks | null>(null);

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
      description: "Change the theme",
      execute: (args: string = "") => {
        handleThemeChange(args as "green" | "amber");
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
          colors: ["#22c55e"], // bg-primary
        });
        return "";
      },
    },
    fireworks: {
      description: "Display colorful fireworks",
      execute: async () => {
        if (!fireworksRef.current) return "";

        // Create new fireworks instance if it doesn't exist
        if (!fireworksInstanceRef.current) {
          fireworksInstanceRef.current = new Fireworks(fireworksRef.current, {
            hue: {
              min: 120, // Green hue
              max: 140,
            },
            delay: {
              min: 15,
              max: 30,
            },
            rocketsPoint: {
              min: 30,
              max: 70,
            },
            opacity: 0.8,
            acceleration: 1.05,
            friction: 0.97,
            gravity: 2,
            particles: 90,
            explosion: 6,
            autoresize: true,
            brightness: {
              min: 50,
              max: 80,
            },

            sound: {
              enabled: false,
            },
            mouse: {
              click: false,
              move: false,
              max: 1,
            },
          });
        }

        // Show container
        if (fireworksRef.current) {
          fireworksRef.current.style.display = "block";
        }

        // Start fireworks
        fireworksInstanceRef.current.start();

        // Run for 5 seconds
        setTimeout(() => {
          if (fireworksInstanceRef.current) {
            fireworksInstanceRef.current.stop();
            if (fireworksRef.current) {
              fireworksRef.current.style.display = "none";
            }
          }
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
    colors: ["#22c55e"], // bg-primary
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
    const trimmedCmd = cmd.trim();

    // Always add the command line, even if empty
    setLines((prev) => [
      ...prev,
      { content: `$ ${cmd}`, isCommand: true }, // Use original cmd to preserve spaces
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

  // Cleanup fireworks on unmount
  useEffect(() => {
    return () => {
      if (fireworksInstanceRef.current) {
        fireworksInstanceRef.current.stop();
      }
    };
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
          display: "none",
        }}
      />
      <div className="relative size-full text-sm">
        <div
          ref={terminalRef}
          className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="sticky top-0 border-b border-primary p-1 px-2 text-xs bg-background z-50 flex justify-between">
            <p>terminal</p>
            <Clock />
          </div>

          <div className="space-y-1 font-mono p-2">
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
