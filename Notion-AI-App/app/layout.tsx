import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Notion-AI",
  description: "Document NotionAI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Header />
          <div className="flex p-4 min-h-screen">
            <SideBar />
            <div className="flex-1 bg-gray-100 overflow-y-auto scrollbar-hide rounded-lg ml-2 p-4">
              {children}
            </div>
          </div>
          <Toaster position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}
