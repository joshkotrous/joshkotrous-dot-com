"use client";

import Link from "next/link";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { IoLogoGithub } from "react-icons/io";
import ParticleCloud from "./ParticleCloud";

export default function Hero() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {/* Particle Cloud Section */}
      <div className="aspect-square md:aspect-auto md:h-80 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <ParticleCloud particleCount={5000} />
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6 flex flex-col justify-center space-y-4 md:h-80">
        <div className="space-y-3 text-sm md:text-base">
          <p>
            Building autonomous pentesting agents that find and fix
            vulnerabilities before attackers do.
          </p>
          <p className="opacity-70">
            Engineering leader and hacker at heart. Passionate about application
            security, AI agents, and building tools that make developers&apos;
            lives easier.
          </p>
        </div>

        <div className="flex gap-3 text-xl pt-2">
          <Link
            target="_blank"
            href="https://www.x.com/kotro___"
            className="hover:opacity-70 transition-opacity"
            aria-label="Twitter"
          >
            <FaXTwitter />
          </Link>
          <Link
            target="_blank"
            href="https://www.linkedin.com/in/joshkotrous"
            className="hover:opacity-70 transition-opacity"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </Link>
          <Link
            target="_blank"
            href="https://www.github.com/joshkotrous"
            className="hover:opacity-70 transition-opacity"
            aria-label="GitHub"
          >
            <IoLogoGithub />
          </Link>
        </div>
      </div>
    </div>
  );
}
