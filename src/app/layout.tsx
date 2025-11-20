import { Inter } from "next/font/google";
import "./globals.css";

import ThemeContext from "./ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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
          <TooltipProvider delayDuration={200} skipDelayDuration={0}>
            <Toaster position="top-center" />
            {children}
          </TooltipProvider>
        </ThemeContext>
      </body>
    </html>
  );
}
