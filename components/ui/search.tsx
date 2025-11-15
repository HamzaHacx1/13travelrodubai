"use client";

import {
  Clock5,
  Coins,
  Gem,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";


const options = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Fujairah",
  "Ras Al Khaimah",
  "Umm Al Quwain",
  "All Cities",
];

const currencyOptions = [
  { code: "AED", labelKey: "aed" },
  { code: "USD", labelKey: "usd" },
  { code: "EUR", labelKey: "eur" },
  { code: "RON", labelKey: "ron" },
];

const reasons = [
  {
    icon: ShieldCheck,
    key: "licensed",
  },
  {
    icon: Clock5,
    key: "flexible",
  },
  {
    icon: Sparkles,
    key: "moments",
  },
  {
    icon: Gem,
    key: "value",
  },
];

const SearchSection = () => {
  const t = useTranslations("Search");
  const [city, setCity] = useState("");
  const [activity, setActivity] = useState("");
  const [currency, setCurrency] = useState(currencyOptions[0].code);


  return (
    <section className="mt-8 sm:mt-12 lg:mt-16 rounded-3xl bg-white/5 p-4 sm:p-6 shadow-lg ring-1 ring-white/10 backdrop-blur">
      <div className="flex flex-col gap-5">
        <div className="flex flex-1 flex-col gap-5 rounded-3xl bg-white p-5 sm:p-7 shadow-lg">
          <p className="font-tiktok text-xs tracking-[0.4em] text-primary-bright">
            {t("eyebrow")}
          </p>
          <h2 className="font-funnel text-2xl text-foreground">
            {t("headline")}
          </h2>
          <p className="text-sm text-slate-500">
            {t("description")}
          </p>
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-5 py-4">
                <MapPin className="text-primary-bright" size={18} />
                <select
                  title={t("cityLabel")}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent text-base text-slate-900 outline-none"
                >
                  <option value="" disabled>
                    {t("cityPlaceholder")}
                  </option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-5 py-4">
                <Coins className="text-primary-bright" size={18} />
                <select
                  title={t("currencyLabel")}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-transparent text-base text-slate-900 outline-none"
                >
                  {currencyOptions.map(({ code, labelKey }) => (
                    <option key={code} value={code}>
                      {t(`currencies.${labelKey}`)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-5 py-4">
              <Search className="text-primary-bright" size={18} />
              <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>
          </div>
          <button
            type="button"
            className="w-full rounded-2xl bg-primary-bright py-4 font-semibold text-white shadow hover:bg-primary-dark transition"
          >
            {t("button")}
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-white/20  bg-gradient-to-b from-slate-900/80 to-slate-900/30 p-4 sm:p-6 text-white">
          <p className="font-tiktok text-xs tracking-[0.4em] text-secondary">
            {t("reasonsEyebrow")}
          </p>
          <h2 className="font-funnel text-2xl sm:text-3xl">
            {t("reasonsTitle")}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {reasons.map(({ icon: Icon, key }) => (
              <li
                key={key}
                className="flex items-start gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/20"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-bright/20 text-primary-bright">
                  <Icon size={18} aria-hidden />
                </div>
                <div>
                  <p className="font-semibold">{t(`reasons.${key}.title`)}</p>
                  <p className="text-sm text-white/80">{t(`reasons.${key}.copy`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
