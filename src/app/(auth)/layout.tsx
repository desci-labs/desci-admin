"use client";

import type { Metadata } from "next";

import "../globals.scss";
import Providers from "@/contexts/Providers";
import LayoutPanel from "@/components/custom/LayoutPanel";

const metadata: Metadata = {
  title: "Desci Nodes | Dashboard",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <LayoutPanel>{children}</LayoutPanel>
    </Providers>
  );
}
