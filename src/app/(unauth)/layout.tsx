import { Inter } from "next/font/google";
import "../globals.scss";

import ThemeContext from "../ThemeProvider";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
