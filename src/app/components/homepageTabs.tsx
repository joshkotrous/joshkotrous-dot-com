"use client";

import { useState } from "react";
import { cn } from "../lib/utils";
import Link from "next/link";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { IoLogoGithub } from "react-icons/io";
import { Post } from "../lib/post";

export default function HomepageTabs({ posts }: { posts: Post[] }) {
  const [activeTab, setActiveTab] = useState<
    "about" | "latest-posts" | "projects"
  >("about");

  return (
    <div className="w-full overflow-hidden">
      <div className="flex text-xs text-nowrap w-full">
        <div
          className={cn(
            "border border-t-0 border-l-0 border-primary p-2 px-8 hover:bg-primary/10 cursor-pointer",
            activeTab === "about" && "bg-primary/10"
          )}
          onClick={() => setActiveTab("about")}
        >
          <p>About</p>
        </div>
        <div
          className={cn(
            "border border-t-0 border-l-0 border-primary p-2 px-8 hover:bg-primary/10 cursor-pointer",
            activeTab === "latest-posts" && "bg-primary/10"
          )}
          onClick={() => setActiveTab("latest-posts")}
        >
          <p>Latest Posts</p>
        </div>
        <div
          className={cn(
            "border border-t-0 border-l-0 border-primary p-2 px-8 hover:bg-primary/10 cursor-pointer",
            activeTab === "projects" && "bg-primary/10"
          )}
          onClick={() => setActiveTab("projects")}
        >
          <p>Projects</p>
        </div>
        <div className="border border-t-0 border-l-0 border-r-0 border-primary p-2 px-8 flex-1"></div>
      </div>
      <div className="p-4">
        {activeTab === "about" && <About />}
        {activeTab === "latest-posts" && <LatestPosts posts={posts} />}
        {activeTab === "projects" && <Projects />}
      </div>
    </div>
  );
}

function About() {
  return (
    <div>
      <p>
        Hi, I'm Josh! Thanks for checking out my site. Currently I'm building
        next generation application security at{" "}
        <Link className="underline" href="https://pensarai.com">
          Pensar
        </Link>
        . In my free time I like to hack on open-source side projects, act as a
        technical advisor for startups, and write about my experiences.
        <br />
        <br />
        You can find me on:
      </p>

      <div className="flex gap-2 text-2xl pt-2">
        <Link target="_blank" href="https://www.x.com/kotro___">
          <FaXTwitter />
        </Link>
        <Link target="_blank" href="https://www.linkedin.com/in/joshkotrous">
          <FaLinkedin />
        </Link>
        <Link target="_blank" href="https://www.github.com/joshkotrous">
          <IoLogoGithub />
        </Link>
      </div>
    </div>
  );
}

function LatestPosts({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-1">
      {posts.map((i) => (
        <Link
          href={`/blog/${i.slug}`}
          key={i.title}
          className="flex items-center gap-2 text-nowrap"
        >
          <p>{i.date.toString()}</p>
          <p className="truncate">{i.title}</p>
        </Link>
      ))}
    </div>
  );
}

function Projects() {
  const projects = [
    {
      name: "Pensar",
      url: "https://pensarai.app",
      description: "Next generation application security",
      image: "/pensar.png",
    },
    {
      name: "Tome",
      url: "https://tomedb.dev",
      description: "AI-native database client.",
      image: "/tome.png",
    },
    {
      name: "SimplCMS",
      url: "https://simplcms.dev",
      description: "A simple CMS for easily creating content driven sites",
      image: "/simplcms.png",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {projects.map((i) => (
        <Link
          target="_blank"
          href={i.url}
          key={i.name}
          className="border border-primary px-3 py-2 space-y-2 hover:bg-primary/10 cursor-pointer transition-all"
        >
          <p>{i.name}</p>
          <p className="text-xs">{i.description}</p>
        </Link>
      ))}
    </div>
  );
}
