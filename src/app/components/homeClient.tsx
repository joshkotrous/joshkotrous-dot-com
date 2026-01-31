"use client";

import HomepageTabs from "./homepageTabs";
import Hero from "./hero";
import TerminalBar from "./terminalBar";
import { Post } from "../lib/post";
import { motion } from "framer-motion";

export default function HomeClient({ posts }: { posts: Post[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="size-full"
    >
      <div className="flex flex-col h-full gap-4 sm:gap-6">
        <div className="sm:h-1/2 sm:min-h-0">
          <Hero />
        </div>
        <div className="flex-1 sm:h-1/2 border border-primary flex flex-col min-h-0">
          <div className="flex-1 overflow-auto">
            <HomepageTabs posts={posts} />
          </div>
          <TerminalBar />
        </div>
      </div>
    </motion.div>
  );
}
