
// // 
// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

// // Ye Global Metadata hai
// export const metadata: Metadata = {
//   title: {
//     default: "MyToolsHub - Free Online Developer Tools",
//     template: "%s | MyToolsHub",
//   },
//   description: "Free online tools for developers and designers. Compress images, format JSON, generate QR codes, and more. Fast and secure.",
//   keywords: ["online tools", "developer tools", "image compressor", "json formatter", "web tools"],
//   authors: [{ name: "Syed Anas" }],
  
//   // Yahan Verification add hogi
//   verification: {
//     google: "4razs74pssDhzsttCA0hcOcB5iq38aGRqoHWz3UxHpE",
//   },

//   openGraph: {
//     type: "website",
//     locale: "en_US",
//     url: "https://developer-tools-uz59.vercel.app", // Yahan apna live link dalein
//     siteName: "MyToolsHub",
//     title: "MyToolsHub - Free Online Tools",
//     description: "Collection of free tools for daily tasks.",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "MyToolsHub",
//     description: "Free online tools for developers.",
//   },
//   robots: {
//     index: true,
//     follow: true,
//   },
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>{children}</body>
//     </html>
//   );
// }








// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import Script from "next/script";
// import "./globals.css";


// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: {
//     default: "MyToolsHub - Free Online Developer Tools",
//     template: "%s | MyToolsHub",
//   },
//   description:
//     "Free online tools for developers and designers. Compress images, format JSON, generate QR codes, and more. Fast and secure.",
//   keywords: ["online tools", "developer tools", "image compressor", "json formatter", "web tools"],
//   authors: [{ name: "Syed Anas" }],
//   verification: {
//     google: "4razs74pssDhzsttCA0hcOcB5iq38aGRqoHWz3UxHpE",
//   },
//   openGraph: {
//     type: "website",
//     locale: "en_US",
//     url: "https://developer-tools-uz59.vercel.app",
//     siteName: "MyToolsHub",
//     title: "MyToolsHub - Free Online Tools",
//     description: "Collection of free tools for daily tasks.",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "MyToolsHub",
//     description: "Free online tools for developers.",
//   },
//   robots: {
//     index: true,
//     follow: true,
//   },
// };

// // Helper component for the AdSense ad
// function AdSenseAd() {
//   return (
//     <div className="mx-auto my-8 w-full max-w-3xl text-center">
//       <ins
//         className="adsbygoogle block"
//         style={{ display: "block" }}
//         data-ad-layout="in-article"
//         data-ad-format="fluid"
//         data-ad-client="ca-pub-7392042763768709"
//         data-ad-slot="4225904862"
//       />
//       <Script id="adsense-init" strategy="afterInteractive">
//         {`(adsbygoogle = window.adsbygoogle || []).push({});`}
//       </Script>
//     </div>
//   );
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   // If children is a single element, we can wrap it in an array for easier injection
//   const childrenArray = Array.isArray(children) ? children : [children];

//   // Inject ad after the first element (or wherever you like)
//   const childrenWithAd = [
//     childrenArray[0],
//     <AdSenseAd key="adsense-ad" />,
//     ...childrenArray.slice(1),
//   ];

//   return (
//     <html lang="en">
//       <head>
//         {/* Global AdSense Script */}
//         <Script
//           id="adsense-global"
//           strategy="afterInteractive"
//           async
//           src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7392042763768709"
//           crossOrigin="anonymous"
//         />
//       </head>
//      <body className={`${inter.className} min-h-screen bg-gray-50 flex flex-col`}>
  
//   {/* ✅ FIX START */}
//   <main className="flex-1 w-full flex flex-col">
//     {childrenWithAd}
//   </main>
//   {/* ✅ FIX END */}

// </body>
//     </html>
//   );
// }




// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import Script from "next/script";
// import "./globals.css";
// import Footer from "@/components/Footer";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: {
//     default: "MyToolsHub - Free Online Developer Tools",
//     template: "%s | MyToolsHub",
//   },
//   description:
//     "Free online tools for developers and designers. Compress images, format JSON, generate QR codes, and more. Fast and secure.",
//   keywords: ["online tools", "developer tools", "image compressor", "json formatter", "web tools"],
//   authors: [{ name: "Syed Anas" }],
//   verification: {
//     google: "4razs74pssDhzsttCA0hcOcB5iq38aGRqoHWz3UxHpE",
//   },
//   openGraph: {
//     type: "website",
//     locale: "en_US",
//     url: "https://developer-tools-uz59.vercel.app",
//     siteName: "MyToolsHub",
//     title: "MyToolsHub - Free Online Tools",
//     description: "Collection of free tools for daily tasks.",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "MyToolsHub",
//     description: "Free online tools for developers.",
//   },
//   robots: {
//     index: true,
//     follow: true,
//   },
// };

// // Helper component for the AdSense ad
// function AdSenseAd() {
//   return (
//     <div className="mx-auto my-8 w-full max-w-3xl text-center">
//       <ins
//         className="adsbygoogle block"
//         style={{ display: "block" }}
//         data-ad-layout="in-article"
//         data-ad-format="fluid"
//         data-ad-client="ca-pub-7392042763768709"
//         data-ad-slot="4225904862"
//       />
//       <Script id="adsense-init" strategy="afterInteractive">
//         {`(adsbygoogle = window.adsbygoogle || []).push({});`}
//       </Script>
//     </div>
//   );
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   // If children is a single element, we can wrap it in an array for easier injection
//   const childrenArray = Array.isArray(children) ? children : [children];

//   // Inject ad after the first element (or wherever you like)
//   const childrenWithAd = [
//     childrenArray[0],
//     <AdSenseAd key="adsense-ad" />,
//     ...childrenArray.slice(1),
//   ];

//   return (
//     <html lang="en" className="bg-white">
//       <head>
//         {/* Global AdSense Script */}
//         <Script
//           id="adsense-global"
//           strategy="afterInteractive"
//           async
//           src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7392042763768709"
//           crossOrigin="anonymous"
//         />
//       </head>
//      <body className={`${inter.className} min-h-screen bg-gray-50 flex flex-col`}>
  
//   {/* ✅ FIX START */}
//   <main className="flex-1 w-full flex flex-col">
//     {childrenWithAd}
//   </main>
//   {/* ✅ FIX END */}

//   <Footer />

// </body>
//     </html>
//   );
// }






///////////////////////////////////////////////////////////////////////////////////

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "MyToolsHub - Free Online Developer Tools",
    template: "%s | MyToolsHub",
  },
  description:
    "Free online tools for developers and designers. Compress images, format JSON, generate QR codes, and more. Fast and secure.",
  keywords: ["online tools", "developer tools", "image compressor", "json formatter", "web tools"],
  authors: [{ name: "Syed Anas" }],
  verification: {
    google: "4razs74pssDhzsttCA0hcOcB5iq38aGRqoHWz3UxHpE",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://developer-tools-uz59.vercel.app",
    siteName: "MyToolsHub",
    title: "MyToolsHub - Free Online Tools",
    description: "Collection of free tools for daily tasks.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyToolsHub",
    description: "Free online tools for developers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Helper component for the AdSense ad
function AdSenseAd() {
  return (
    <div className="mx-auto my-8 w-full max-w-3xl text-center">
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-7392042763768709"
        data-ad-slot="4225904862"
      />
      <Script id="adsense-init" strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // If children is a single element, we can wrap it in an array for easier injection
  const childrenArray = Array.isArray(children) ? children : [children];

  // Inject ad after the first element (or wherever you like)
  const childrenWithAd = [
    childrenArray[0],
    <AdSenseAd key="adsense-ad" />,
    ...childrenArray.slice(1),
  ];

  return (
    <html lang="en" className="bg-white">
      <head>
        {/* Global AdSense Script */}
        <Script
          id="adsense-global"
          strategy="afterInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7392042763768709"
          crossOrigin="anonymous"
        />

        {/* Google Analytics gtag.js */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-ZH7M4V1VJM"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZH7M4V1VJM');
          `}
        </Script>
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50 flex flex-col`}>
        {/* ✅ FIX START */}
        <main className="flex-1 w-full flex flex-col">
          {childrenWithAd}
        </main>
        {/* ✅ FIX END */}
        <Footer />
      </body>
    </html>
  );
}