import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Architect AI Pro",
  description: "Senior Engineering Roadmap Generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 1. 'flex' allows the Sidebar and Main content to sit side-by-side.
          2. 'h-screen' and 'overflow-hidden' prevents the whole page from bouncing, 
             letting only the roadmap area scroll.
      */}
      <body className="antialiased flex h-screen w-full bg-[#030712] text-white overflow-hidden">
        <div className="hyper-bg" />

        {/* All content (Sidebar + Main Page) renders here */}
        {children}
      </body>
    </html>
  );
}