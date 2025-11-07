"use client";

import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import { useEffect } from "react";
import Head from "next/head";

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Prevent Ctrl + scroll zoom on desktop
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) e.preventDefault();
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <ClerkProvider>
      <>
        {/* ✅ Ensures <meta> tag is read properly by mobile browsers */}
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
        </Head>

        <html lang="en">
          <body className={outfit.className}>
            <Provider>{children}</Provider>
          </body>
        </html>
      </>
    </ClerkProvider>
  );
}
