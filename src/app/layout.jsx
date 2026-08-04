import { Playfair_Display, Sora } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { LenisScroll } from "@/components/layout/LenisScroll";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "900"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://cineverse.com"),
  title: {
    default: "CineVerse | Immersive Movie Booking",
    template: "%s | CineVerse",
  },
  description:
    "Discover blockbuster movies, watch cinematic trailers, and book premium seats for your next unforgettable movie experience with CineVerse.",
  keywords: [
    "movie booking",
    "cinema tickets",
    "movie tickets",
    "showtimes",
    "CineVerse",
  ],
  authors: [{ name: "CineVerse" }],
  creator: "CineVerse",
  publisher: "CineVerse",
  applicationName: "CineVerse",
  icons: {
    icon: ["/favicon.ico", { url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.ico",
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "CineVerse | Immersive Movie Booking",
    description:
      "Discover blockbuster movies, watch cinematic trailers, and book premium seats for your next unforgettable movie experience with CineVerse.",
    url: "https://cineverse.com",
    siteName: "CineVerse",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "CineVerse movie booking platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CineVerse | Immersive Movie Booking",
    description:
      "Discover blockbuster movies, watch cinematic trailers, and book premium seats for your next unforgettable movie experience with CineVerse.",
    images: ["/logo.png"],
    creator: "@cineverse",
  },
  alternates: {
    canonical: "https://cineverse.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${sora.variable}`}>
      <body className="min-h-screen overflow-x-hidden bg-obsidian font-body text-on-surface antialiased">
        <Providers>
          <LenisScroll />
          <ScrollProgress />
          <CustomCursor />
          <Navbar />
          <main className="">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
