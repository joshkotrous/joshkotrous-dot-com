"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "../lib/post";

const categories = ["Latest", "Engineering Leadership", "Career"];

const BlogClient: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const [category, setCategory] = useState("Latest");
  const [filteredPosts, setFilteredPosts] = useState(posts);

  useEffect(() => {
    if (category != "Latest") {
      const filtered = posts.filter((post) => {
        return post.category === category;
      });
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [category, posts]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2>Blog</h2>

        <ul className="flex gap-2 text-nowrap">
          {categories.map((item) => (
            <li
              key={item}
              className={`cursor-pointer bg-[var(--background)] hover:bg-green-400/25 p-1 transition-all ${
                item === category && "bg-green-400/25"
              }`}
              onClick={() => {
                setCategory(item);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <ul className="flex flex-col gap-4">
        {filteredPosts.map((post) => (
          <li key={post.title} className="flex flex-col">
            <div className="flex gap-4 items-end justify-between">
              <Link href={`/blog/${post.slug}`}>
                <h3 className="leading-7 md:leading-10 hover:underline cursor-pointer">
                  {post.title}
                </h3>
              </Link>

              <p className="text-nowrap">{post.date.toString()}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-zinc-400">{post.description}</p>
              <div className="bg-green-400/25 w-fit p-1 text-sm">
                {post.category}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogClient;
