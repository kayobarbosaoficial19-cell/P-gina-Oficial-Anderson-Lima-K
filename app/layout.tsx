import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Caveat } from "next/font/google";

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "700"],
  display: "swap",
});
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anderson Lima — Artista Sertanejo",
  description:
    "Shows, eventos e orçamentos com Anderson Lima, artista sertanejo da região de Assis — SP.",
  openGraph: {
    title: "Anderson Lima — Artista Sertanejo",
    description: "A voz que carrega o cheiro de terra molhada e o peso do coração partido.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${playfair.variable} ${dmSans.variable} ${caveat.variable} bg-[#080808] text-white antialiased overflow-x-hidden`}>
        {/* Grain texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[1] opacity-[0.032]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />
        <main className="relative z-[2]">{children}</main>
      </body>
    </html>
  );
}
