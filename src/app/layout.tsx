import type { Metadata, Viewport } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import { site } from "@/content/site";
import { Cursor } from "@/components/ui/Cursor";
import { Grain } from "@/components/ui/Grain";
import { Preloader } from "@/components/ui/Preloader";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const title = `${site.name} — ${site.roles.join(" · ")}`;

export const metadata: Metadata = {
  title: { default: title, template: `%s — ${site.name}` },
  description: site.tagline,
  openGraph: { title, description: site.tagline, type: "website" },
  twitter: { card: "summary_large_image", title, description: site.tagline },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08080a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${grotesk.variable} antialiased`}>
      <body className="bg-ink text-ivory">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[120] focus:rounded-full focus:bg-ember focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-ink"
        >
          Skip to main content
        </a>

        <SmoothScroll>{children}</SmoothScroll>

        <Preloader />
        <Grain />
        <Cursor />
      </body>
    </html>
  );
}
