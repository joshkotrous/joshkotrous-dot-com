"use client";
import Link from "next/link";
import React from "react";
import { themes, useTheme } from "../themeProvider";
import { SquareTerminal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navigation = () => {
  const { theme } = useTheme();
  if (!theme) {
    return null;
  }
  return (
    <div className="p-4 flex gap-4 justify-between xl:justify-center w-screen items-center sticky top-0 select-none">
      <div className="xl:absolute xl:left-0 xl:pl-4 flex flex-col md:block">
        <span className="bloom-text">Josh Kotrous</span>
        <span className="text-[10px] md:text-base">
          {" "}
          {
            // eslint-disable-next-line react/jsx-no-comment-textnodes
          }
          // Founding Engineer @{" "}
          <Link
            href="https://pensarai.app"
            target="_blank"
            className="hover:underline"
          >
            Pensar
          </Link>
        </span>
      </div>
      <ul className="flex gap-2 items-center">
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
  const { handleThemeChange } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <SquareTerminal className="text-primary size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <p>Change Theme</p>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {themes.map((option) => (
              <DropdownMenuItem
                onClick={() =>
                  handleThemeChange(option.name as "green" | "amber" | "purple")
                }
                key={option.name}
              >
                <p className={option.labelColor}>{option.label}</p>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Navigation;
