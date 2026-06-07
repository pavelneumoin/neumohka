import type { Metadata } from "next";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({
  variable: "--font-ui",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

// Lora — variable serif с кириллицей и italic. Замена Fraunces, чтобы
// .serif-акценты («От Павла — учителю», «уроков») рендерились по-русски.
const lora = Lora({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Неумошка — готовые уроки от Павла Неумоина",
  description:
    "Подписка на готовые уроки математики и информатики 8–11 класс: презентации, рабочие листы, ответы. От учителя для учителей.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${lora.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          src="https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js"
          strategy="afterInteractive"
        />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
