import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Cripa",
  description: "Cripa é um jogo de palavras criptografadas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>Cripa</title>
        <meta name="description" content="Cripa é um jogo de palavras criptografadas" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className="bg-custom-pink">
        {children}
      </body>
    </html>
  );
}
