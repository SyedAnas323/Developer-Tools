import Link from "next/link";
import { BLOG_POSTS } from "./blog-data";

export const metadata = {
  title: "Blog | MyToolsHub",
  description:
    "Read practical guides for PDF, image, and productivity tools on MyToolsHub.",
};

const posts = [
  {
    slug: "convert-image-to-pdf-and-word-to-pdf-online",
    title: "Convert Image to PDF and Word to PDF Online Free",
    excerpt:
      "Learn how to create clean PDF files from JPG, PNG, DOC, and DOCX files with free online PDF converters.",
    readTime: "9 min read",
  },
  {
    slug: "what-is-favicon-icon-and-how-to-use",
    title: "What Is a Favicon Icon? Types, Sizes, and How to Use It",
    excerpt:
      "Learn what a favicon icon is, where it appears, common favicon sizes, and how to generate a full icon pack.",
    readTime: "8 min read",
  },
  {
    slug: "best-free-online-tools-for-pdf-images-productivity",
    title: "Best Free Online Tools for PDF, Images, and Productivity",
    excerpt:
      "A practical guide to free online PDF tools, image tools, and productivity utilities for everyday work.",
    readTime: "7 min read",
  },
  {
    slug: "how-to-remove-background-from-image",
    title: "How to Remove Background from Image Online for Free",
    excerpt:
      "Cleanly remove image backgrounds for ecommerce, design, and social media using a fast browser-based workflow.",
    readTime: "7 min read",
  },
  {
    slug: "how-to-edit-pdf-online-free",
    title: "How to Edit PDF Online Free (Add Text Fast)",
    excerpt:
      "A practical method to add text and make quick PDF edits online without heavy desktop software.",
    readTime: "7 min read",
  },
  {
    slug: "how-to-generate-favicon-online",
    title: "How to Generate Favicon Online Free (Full Pack)",
    excerpt:
      "Create favicon.ico, Apple touch icon, Android icons, and manifest files in one downloadable package.",
    readTime: "6 min read",
  },
  {
    slug: "how-to-compress-images-online-free",
    title: "How to Compress Images Online Free for Web and Social",
    excerpt:
      "Reduce image file size for faster websites and quick sharing while keeping quality suitable for real use.",
    readTime: "6 min read",
  },
  {
    slug: "how-to-crop-image-online-free",
    title: "How to Crop Image Online Free with Exact Dimensions",
    excerpt:
      "Use ratio presets, manual dimensions, and live preview to crop images accurately in your browser.",
    readTime: "6 min read",
  },
  {
    slug: "how-to-resize-image-online",
    title: "How to Resize Image Online for Free — No Signup",
    excerpt:
      "A complete walkthrough to resize images for social, web, and forms while preserving visual quality.",
    readTime: "8 min read",
  },
  {
    slug: "how-to-count-words-online",
    title: "Free Online Word Counter — Count Words and Characters",
    excerpt:
      "Learn how to track word and character counts accurately for assignments, SEO, and social content.",
    readTime: "8 min read",
  },
  {
    slug: "strong-password-generator-guide",
    title: "How to Generate a Strong Password Online for Free",
    excerpt:
      "Build stronger account security with a practical password generation workflow and simple best practices.",
    readTime: "8 min read",
  },
  {
    slug: "how-to-compress-pdf-free",
    title: "How to Compress PDF Files Online for Free (No Signup)",
    excerpt:
      "Learn a simple step-by-step process to reduce PDF file size online without installing software.",
    readTime: "8 min read",
  },
  {
    slug: "how-to-merge-pdf-files",
    title: "How to Merge PDF Files Online for Free",
    excerpt:
      "Combine multiple PDF documents into one clean file with a fast and reliable online workflow.",
    readTime: "8 min read",
  },
  ...BLOG_POSTS,
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#0d0f14] px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">MyToolsHub Blog</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Guides That Save You Time</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
          Practical, no-fluff tutorials for everyday tasks like compressing, merging, and converting files online.
        </p>

        <div className="mt-10 grid gap-5">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-2xl border border-slate-800 bg-[#121622] p-6 transition hover:border-cyan-500/60"
            >
              <p className="text-xs font-medium text-slate-400">{post.readTime}</p>
              <h2 className="mt-2 text-xl font-semibold text-white">
                <Link href={`/blog/${post.slug}`} className="hover:text-cyan-300">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-5 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200"
              >
                Read article
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
