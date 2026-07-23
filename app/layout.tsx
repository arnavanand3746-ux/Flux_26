import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ParachuteMan } from "@/components/ui/parachute-man";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FLUX | Built for Students.",
  description: "A high-energy hackathon experience where developers, designers, founders, and problem-solvers come together to build real products.",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-mlh-yellow selection:text-black">
        <Navbar />
        <ParachuteMan />
        <main className="flex-grow pt-24 relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
