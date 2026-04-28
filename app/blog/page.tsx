import Link from "next/link";

export const metadata = {
  title: "Blog | MyToolsHub",
  description:
    "Read practical guides for PDF, image, and productivity tools on MyToolsHub.",
};

const posts = [
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
