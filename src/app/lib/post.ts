import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Define a type for the post data
export type Post = {
  slug: string;
  title: string;
  date: Date;
  description: string;
  category?: string;
  content: string;
  image?: string;
};
const postsDirectory = path.join(process.cwd(), "posts");

export function getAllPosts(): Post[] {
  const filenames = fs.readdirSync(postsDirectory);
  const posts: Post[] = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const slug = filename.replace(/\.md$/, ""); // Remove ".md"
    return {
      slug,
      title: data.title || "",
      date: data.date || "",
      description: data.description || "",
      category: data.category || "",
      ...data,
      content,
    };
  });
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const normalisedSlug = slug.replace(/\.mdx?$/i, "").toLowerCase();

  const mdPath = path.join(postsDirectory, `${normalisedSlug}.md`);
  const mdxPath = path.join(postsDirectory, `${normalisedSlug}.mdx`);
  const fullPath = fs.existsSync(mdPath) ? mdPath : mdxPath;

  if (!fs.existsSync(fullPath)) return null;

  const { data, content } = matter(fs.readFileSync(fullPath, "utf8"));

  if (!data.title) return null;

  let date = data.date ?? "";
  if (typeof date === "string" && /^\d{4}[-/]\d{2}[-/]\d{2}$/.test(date)) {
    date = date.replace(/\//g, "-"); // 2025/06/19 -> 2025-06-19
  }

  const image =
    typeof data.image === "string" && data.image.trim()
      ? data.image.trim()
      : undefined;

  return {
    slug: normalisedSlug,
    title: data.title,
    description: data.description ?? "",
    category: data.category ?? "",
    date,
    image,
    content,
  };
}
