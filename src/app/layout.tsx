import "./globals.css";
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import AuthProvider from "@/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Costar App",
  description: "Costar - Connect with mentors",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.g
        oogleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${montserrat.variable} font-sans bg-black text-white`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
