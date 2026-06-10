import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import {
  geistSans,
  geistMono,
  pixelSquare,
  pixelGrid,
  pixelCircle,
  pixelTriangle,
  pixelLine,
} from "@/app/lib/fonts";
import { StructuredData } from "@/app/components/StructuredData";
import "./globals.css";

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored === 'dark' || (!stored && prefersDark);
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export const viewport: Viewport = {
  themeColor: "#F3F3F3",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${pixelSquare.variable} ${pixelGrid.variable} ${pixelCircle.variable} ${pixelTriangle.variable} ${pixelLine.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <StructuredData />
      </head>
      <body className="bg-[#F3F3F3] dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 antialiased font-sans overflow-x-hidden">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
