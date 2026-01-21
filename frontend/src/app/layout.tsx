import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Architect AI",
  description: "AI-Powered Project Roadmaps",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* The background div MUST be inside the body */}
        <div className="hyper-bg" />

        {/* All page content goes here */}
        {children}
      </body>
    </html>
  );
}