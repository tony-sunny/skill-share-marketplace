import type { Metadata } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { UserProvider } from "../lib/user-context";
import { UserInfoNav } from "../lib/user-info-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skill Share",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <UserProvider>
          <nav className="bg-gray-900 text-white px-4 py-3 flex gap-4 mb-8 items-center">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/skills" className="hover:underline">
              Skills
            </Link>
            <Link href="/tasks" className="hover:underline">
              Tasks
            </Link>
            <Link href="/offers" className="hover:underline">
              Offers
            </Link>
            <span className="ml-auto">
              <UserInfoNav />
            </span>
          </nav>
          {children}
          <Toaster richColors />
        </UserProvider>
      </body>
    </html>
  );
}
