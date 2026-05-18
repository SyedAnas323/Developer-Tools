import Link from "next/link";

export const metadata = {
  title: "How to Crop Image Online Free with Exact Dimensions | MyToolsHub",
  description:
    "Learn how to crop image online free with aspect ratio presets, manual size input, and instant download workflow.",
};

export default function HowToCropImagePage() {
  return (
    <main className="min-h-screen bg-[#0d0f14] px-4 py-12 text-slate-100">
      <article className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Image Guide</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
          How to Crop Image Online Free with Exact Dimensions
        </h1>
        <p className="mt-6 text-sm leading-8 text-slate-300">
          Cropping helps you focus on the important part of an image and match platform-specific ratios like 1:1,
          16:9, or 4:3. A precise crop improves design consistency and visual clarity in posts, thumbnails, and banners.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">How to crop properly</h2>
        <p className="mt-4 text-sm leading-8 text-slate-300">
          Open{" "}
          <Link href="/tools/image-cropper" className="text-cyan-300 underline hover:text-cyan-200">
            /tools/image-cropper
          </Link>
          , upload your image, drag the crop box, use ratio presets, preview the result, then click crop and download.
        </p>
        <p className="mt-4 text-sm leading-8 text-slate-300">
          If you need smaller output size after cropping, use{" "}
          <Link href="/tools/image-compressor" className="text-cyan-300 underline hover:text-cyan-200">
            Image Compressor
          </Link>
          . If format conversion is required, use{" "}
          <Link href="/tools/image-format-converter" className="text-cyan-300 underline hover:text-cyan-200">
            Image Format Converter
          </Link>
          .
        </p>
      </article>
    </main>
  );
}

