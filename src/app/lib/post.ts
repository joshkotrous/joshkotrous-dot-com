import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Define a type for the post data
export type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  category?: string;
  content: string;
  image?: string;
};
const postsDirectory = path.join(process.cwd(), "posts");

export function getAllPosts() {
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
  const fullPath = path.join(postsDirectory, `${slug.toLocaleLowerCase()}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  return {
    slug,
    title: data.title || "",
    date: data.date || "",
    description: data.description || "",
    category: data.category || "",
    ...data,
    content,
  };
}
