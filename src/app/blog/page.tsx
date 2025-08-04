import React from "react";
import { getAllPosts } from "../lib/post";
import BlogClient from "../components/blogClient";

const Blog = async () => {
  const posts = getAllPosts();
  console.log(posts);

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen overflow-hidden">
      <main className="flex flex-col w-full  max-w-5xl gap-4 pb-20">
        <BlogClient posts={posts} />
      </main>
    </div>
  );
};

export default Blog;
