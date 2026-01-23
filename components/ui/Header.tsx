"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import {
  Coins,
  Globe,
  Menu,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n";
import { Link as LocalizedLink, usePathname, useRouter } from "@/navigation";


const navLinks = [
  { labelKey: "experiences", href: "#experiences" },
];

const currencyOptions = [
  { code: "AED", labelKey: "aed" },
  { code: "USD", labelKey: "usd" },
  { code: "EUR", labelKey: "eur" },
  { code: "RON", labelKey: "ron" },
];
type CurrencyCode = (typeof currencyOptions)[number]["code"];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("Header");
  const searchT = useTranslations("Search");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ tourId?: string }>();
  const searchParams = useSearchParams();
  const preservedQuery = useMemo(() => {
    const entries = Array.from(searchParams.entries());
    if (entries.length === 0) {
      return undefined;
    }
    return Object.fromEntries(entries);
  }, [searchParams]);
  const alternateLocale: Locale = locale === "en" ? "ro" : "en";
  const [currency, setCurrency] = useState<CurrencyCode>(currencyOptions[0].code);

  const handleLanguageChange = (nextLocale: Locale) => {
    setIsMenuOpen(false);

    if (nextLocale === locale || !pathname) {
      return;
    }

    if (pathname === "/services/[tourId]") {
      const tourId = params?.tourId;
      if (!tourId) {
        return;
      }

      router.replace(
        { pathname, params: { tourId }, query: preservedQuery },
        { locale: nextLocale },
      );
      return;
    }

    router.replace(
      preservedQuery ? { pathname, query: preservedQuery } : pathname,
      { locale: nextLocale },
    );
  };

  const handleCurrencyChange = (nextCurrency: CurrencyCode) => {
    setCurrency(nextCurrency);
  };


  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/30 bg-white/90 backdrop-blur-lg lg:relative lg:border-b-0 lg:bg-white/80 lg:shadow-[0_18px_40px_-30px_rgba(15,23,42,0.55)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden lg:block"
      >
        <div className="absolute -left-24 -top-16 h-40 w-80 rounded-full bg-[radial-gradient(circle,_rgba(245,0,52,0.18)_0%,_rgba(245,0,52,0)_70%)] blur-2xl" />
        <div className="absolute right-0 top-0 h-32 w-72 rounded-full bg-[radial-gradient(circle,_rgba(174,255,2,0.2)_0%,_rgba(174,255,2,0)_70%)] blur-2xl" />
        <div className="absolute inset-x-12 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-bright/40 to-transparent" />
      </div>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
        <div className="flex items-center gap-3">
          <LocalizedLink
            href="/"
            aria-label="Go to homepage"
            className="flex items-center rounded-full bg-white/80 px-2 py-1 ring-1 ring-black/5 transition hover:shadow-md lg:bg-white/90 lg:px-3"
          >
            <Image
              src="/logo-primary.png"
              alt="13 Travelro Dubai"
              width={80}
              height={42}
              className="transition hover:opacity-80 lg:drop-shadow-[0_12px_22px_rgba(15,23,42,0.25)]"
            />
          </LocalizedLink>
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-white/70 bg-white/80 px-2 py-1 text-sm font-semibold text-slate-700 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.5)] lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative rounded-full px-4 py-2 transition hover:bg-primary-bright/10 hover:text-primary-bright"
            >
              {t(`nav.${item.labelKey}`)}
              <span className="absolute inset-x-3 -bottom-1 hidden h-0.5 rounded-full bg-primary-bright/70 group-hover:block" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 lg:rounded-full lg:border lg:border-white/70 lg:bg-white/80 lg:px-2 lg:py-1 lg:shadow-[0_12px_30px_-22px_rgba(15,23,42,0.5)]">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Account"
            className="text-primary-bright hover:bg-primary-bright/10"
          >
            <User size={18} />
          </Button>
          <span className="hidden h-6 w-px bg-slate-200/80 lg:block" />
          <button
            type="button"
            aria-label={t("languageLabel")}
            className="hidden items-center gap-2 rounded-full border border-primary-bright/30 px-3 py-2 text-xs font-semibold tracking-wide text-primary-bright transition hover:bg-primary-bright/10 md:flex"
            onClick={() => handleLanguageChange(alternateLocale)}
          >
            <Globe size={16} />
            <span>{t(`languages.${locale}`)}</span>
          </button>
          <div className="hidden items-center gap-2 rounded-full border border-primary-bright/30 px-3 py-2 text-xs font-semibold tracking-wide text-primary-bright md:flex">
            <Coins size={16} />
            <select
              aria-label={searchT("currencyLabel")}
              value={currency}
              onChange={(event) => handleCurrencyChange(event.target.value as CurrencyCode)}
              className="bg-transparent text-primary-bright outline-none cursor-pointer"
            >
              {currencyOptions.map(({ code, labelKey }) => (
                <option key={code} value={code} className="text-slate-900">
                  {searchT(`currencies.${labelKey}`)}
                </option>
              ))}
            </select>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle navigation"
            className="lg:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="border-t border-white/20 bg-white/95 px-4 py-4 shadow-lg lg:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium text-slate-700">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 hover:bg-primary-bright/10"
                onClick={() => setIsMenuOpen(false)}
              >
                {t(`nav.${item.labelKey}`)}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              aria-label={t("languageLabel")}
              className="flex flex-1 min-w-[150px] items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600"
              onClick={() => handleLanguageChange(alternateLocale)}
            >
              <Globe size={16} className="text-primary-bright" />
              <span>{t(`languages.${locale}`)}</span>
            </button>
            <div className="flex flex-1 min-w-[150px] items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3">
              <Coins size={16} className="text-primary-bright" />
              <select
                aria-label={searchT("currencyLabel")}
                value={currency}
                onChange={(event) => handleCurrencyChange(event.target.value as CurrencyCode)}
                className="flex-1 bg-transparent text-sm font-semibold text-slate-600 outline-none"
              >
                {currencyOptions.map(({ code, labelKey }) => (
                  <option key={code} value={code}>
                    {searchT(`currencies.${labelKey}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
