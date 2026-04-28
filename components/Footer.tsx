"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Tools list - apne tools ke hisab se update karo
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

  const socials = [
    {
      name: "Twitter",
      href: "https://twitter.com/yourtools",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      href: "https://github.com/yourtools",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Product Hunt",
      href: "https://producthunt.com/posts/yourtools",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13.563 11.063H8.438V7.312h5.125a1.875 1.875 0 110 3.75zm0 5.625H8.438v-3.75h5.125a1.875 1.875 0 110 3.75zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com/yourtools",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="w-full bg-[#0B1221] border-t border-white/5">
      {/* Top glow line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
        {/* 4 Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Column 1 — Tools */}
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

          {/* Column 2 — Support */}
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

          {/* Column 3 — Legal */}
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

          {/* Column 4 — Social */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-400 mb-5">
              Social
            </h3>
            <ul className="space-y-3">
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-2.5"
                  >
                    <span className="text-gray-500">{social.icon}</span>
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/5 mb-7" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left — Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </div>
            <span className="text-[13px] font-semibold text-white/70 group-hover:text-white transition-colors">
              MyToolsHub
            </span>
          </Link>

          {/* Center — Copyright */}
          <p className="text-[12px] text-gray-500 text-center">
            Copyright © {new Date().getFullYear()} MyToolsHub. All rights
            reserved.
          </p>

          {/* Right — Built tag */}
          <span className="text-[11px] text-gray-600 tracking-wide">
            Built for Speed ⚡
          </span>
        </div>
      </div>
    </footer>
  );
}
