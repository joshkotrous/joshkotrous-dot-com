"use client";

import { useState } from "react";
import Link from "next/link";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { IoLogoGithub } from "react-icons/io";
import ParticleCloud from "./ParticleCloud";
import SineWaveGrid from "./SineWaveGrid";

type ShaderType = "particles" | "sinewave";

const shaders: ShaderType[] = ["particles", "sinewave"];

function getRandomShader(): ShaderType {
  return shaders[Math.floor(Math.random() * shaders.length)];
}

export default function Hero() {
  const [activeShader, setActiveShader] = useState<ShaderType>(getRandomShader);
  const currentIndex = shaders.indexOf(activeShader);

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
      {/* Shader Section */}
      <div className="h-48 md:h-full relative overflow-visible">
        <div className="absolute inset-0 flex items-center justify-center">
          {activeShader === "particles" && (
            <ParticleCloud particleCount={5000} />
          )}
          {activeShader === "sinewave" && <SineWaveGrid />}
        </div>

        {/* Indicator dots */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-2">
          {shaders.map((shader, i) => (
            <button
              key={shader}
              onClick={() => setActiveShader(shader)}
              className={`size-2 rounded-full transition-colors border border-[var(--color-primary)] ${
                i === currentIndex ? "bg-primary" : "bg-transparent"
              }`}
              aria-label={`Switch to ${shader} shader`}
            />
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="px-2 md:p-6 flex flex-col justify-start md:justify-center space-y-4">
        <div className="space-y-3 text-sm md:text-base">
          <p className="text-header">
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
