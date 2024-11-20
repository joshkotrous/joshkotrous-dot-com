import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
// Define a type for the post data
type PostData = {
  title?: string;
  date?: string; // Assuming date is stored as a string in the frontmatter
  [key: string]: any; // Allow other properties
};

// Define a type for the post including the content and slug
type Post = {
  slug: string;
  content: string;
} & PostData;
const postsDirectory = path.join(process.cwd(), "posts");

export function getAllPosts() {
  const filenames = fs.readdirSync(postsDirectory);
  const posts: Post[] = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    // Ensure the resolved path is within the postsDirectory to prevent path traversal
    const resolvedPath = path.resolve(filePath);
    const postsDirPath = path.resolve(postsDirectory);
    if (!resolvedPath.startsWith(postsDirPath + path.sep) && resolvedPath !== postsDirPath) {
      throw new Error('Invalid filename: Path traversal detected');
    }
    const { data, content } = matter(fileContents);

    const slug = filename.replace(/\.md$/, ""); // Remove ".md"

    return {
      slug,
      ...data, // Extract frontmatter (e.g., title, date)
      content,
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()
  );
}

export async function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    ...data,
    contentHtml, // Use this in the component
  };
}
