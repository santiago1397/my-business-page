import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./config";

function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

function parseAcceptLanguage(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  const first = header
    .split(",")[0]
    ?.split(";")[0]
    ?.trim()
    .slice(0, 2)
    .toLowerCase();
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const headerLocale = parseAcceptLanguage(headerStore.get("accept-language"));

  const locale: Locale = isLocale(cookieLocale)
    ? cookieLocale
    : headerLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
