import Link from "next/link";

export const metadata = {
  title: "How to Compress Images Online Free for Web and Social | MyToolsHub",
  description:
    "Reduce image file size online for free without losing quality. Step-by-step guide for faster website and social uploads.",
};

export default function HowToCompressImagesPage() {
  return (
    <main className="min-h-screen bg-[#0d0f14] px-4 py-12 text-slate-100">
      <article className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Image Guide</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
          How to Compress Images Online Free for Web and Social
        </h1>
        <p className="mt-6 text-sm leading-8 text-slate-300">
          Heavy images are one of the biggest reasons websites load slowly. They also create upload errors for
          email, portals, and social platforms. A good compression workflow helps you keep quality while reducing
          file size.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Step-by-step method</h2>
        <p className="mt-4 text-sm leading-8 text-slate-300">
          Open{" "}
          <Link href="/tools/image-compressor" className="text-cyan-300 underline hover:text-cyan-200">
            /tools/image-compressor
          </Link>
          , upload JPG/PNG/WebP, run compression, compare output size, and download the optimized image.
        </p>
        <p className="mt-4 text-sm leading-8 text-slate-300">
          For complete optimization, resize first using{" "}
          <Link href="/tools/image-resizer" className="text-cyan-300 underline hover:text-cyan-200">
            Image Resizer
          </Link>{" "}
          and then compress for best speed-quality balance.
        </p>
      </article>
    </main>
  );
}

