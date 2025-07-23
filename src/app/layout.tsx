import { Inter } from "next/font/google";
import "./globals.css";

import ThemeContext from "./ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeContext>
          <Toaster position="top-center" />
          {children}
        </ThemeContext>
      </body>
    </html>
  );
}
