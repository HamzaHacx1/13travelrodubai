"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";


const footerLinks = [
  {
    titleKey: "plan",
    links: [
      { key: "experiences", href: "#experiences" },
    ],
  },
  {
    titleKey: "company",
    links: [
      { key: "about", href: "#about" },
      { key: "journal", href: "#journal" },
      { key: "careers", href: "#careers" },
    ],
  },
  {
    titleKey: "support",
    links: [
      { key: "contact", href: "#contact" },
      { key: "faqs", href: "#faqs" },
      { key: "terms", href: "#terms" },
    ],
  },
];

const Footer = () => {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-white/10 bg-slate-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <p className="font-tiktok text-xs tracking-[0.4em] text-secondary">
              {t("eyebrow")}
            </p>
            <h3 className="max-w-lg font-funnel text-3xl">
              {t("title")}
            </h3>
            <p className="max-w-md text-sm text-white/70">
              {t("description")}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.titleKey}>
                <p className="font-semibold text-white">{t(`groups.${group.titleKey}.title`)}</p>
                <ul className="mt-3 space-y-2 text-sm text-white/70">
                  {group.links.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="transition hover:text-secondary"
                      >
                        {t(`groups.${group.titleKey}.links.${item.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright", { year: currentYear })}</p>
          <div className="flex gap-4">
            <Link href="#privacy" className="hover:text-secondary">
              {t("policies.privacy")}
            </Link>
            <Link href="#terms" className="hover:text-secondary">
              {t("policies.terms")}
            </Link>
            <Link href="#cookies" className="hover:text-secondary">
              {t("policies.cookies")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
