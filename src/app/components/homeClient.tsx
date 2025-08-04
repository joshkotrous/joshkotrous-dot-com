"use client";

import HomepageTabs from "./homepageTabs";
import Terminal from "./terminal";
import { Post } from "../lib/post";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, Loader } from "lucide-react";
import Cookies from "js-cookie";
import { Loading as LoadingComponent } from "./loading";

export default function HomeClient({ posts }: { posts: Post[] }) {
  const [showContent, setShowContent] = useState(false);
  const [hasCheckedCookie, setHasCheckedCookie] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);

  // Check cookie after hydration
  useEffect(() => {
    const hasVisited = Cookies.get("hasVisitedHome") === "true";
    setSkipAnimation(hasVisited);
    setHasCheckedCookie(true);
  }, []);

  useEffect(() => {
    if (!skipAnimation) {
      const timer = setTimeout(() => {
        setShowContent(true);
        // Set cookie that expires in 30 minutes
        Cookies.set("hasVisitedHome", "true", {
          expires: new Date(new Date().getTime() + 30 * 60 * 1000),
          sameSite: "strict",
        });
      }, 2300); // Adjusted to account for loading states total duration

      return () => clearTimeout(timer);
    }
  }, [skipAnimation]);

  // Don't render anything until we've checked the cookie
  if (!hasCheckedCookie) {
    return <LoadingComponent />;
  }

  // If already visited, render content immediately
  if (skipAnimation) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="border size-full border-green-500"
      >
        <div className="border-b border-green-500 h-96">
          <Terminal />
        </div>
        <HomepageTabs posts={posts} />
      </motion.div>
    );
  }

  // First visit - show animation
  return (
    <motion.div
      initial={{ width: "20rem", height: "10rem" }}
      animate={{ width: "100%", height: "100%" }}
      transition={{ duration: 0.5, delay: 2.5 }}
      className="border size-full border-green-500"
    >
      <AnimatePresence>{!showContent && <Loading />}</AnimatePresence>

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="w-full h-full"
          >
            <div className="border-b border-green-500 h-96">
              <Terminal />
            </div>
            <HomepageTabs posts={posts} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Loading() {
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const states = [
    {
      progress: 10,
      message: (
        <p className="flex items-center gap-2">
          <Loader className="size-3.5 animate-spin text-green-500" />
          Initializing...
        </p>
      ),
      interval: 300,
    },
    {
      progress: 50,
      message: (
        <p className="flex items-center gap-2">
          <Loader className="size-3.5 animate-spin text-green-500" />
          Spinning up server...
        </p>
      ),
      interval: 1000,
    },
    {
      progress: 75,
      message: (
        <p className="flex items-center gap-2">
          <Loader className="size-3.5 animate-spin text-green-500" />
          Loading terminal...
        </p>
      ),
      interval: 500,
    },
    {
      progress: 100,
      message: (
        <p className="flex items-center gap-2">
          Ready <Check className="size-3.5" />
        </p>
      ),
      interval: 500,
    },
  ];

  useEffect(() => {
    if (currentStateIndex >= states.length - 1) return;

    const timeout = setTimeout(() => {
      setCurrentStateIndex((prev) => prev + 1);
    }, states[currentStateIndex].interval);

    return () => clearTimeout(timeout);
  }, [currentStateIndex]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="text-sm size-full flex flex-col"
    >
      <div className="flex w-full border-b border-green-500">
        <div className="w-full border-green-500 p-2 text-xs px-4 flex justify-center border-r">
          <p>kotrous.dev</p>
        </div>
        <div className="w-fit border-green-500 p-2 text-xs px-4 flex justify-center">
          <p>0.0.0</p>
        </div>
      </div>

      <div className="p-4 size-full flex flex-col items-center justify-center gap-4 ">
        {states[currentStateIndex].message}
        <div className="w-64">
          <ProgressBar progress={states[currentStateIndex].progress} />
        </div>
      </div>
    </motion.div>
  );
}

function ProgressBar({
  progress,
  className = "",
}: {
  progress: number;
  className?: string;
}) {
  return (
    <div className={`w-full h-1 bg-green-500/20 overflow-hidden ${className}`}>
      <div
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        className="h-full bg-green-500 transition-all duration-500 ease-in-out"
      />
    </div>
  );
}
