"use client";
import Link from "next/link";
import React from "react";
import { themes, useTheme } from "../themeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import CustomThemeEditor from "./CustomThemeEditor";

const Navigation = () => {
  const { theme } = useTheme();
  if (!theme) {
    return null;
  }
  return (
    <div className="p-2 sm:p-4 flex gap-2 sm:gap-4 justify-between xl:justify-center w-screen items-center sticky top-0 select-none">
      <Link
        href="/"
        className="xl:absolute xl:left-0 xl:pl-4 flex flex-col md:block hover:opacity-80 transition-opacity"
      >
        <span className="bloom-text text-sm sm:text-base text-header">
          Josh Kotrous
        </span>
        <span className="text-[8px] sm:text-[10px] md:text-base">
          {" "}
          {
            // eslint-disable-next-line react/jsx-no-comment-textnodes
          }
          // CTO @ Pensar
        </span>
      </Link>
      <ul className="flex gap-1.5 sm:gap-2 items-center text-sm sm:text-base">
        <ThemeDropdown />
        <Link href="/">
          <li className="hover:underline cursor-pointer bloom-interactive">
            Home
          </li>
        </Link>
        <Link href="/blog">
          <li className="hover:underline cursor-pointer bloom-interactive">
            Blog
          </li>
        </Link>
        {/* <li>Projects</li> */}
      </ul>
      {/* <div className="flex gap-2 xl:absolute right-4 text-xl">
        <Link target="_blank" href="https://www.x.com/kotro___">
          <FaXTwitter />
        </Link>
        <Link target="_blank" href="https://www.linkedin.com/in/joshkotrous">
          <FaLinkedin />
        </Link>
        <Link target="_blank" href="https://www.github.com/joshkotrous">
          <IoLogoGithub />
        </Link>
      </div> */}
    </div>
  );
};

function ThemeDropdown() {
  const { theme, handleThemeChange } = useTheme();

  // Filter out the custom theme - it will have its own submenu with the editor
  const presetThemes = themes.filter((t) => t.name !== "custom");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none cursor-pointer flex items-center gap-1 px-1.5 py-0.5 border border-[var(--color-primary)] bg-[#121212] hover:bg-primary/10 transition-colors text-[12px] sm:text-xs mx-2">
        <span className="text-header">{theme?.label || "Theme"}</span>
        <svg
          className="size-2.5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {presetThemes.map((option) => (
          <DropdownMenuItem
            onClick={() => handleThemeChange(option.name)}
            key={option.name}
          >
            <p className={option.labelColor}>{option.label}</p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <p className="!text-zinc-400">Custom</p>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="p-0">
            <CustomThemeEditor />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Navigation;
