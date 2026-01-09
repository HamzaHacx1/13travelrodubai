import { hasLocale } from "next-intl";
import { defineRouting } from "next-intl/routing";
import { getRequestConfig } from "next-intl/server";


export const routing = defineRouting({
  locales: ["en", "ro"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/services/[tourId]": {
      en: "/services/[tourId]",
      ro: "/services/[tourId]",
    },
    "/services/museum-of-the-future": {
      en: "/services/museum-of-the-future",
      ro: "/services/museum-of-the-future",
    },
  },
});

export type Locale = (typeof routing.locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale =
    requestedLocale && hasLocale(routing.locales, requestedLocale)
      ? requestedLocale
      : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
