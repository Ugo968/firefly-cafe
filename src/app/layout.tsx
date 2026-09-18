import type { Metadata, Viewport } from "next";
import { Fraunces, Jost } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz", "SOFT", "WONK"],
});

const jost = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Firefly Café — Every great evening begins with a glow",
  description:
    "Firefly Café is Awka's most talked-about evening destination — smoky grills, signature jollof, handcrafted drinks and a room that glows. Reserve a table, order ahead, or celebrate with us at 18 Sir Andy Umeoji St., Awka.",
  keywords: [
    "Firefly Café",
    "Awka café",
    "Awka restaurant",
    "Anambra lounge",
    "restaurant Awka",
    "café Nigeria",
    "book table Awka",
    "food delivery Awka",
  ],
  openGraph: {
    title: "Firefly Café — Awka",
    description: "Every great evening begins with a glow. Reserve a table, browse the menu, order ahead.",
    siteName: "Firefly Café",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1C1410",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme bootstrap — runs before first paint so the saved mode never flashes.
            Default is the evening (dark) look; 'light' opts into the parchment day look. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('ff-theme')==='light'){document.documentElement.classList.add('light');}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${fraunces.variable} ${jost.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
