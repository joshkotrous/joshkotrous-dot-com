"use client";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-lg font-mono">
        <span className="after:content-['.'] after:inline-block after:w-[1ch] after:animate-[ellipsis_1s_steps(4,end)_infinite]">
          &nbsp;
        </span>
      </div>
    </div>
  );
}
