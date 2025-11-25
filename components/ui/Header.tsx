"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Bell,
  Coins,
  Globe,
  Menu,
  Search,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n";
import { Link as LocalizedLink, usePathname, useRouter } from "@/navigation";


const navLinks = [
  { labelKey: "stays", href: "#stays" },
  { labelKey: "experiences", href: "#experiences" },
  { labelKey: "dining", href: "#dining" },
  { labelKey: "concierge", href: "#concierge" },
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
  const alternateLocale: Locale = locale === "en" ? "ro" : "en";
  const [currency, setCurrency] = useState<CurrencyCode>(currencyOptions[0].code);

  const handleLanguageChange = (nextLocale: Locale) => {
    setIsMenuOpen(false);

    if (nextLocale === locale || !pathname) {
      return;
    }

    router.replace(pathname, { locale: nextLocale });
  };

  const handleCurrencyChange = (nextCurrency: CurrencyCode) => {
    setCurrency(nextCurrency);
  };


  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/30 bg-white/90 backdrop-blur-lg">
      <div className="flex max-w-full items-center mx-20 justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <LocalizedLink href="/" aria-label="Go to homepage">
            <Image
              src="/logo-primary.png"
              alt="13 Travelro Dubai"
              width={80}
              height={42}
              className="transition hover:opacity-80"
            />
          </LocalizedLink>

        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative transition hover:text-primary-bright"
            >
              {t(`nav.${item.labelKey}`)}
              <span className="absolute inset-x-0 -bottom-2 hidden h-0.5 rounded-full bg-primary-bright/70 group-hover:block" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Search"
            className="text-primary-bright hover:bg-primary-bright/10"
          >
            <Search size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Notifications"
            className="text-primary-bright hover:bg-primary-bright/10"
          >
            <Bell size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Account"
            className="text-primary-bright hover:bg-primary-bright/10"
          >
            <User size={18} />
          </Button>
          <button
            type="button"
            aria-label={t("languageLabel")}
            className="hidden items-center gap-2 rounded-full border border-primary-bright/30 px-3 py-1 text-xs font-semibold tracking-wide text-primary-bright transition hover:bg-primary-bright/10 md:flex"
            onClick={() => handleLanguageChange(alternateLocale)}
          >
            <Globe size={16} />
            <span>{t(`languages.${locale}`)}</span>
          </button>
          <div className="hidden items-center gap-2 rounded-full border border-primary-bright/30 px-3 py-1 text-xs font-semibold tracking-wide text-primary-bright md:flex">
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
          <Button className="hidden rounded-full bg-primary-bright px-5 text-white shadow-sm hover:bg-primary-dark md:inline-flex">
            {t("planTrip")}
          </Button>
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
            <Button className="flex-[100%] rounded-full bg-primary-bright text-white hover:bg-primary-dark">
              {t("planTrip")}
            </Button>
            <button
              type="button"
              aria-label={t("languageLabel")}
              className="flex flex-1 min-w-[150px] items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              onClick={() => handleLanguageChange(alternateLocale)}
            >
              <Globe size={16} className="text-primary-bright" />
              <span>{t(`languages.${locale}`)}</span>
            </button>
            <div className="flex flex-1 min-w-[150px] items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2">
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
