import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { EVENT_DESCRIPTION, EVENT_TITLE } from "@/lib/event";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: EVENT_TITLE,
  description: EVENT_DESCRIPTION,
  openGraph: {
    title: EVENT_TITLE,
    description: EVENT_DESCRIPTION,
    type: "website",
    locale: "pt_BR",
    siteName: "Alpha Franchising",
    images: [{ url: "/hero-socios.jpg", width: 1080, height: 1080, alt: EVENT_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: EVENT_TITLE,
    description: EVENT_DESCRIPTION,
    images: ["/hero-socios.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-theme é trocado pelo script antes da hidratação; o default do HTML é dark.
    <html lang="pt-BR" data-theme="dark" className={plex.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
