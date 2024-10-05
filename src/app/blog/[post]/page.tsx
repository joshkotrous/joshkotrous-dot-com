import Link from "next/link";
import React from "react";
import { getPostBySlug } from "../../lib/post";
import { notFound } from "next/navigation";
import type { Post } from "@/app/components/blogClient";
import "./page.css";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import CopyToClipboard from "@/app/components/copyToClipboard";

export async function generateMetadata({
  params,
}: {
  params: { post: string };
}) {
  const post: Post = await getPostBySlug(params.post);

  if (!post) {
    return {
      title: "Post not found",
      description: "This post does not exist.",
    };
  }

  return {
    title: `Josh Kotrous | ${post.title}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://joshkotrous.io/blog/${params.post}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

const Post = async ({ params }: { params: { post: string } }) => {
  const post: Post = await getPostBySlug(params.post);

  if (!post) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen overflow-hidden px-4 py-24 md:py-20">
      <main className="flex flex-col w-full max-w-5xl gap-4">
        <p className="text-zinc-500 cursor-default">
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>{" "}
          / {post.title}
        </p>
        <div>
          <h1 className="leading-none">{post.title}</h1>
          <p>{post.date}</p>
        </div>
        <p className="text-zinc-500 cursor-default">Share</p>
        <div className="flex gap-2 text-2xl">
          <Link
            href={`https://www.linkedin.com/shareArticle?mini=true&url=https://joshkotrous.io/blog/${params.post}&title=${post.title}`}
            target="_blank"
          >
            <FaLinkedin />
          </Link>
          <Link
            href={`https://twitter.com/intent/tweet?url=https://joshkotrous.io/blog/${params.post}`}
            target="_blank"
          >
            <FaXTwitter />
          </Link>
          <CopyToClipboard url={`https://joshkotrous.io/blog/${params.post}`} />
        </div>
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </main>
    </div>
  );
};

export default Post;
