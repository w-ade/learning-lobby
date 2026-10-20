import type { Metadata } from "next";
import { Inter, Geist, Newsreader } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-news", display: "swap" });
export const metadata: Metadata = { title: "learninglobby" };
export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${inter.variable} ${geist.variable} ${newsreader.variable}`} suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: "try{if(localStorage.getItem('ll-theme')==='dark')document.documentElement.classList.add('ll-dark')}catch(e){}" }} /></head><body>{children}</body></html>;
}
