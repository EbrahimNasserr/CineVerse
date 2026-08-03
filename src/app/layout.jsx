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
  title: "CineVerse — Cinematic Immersive Movie Booking",
  description:
    "Book your next cinematic escape. Watch trailers, explore films, and reserve seats.",
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
          <main className="max-w-7xl mx-auto py-20">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
