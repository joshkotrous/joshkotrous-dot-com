"use client";

import { useState } from "react";
import { cn } from "../lib/utils";
import Link from "next/link";
import { Post } from "../lib/post";

export default function HomepageTabs({ posts }: { posts: Post[] }) {
  const [activeTab, setActiveTab] = useState<
    "about" | "latest-posts" | "projects"
  >("about");

  return (
    <div className="w-full overflow-hidden">
      <div className="flex text-xs text-nowrap w-full border-b border-primary">
        <div
          className={cn(
            "p-2 px-8 hover:bg-primary/10 cursor-pointer border-r border-primary",
            activeTab === "about" && "bg-primary/10",
          )}
          onClick={() => setActiveTab("about")}
        >
          <p>About</p>
        </div>
        <div
          className={cn(
            "p-2 px-8 hover:bg-primary/10 cursor-pointer border-r border-primary",
            activeTab === "latest-posts" && "bg-primary/10",
          )}
          onClick={() => setActiveTab("latest-posts")}
        >
          <p>Latest Posts</p>
        </div>
        <div
          className={cn(
            "p-2 px-8 hover:bg-primary/10 cursor-pointer border-r border-primary",
            activeTab === "projects" && "bg-primary/10",
          )}
          onClick={() => setActiveTab("projects")}
        >
          <p>Projects</p>
        </div>
        <div className="p-2 px-8 flex-1"></div>
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
    <div className="space-y-4">
      <p>
        I&apos;m the CTO at{" "}
        <Link className="underline" href="https://pensarai.com">
          Pensar
        </Link>
        , where we&apos;re building autonomous pentesting agents that discover
        and remediate security vulnerabilities before attackers can exploit
        them.
      </p>
      <p>
        Outside of Pensar, I advise early-stage startups on technical strategy,
        contribute to open-source security tooling, and occasionally write about
        engineering leadership and AppSec.
      </p>
    </div>
  );
}

function LatestPosts({ posts }: { posts: Post[] }) {
  return (
    <div>
      {posts.map((post, index) => (
        <Link
          href={`/blog/${post.slug}`}
          key={post.title}
          className={cn(
            "flex items-center gap-2 text-nowrap p-2 -mx-2 transition-colors",
            index % 2 === 1 && "bg-primary/5",
            "hover:bg-primary/15",
          )}
        >
          <p className="text-sm opacity-70">{post.date.toString()}</p>
          <p className="truncate">{post.title}</p>
        </Link>
      ))}
    </div>
  );
}

function Projects() {
  const projects = [
    {
      name: "Apex",
      url: "https://github.com/pensarai/apex",
      description: "Open-source autonomous pentesting agent",
    },
    {
      name: "Pensar",
      url: "https://pensarai.app",
      description: "Next generation application security",
    },
    {
      name: "Tome",
      url: "https://tomedb.dev",
      description: "AI-native database client",
    },
    {
      name: "SimplCMS",
      url: "https://simplcms.dev",
      description: "A simple CMS for easily creating content driven sites",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {projects.map((i) => (
        <Link
          target="_blank"
          href={i.url}
          key={i.name}
          className="border border-primary px-3 py-2 space-y-2 hover:bg-primary/10 cursor-pointer transition-all"
        >
          <p>{i.name}</p>
          <p className="text-xs opacity-70">{i.description}</p>
        </Link>
      ))}
    </div>
  );
}
