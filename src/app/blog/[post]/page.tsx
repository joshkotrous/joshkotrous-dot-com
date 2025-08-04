import Link from "next/link";
import React, { Suspense } from "react";
import { getPostBySlug } from "../../lib/post";
import { notFound } from "next/navigation";
import type { Post } from "@/app/lib/post";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import CopyToClipboard from "@/app/components/copyToClipboard";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Metadata } from "next";
import remarkGfm from "remark-gfm";

const customTheme = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...(oneDark['pre[class*="language-"]'] || {}),
    background: "#000000", // custom black background
  },
  'code[class*="language-"]': {
    ...(oneDark['code[class*="language-"]'] || {}),
    background: "#000000",
  },
};

// app/blog/[post]/generateMetadata.ts
export async function generateMetadata({
  params,
}: {
  params: Promise<{ post: string }>;
}): Promise<Metadata> {
  const { post: postSlug } = await params;
  const post: Post | null = await getPostBySlug(postSlug);

  if (!post) {
    return {
      title: "Post not found",
      description: "This post does not exist.",
    };
  }

  const imageUrl = post.image ?? "default-image.png";

  return {
    title: `Josh Kotrous | ${post.title}`,
    description: post.description,

    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://joshkotrous.com"
    ),

    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      images: [
        {
          url: `/images/${imageUrl}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [
        {
          url: `/images/${imageUrl}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

const PostPage = async ({ params }: { params: Promise<{ post: string }> }) => {
  const { post: postSlug } = await params;
  const post = await getPostBySlug(postSlug);

  if (!post) {
    return notFound();
  }

  return (
    <Suspense>
      <div className="flex flex-col items-center justify-items-center min-h-screen overflow-hidden">
        <main className="flex flex-col w-full max-w-5xl gap-4">
          <p className="text-zinc-500 cursor-default">
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>{" "}
            / {post.title}
          </p>
          <div>
            <h1 className="leading-none">{post.title}</h1>
            <p>{post.date.toLocaleString()}</p>
          </div>
          <p className="text-zinc-500 cursor-default">Share This Article</p>
          <div className="flex gap-2 text-2xl z-50">
            <Link
              href={`https://www.linkedin.com/shareArticle?mini=true&url=https://joshkotrous.com/blog/${postSlug}&title=${post.title}`}
              target="_blank"
            >
              <FaLinkedin />
            </Link>
            <Link
              href={`https://twitter.com/intent/tweet?url=https://joshkotrous.com/blog/${postSlug}`}
              target="_blank"
            >
              <FaXTwitter />
            </Link>
            <CopyToClipboard url={`https://joshkotrous.com/blog/${postSlug}`} />
          </div>
          <div className="content no-glow">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p({ ...props }) {
                  return (
                    <p className="text-zinc-300">
                      {props.children}
                      <br />
                      <br />
                    </p>
                  );
                },
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return match ? (
                    <SyntaxHighlighter language={match[1]} style={customTheme}>
                      {String(children)}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                table({ children, ...props }) {
                  return (
                    <div className="overflow-x-auto my-6">
                      <table
                        className="min-w-full border border-zinc-700 text-left text-zinc-300"
                        {...props}
                      >
                        {children}
                      </table>
                    </div>
                  );
                },
                thead({ children, ...props }) {
                  return (
                    <thead className="bg-zinc-900" {...props}>
                      {children}
                    </thead>
                  );
                },
                tbody({ children, ...props }) {
                  return <tbody {...props}>{children}</tbody>;
                },
                tr({ children, ...props }) {
                  return (
                    <tr className="border-b border-zinc-700" {...props}>
                      {children}
                    </tr>
                  );
                },
                th({ children, ...props }) {
                  return (
                    <th className="px-4 py-2 font-semibold" {...props}>
                      {children}
                    </th>
                  );
                },
                td({ children, ...props }) {
                  return (
                    <td className="px-4 py-2" {...props}>
                      {children}
                    </td>
                  );
                },
                ul({ children, ...props }) {
                  return (
                    <ul
                      className="list-disc pl-6 pb-4 text-zinc-300"
                      {...props}
                    >
                      {children}
                    </ul>
                  );
                },
                ol({ children, ...props }) {
                  return (
                    <ol
                      className="list-decimal list-inside pl-6 pb-4 text-zinc-300"
                      {...props}
                    >
                      {children}
                    </ol>
                  );
                },
                li({ children, ...props }) {
                  return (
                    <li
                      className="mb-2 pl-1 list-item marker:text-zinc-400"
                      {...props}
                    >
                      {children}
                    </li>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </main>
      </div>
    </Suspense>
  );
};

export default PostPage;
