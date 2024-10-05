"use client";
import { useState } from "react";
import React from "react";
import { FaLink } from "react-icons/fa6";

const CopyToClipboard: React.FC<{ url: string }> = ({ url }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      // Optional: Reset the "copied" state after a few seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <>
      <FaLink className="cursor-pointer" onClick={copyToClipboard} />
      {copied && (
        <div className="font-inter text-base">Link copied to clipboard</div>
      )}
    </>
  );
};

export default CopyToClipboard;
