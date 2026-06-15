"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const tools = [
    { name: "Image Resizer", href: "/tools/image-resizer" },
    { name: "PDF Compressor", href: "/tools/pdf-compressor" },
    { name: "Color Picker", href: "/tools/color-picker" },
    { name: "Base64 Encoder", href: "/tools/base64-encoder" },
    { name: "JSON Formatter", href: "/tools/json-formatter" },
    { name: "QR Generator", href: "/tools/qr-generator" },
  ];

  const support = [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Report Bug", href: "/report-bug" },
    { name: "Feature Request", href: "/feature-request" },
  ];

  const legal = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Use", href: "/terms" },
    { name: "Disclaimer", href: "/disclaimer" },
  ];

  return (
    <footer className="w-full bg-[#0B1221] border-t border-white/5">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-14">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-400 mb-5">
              Tools
            </h3>
            <ul className="space-y-3">
              {tools.map((tool) => (
                <li key={tool.name}>
                  <Link
                    href={tool.href}
                    className={`text-[13px] leading-relaxed transition-colors duration-200 ${
                      pathname === tool.href
                        ? "text-white font-medium"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-400 mb-5">
              Support
            </h3>
            <ul className="space-y-3">
              {support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`text-[13px] leading-relaxed transition-colors duration-200 ${
                      pathname === item.href
                        ? "text-white font-medium"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-400 mb-5">
              Legal
            </h3>
            <ul className="space-y-3">
              {legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`text-[13px] leading-relaxed transition-colors duration-200 ${
                      pathname === item.href
                        ? "text-white font-medium"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="h-px w-full bg-white/5 mb-7" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/tools-hub.png"
              alt="ToolsHub"
              width={180}
              height={54}
              className="h-8 w-auto opacity-90 transition-opacity group-hover:opacity-100"
            />
          </Link>

          <p className="text-[12px] text-gray-500 text-center">
            Copyright © {new Date().getFullYear()} MyToolsHub. All rights reserved.
          </p>

          <span className="text-[11px] text-gray-600 tracking-wide">Built for Speed</span>
        </div>
      </div>
    </footer>
  );
}
