import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "InpromptiFy — AI Proficiency Assessment",
  description: "Measure how your team uses AI. Score prompting efficiency across 5 dimensions, identify skill gaps, and prove ROI on AI tools. Free for teams up to 25.",
  metadataBase: new URL("https://inpromptify.com"),
  openGraph: {
    title: "InpromptiFy — AI Proficiency Assessment",
    description: "Measure how your team uses AI. Score prompting efficiency, identify skill gaps, and prove ROI on AI tools.",
    url: "https://inpromptify.com",
    siteName: "InpromptiFy",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "InpromptiFy — AI Proficiency Assessment" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InpromptiFy — AI Proficiency Assessment",
    description: "Measure how your team uses AI. Score prompting efficiency, identify skill gaps, and prove ROI.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
