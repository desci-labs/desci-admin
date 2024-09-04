import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import Provider from "./Provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Desci Nodes | Admin",
  description: "",
};

// const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
