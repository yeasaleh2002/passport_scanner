import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Passport scanner", description: "Read the MRZ from a passport photo" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
