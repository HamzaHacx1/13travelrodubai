"use client";

import {
  Clock5,
  Coins,
  Gem,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { useTranslations, useFormatter } from "next-intl";
import { useMemo, useState } from "react";

import FallbackImage from "@/components/ui/FallbackImage";
import { Link as LocalizedLink } from "@/navigation";
const RAYNA_COUNTRY_ID = 13063;

const CITY_ID_BY_NAME: Record<string, number | null> = {
  Dubai: 13668,
  "Abu Dhabi": 13236,
};

const CITY_OPTIONS = [...Object.keys(CITY_ID_BY_NAME), "All Cities"];

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

type RaynaTour = {
  tourId: number;
  tourName: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  cityId?: number;
  countryId?: number;
  contractId?: number;
  priceFrom?: number;
  currency?: string;
};

type RaynaTourResponse = {
  tours?: RaynaTour[];
};

type SearchResult = {
  id: number;
  title: string;
  image: string;
  rating: number;
  reviewCount: number;
  priceFrom?: number;
  currency?: string;
  href?: Parameters<typeof LocalizedLink>[0]["href"];
};

const buildTravelDate = () => {
  const travelDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  return travelDate.toISOString().slice(0, 10);
};

const SearchSection = () => {
  const t = useTranslations("Search");
  const servicesT = useTranslations("Services");
  const formatter = useFormatter();
  const [city, setCity] = useState("");
  const [activity, setActivity] = useState("");
  const [currency, setCurrency] = useState(currencyOptions[0].code);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const selectedCityIds = useMemo(() => {
    if (!city) {
      return [];
    }
    if (city === "All Cities") {
      return Object.values(CITY_ID_BY_NAME).filter(
        (id): id is number => typeof id === "number",
      );
    }
    const cityId = CITY_ID_BY_NAME[city];
    return typeof cityId === "number" ? [cityId] : [];
  }, [city]);

  const runSearch = async () => {
    if (!city) {
      setErrorMessage(t("missingCity"));
      setHasSearched(false);
      return;
    }

    if (selectedCityIds.length === 0) {
      setErrorMessage(t("unsupportedCity"));
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setErrorMessage("");
    setHasSearched(true);

    const fetchJson = async <T,>(url: string, payload: Record<string, unknown>) => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Rayna request failed: ${response.status}`);
      }

      return (await response.json()) as T;
    };

    try {
      const query = activity.trim();
      const travelDate = buildTravelDate();
      const response = await fetchJson<RaynaTourResponse>("/api/rayna/tours", {
        cityIds: selectedCityIds,
        countryId: RAYNA_COUNTRY_ID,
        travelDate,
        query,
        limit: 9,
      });

      const mappedResults = (response.tours ?? []).map((tour, index) => {
        const ratingValue = Number(tour.rating ?? 0);
        const reviewCountValue = Number(tour.reviewCount ?? 0);
        const href =
          tour.cityId && tour.countryId && tour.contractId
            ? {
                pathname: "/services/[tourId]" as const,
                params: { tourId: String(tour.tourId) },
                query: {
                  cityId: String(tour.cityId),
                  countryId: String(tour.countryId),
                  contractId: String(tour.contractId),
                },
              }
            : undefined;

        return {
          id: tour.tourId,
          title: tour.tourName,
          image: tour.image ?? "",
          rating: Number.isFinite(ratingValue) ? ratingValue : 0,
          reviewCount: Number.isFinite(reviewCountValue) ? reviewCountValue : 0,
          priceFrom: tour.priceFrom,
          currency: tour.currency,
          href,
        };
      });

      setResults(mappedResults);
    } catch (error) {
      setResults([]);
      setErrorMessage(
        error instanceof Error ? error.message : t("noResults"),
      );
    } finally {
      setIsSearching(false);
    }
  };


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
                  {CITY_OPTIONS.map((option) => (
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
            onClick={runSearch}
            disabled={isSearching}
          >
            {isSearching ? t("loading") : t("button")}
          </button>
          {errorMessage && (
            <p className="text-sm font-semibold text-red-500">{errorMessage}</p>
          )}
        </div>

        {hasSearched && (
          <div className="flex flex-1 flex-col gap-4 rounded-3xl bg-white p-5 shadow-lg">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-tiktok text-xs tracking-[0.4em] text-primary-bright">
                  {t("resultsTitle")}
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {t("resultsCount", { count: results.length })}
                </p>
              </div>
            </div>
            {isSearching ? (
              <p className="text-sm text-slate-500">{t("loading")}</p>
            ) : results.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {results.map((result, index) => {
                  const hasReviews =
                    result.rating > 0 && result.reviewCount > 0;

                  return (
                    <article
                      key={result.id}
                      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <FallbackImage
                          src={result.image}
                          alt={result.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 768px) 50vw, 100vw"
                          priority={index < 2}
                        />
                        {typeof result.priceFrom === "number" && (
                          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                            {servicesT("fromPrice", {
                              price: formatter.number(result.priceFrom, {
                                style: "currency",
                                currency: result.currency ?? "AED",
                                maximumFractionDigits: 0,
                              }),
                            })}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-2 px-4 py-4">
                        {result.href ? (
                          <LocalizedLink
                            href={result.href}
                            className="font-funnel text-base text-slate-900 transition hover:text-primary-bright"
                          >
                            {result.title}
                          </LocalizedLink>
                        ) : (
                          <h3 className="font-funnel text-base text-slate-900">
                            {result.title}
                          </h3>
                        )}
                        {hasReviews && (
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Star className="text-primary-bright" size={14} />
                            <span className="font-semibold text-slate-800">
                              {result.rating.toFixed(2)}
                            </span>
                            <span>
                              (
                              {servicesT("reviewCount", {
                                count: result.reviewCount,
                              })}
                              )
                            </span>
                          </div>
                        )}
                        {result.href && (
                          <LocalizedLink
                            href={result.href}
                            className="mt-2 w-fit rounded-full border border-primary-bright/40 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-bright transition hover:bg-primary-bright/10"
                          >
                            {servicesT("reserve")}
                          </LocalizedLink>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500">{t("noResults")}</p>
            )}
          </div>
        )}

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
