import type { Metadata } from "next";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SessionProvider } from "@/components/session-provider";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://neumoshka.ru"
  ),
  title: "Неумошка — готовые уроки от Павла Неумоина",
  description:
    "Готовые уроки математики и информатики для 8–11 классов: презентации и рабочие листы. Во время бета-тестирования каталог открыт бесплатно.",
  openGraph: {
    title: "Неумошка — готовые уроки от Павла Неумоина",
    description:
      "Готовые уроки математики и информатики для 8–11 классов: презентации и рабочие листы.",
    type: "website",
    locale: "ru_RU",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Неумошка — готовые уроки математики и информатики",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Неумошка — готовые уроки от Павла Неумоина",
    description:
      "Готовые уроки математики и информатики для 8–11 классов: презентации и рабочие листы.",
    images: ["/og.png"],
  },
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
        <SessionProvider>
          <a className="skip-link" href="#main-content">
            Перейти к содержанию
          </a>
          <SiteHeader />
          <main id="main-content" tabIndex={-1} className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </SessionProvider>
      </body>
    </html>
  );
}
