"use client";

import { Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";

import FallbackImage from "@/components/ui/FallbackImage";
import { Link as LocalizedLink } from "@/navigation";

type LocalizedHref = Parameters<typeof LocalizedLink>[0]["href"];

type ServiceCard = {
  id: number;
  title: string;
  image: string;
  cityName?: string;
  cityId?: number;
  countryId?: number;
  contractId?: number;
  priceFrom?: number;
  currency?: string;
  reviews: { rating: number; count: number };
  href?: LocalizedHref;
};

type ServiceFallback = Omit<ServiceCard, "title"> & {
  titleKey: string;
};

type RaynaTour = {
  tourId: number;
  tourName: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  recommended?: boolean;
  cityName?: string;
  cityId?: number;
  countryId?: number;
  contractId?: number;
  priceFrom?: number;
  currency?: string;
};

type RaynaTourResponse = {
  tours?: RaynaTour[];
};

const RAYNA_COUNTRY_ID = 13063;
const RAYNA_CITY_IDS = {
  dubai: 13668,
  abuDhabi: 13236,
};
const PAGE_SIZE = 9;
const SERVICES_CACHE_KEY = "rayna-services-cache-v1";
const SERVICES_CACHE_TTL_MS = 1000 * 60 * 10;

let servicesCache: { timestamp: number; data: ServiceCard[] } | null = null;

const readServicesCache = () => {
  if (
    servicesCache &&
    Date.now() - servicesCache.timestamp < SERVICES_CACHE_TTL_MS
  ) {
    return servicesCache.data;
  }
  return null;
};

const hydrateServicesCache = () => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.sessionStorage.getItem(SERVICES_CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as {
      timestamp?: number;
      data?: ServiceCard[];
    };
    if (!Array.isArray(parsed.data) || typeof parsed.timestamp !== "number") {
      return null;
    }
    if (Date.now() - parsed.timestamp > SERVICES_CACHE_TTL_MS) {
      return null;
    }
    servicesCache = { timestamp: parsed.timestamp, data: parsed.data };
    return parsed.data;
  } catch {
    return null;
  }
};

const writeServicesCache = (data: ServiceCard[]) => {
  servicesCache = { timestamp: Date.now(), data };
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.sessionStorage.setItem(
      SERVICES_CACHE_KEY,
      JSON.stringify(servicesCache),
    );
  } catch {
    return;
  }
};

const fallbackServices: ServiceFallback[] = [
  {
    id: 1,
    titleKey: "museumFuture",
    image: "",
    priceFrom: 45,
    reviews: { rating: 4.8, count: 1250 },
    href: { pathname: "/services/museum-of-the-future" },
  },
  {
    id: 2,
    titleKey: "burjKhalifaSuite",
    image: "",
    priceFrom: 1299,
    reviews: { rating: 5, count: 96 },
  },
  {
    id: 3,
    titleKey: "oldDubaiCulinary",
    image: "",
    priceFrom: 189,
    reviews: { rating: 4.8, count: 142 },
  },
  {
    id: 4,
    titleKey: "yachtCharterPalm",
    image: "",
    priceFrom: 2100,
    reviews: { rating: 4.95, count: 65 },
  },
  {
    id: 5,
    titleKey: "hotAirBalloon",
    image: "",
    priceFrom: 379,
    reviews: { rating: 4.7, count: 118 },
  },
  {
    id: 6,
    titleKey: "louvreTransfer",
    image: "",
    priceFrom: 420,
    reviews: { rating: 4.85, count: 73 },
  },
  {
    id: 7,
    titleKey: "helicopterCircuit",
    image: "",
    priceFrom: 560,
    reviews: { rating: 4.92, count: 88 },
  },
  {
    id: 8,
    titleKey: "palmSunsetDinner",
    image: "",
    priceFrom: 980,
    reviews: { rating: 4.97, count: 54 },
  },
  {
    id: 9,
    titleKey: "wellnessHammam",
    image: "",
    priceFrom: 310,
    reviews: { rating: 4.75, count: 61 },
  },
];

const buildTravelDate = () => {
  const travelDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  return travelDate.toISOString().slice(0, 10);
};

const ServicesSection = () => {
  const t = useTranslations("Services");
  const formatter = useFormatter();
  const [services, setServices] = useState<ServiceCard[]>(
    () => readServicesCache() ?? [],
  );
  const [selectedCity, setSelectedCity] = useState("All");
  const [page, setPage] = useState(1);

  const localizedFallback = useMemo(
    () =>
      fallbackServices.map((service) => ({
        ...service,
        title: t(`cards.${service.titleKey}`),
      })),
    [t],
  );

  useEffect(() => {
    const cached = hydrateServicesCache();
    if (cached && cached.length > 0) {
      setServices((current) => (current.length > 0 ? current : cached));
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchJson = async <T,>(url: string, payload: Record<string, unknown>) => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Rayna request failed: ${response.status}`);
      }

      return (await response.json()) as T;
    };

    const loadServices = async () => {
      const travelDate = buildTravelDate();
      const response = await fetchJson<RaynaTourResponse>("/api/rayna/tours", {
        cityIds: [RAYNA_CITY_IDS.dubai, RAYNA_CITY_IDS.abuDhabi],
        countryId: RAYNA_COUNTRY_ID,
        travelDate,
      });

      const ranked = (response.tours ?? []).sort((a, b) => {
        const imageScore = Number(Boolean(b.image)) - Number(Boolean(a.image));
        if (imageScore !== 0) {
          return imageScore;
        }
        const recommendedScore =
          Number(Boolean(b.recommended)) - Number(Boolean(a.recommended));
        if (recommendedScore !== 0) {
          return recommendedScore;
        }
        const ratingScore = (b.rating ?? 0) - (a.rating ?? 0);
        if (ratingScore !== 0) {
          return ratingScore;
        }
        return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
      });

      const mapped = ranked.map((tour, index) => {
        const priceValue = Number(tour.priceFrom);
        const ratingValue = Number(tour.rating ?? 0);
        const reviewCountValue = Number(tour.reviewCount ?? 0);
        const detailsHref =
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
          cityName: tour.cityName,
          cityId: tour.cityId,
          countryId: tour.countryId,
          contractId: tour.contractId,
          href: detailsHref,
          priceFrom: Number.isFinite(priceValue) ? priceValue : undefined,
          currency: tour.currency,
          reviews: {
            rating: Number.isFinite(ratingValue) ? ratingValue : 0,
            count: Number.isFinite(reviewCountValue) ? reviewCountValue : 0,
          },
        };
      });

      if (!controller.signal.aborted) {
        writeServicesCache(mapped);
        setServices(mapped);
      }
    };

    loadServices().catch(() => {
      if (!controller.signal.aborted) {
        const cached = readServicesCache();
        setServices(cached ?? []);
      }
    });

    return () => {
      controller.abort();
    };
  }, [localizedFallback]);

  const visibleServices = services.length > 0 ? services : localizedFallback;
  const availableCities = useMemo(() => {
    const citySet = new Set<string>();
    visibleServices.forEach((service) => {
      if (service.cityName) {
        citySet.add(service.cityName);
      }
    });
    return Array.from(citySet).sort();
  }, [visibleServices]);

  const filteredServices = useMemo(() => {
    if (selectedCity === "All" || availableCities.length === 0) {
      return visibleServices;
    }
    return visibleServices.filter(
      (service) => service.cityName === selectedCity,
    );
  }, [availableCities.length, selectedCity, visibleServices]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    if (currentPage !== page) {
      setPage(currentPage);
    }
  }, [currentPage, page]);

  return (
    <section className="mx-auto mt-16 w-full max-w-6xl px-4 sm:px-6 lg:px-0">
      <div className="flex flex-col items-start gap-4 text-white">
        <p className="font-tiktok text-xs tracking-[0.4em] text-secondary">
          {t("eyebrow")}
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="font-funnel text-3xl text-foreground md:text-4xl">
            {t("title")}
          </h2>
          <p className="max-w-xl text-sm text-slate-500 md:text-base">
            {t("description")}
          </p>
        </div>
      </div>

      {availableCities.length > 1 && (
        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span className="font-semibold text-slate-800">
            {t("filterLabel")}
          </span>
          <button
            type="button"
            onClick={() => {
              setSelectedCity("All");
              setPage(1);
            }}
            className={`rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-wide transition ${
              selectedCity === "All"
                ? "border-primary-bright/60 bg-primary-bright/10 text-primary-bright"
                : "border-slate-200 text-slate-600 hover:border-primary-bright/40 hover:text-primary-bright"
            }`}
          >
            {t("allCities")}
          </button>
          {availableCities.map((cityName) => (
            <button
              key={cityName}
              type="button"
              onClick={() => {
                setSelectedCity(cityName);
                setPage(1);
              }}
              className={`rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                selectedCity === cityName
                  ? "border-primary-bright/60 bg-primary-bright/10 text-primary-bright"
                  : "border-slate-200 text-slate-600 hover:border-primary-bright/40 hover:text-primary-bright"
              }`}
            >
              {cityName}
            </button>
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {paginatedServices.map((service, index) => {
          const hasReviews =
            service.reviews.rating > 0 && service.reviews.count > 0;

          return (
            <article
              key={service.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <FallbackImage
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw"
                  priority={index < 3}
                />
                {typeof service.priceFrom === "number" && (
                  <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    {t("fromPrice", {
                      price: formatter.number(service.priceFrom, {
                        style: "currency",
                        currency: service.currency ?? "AED",
                        maximumFractionDigits: 0,
                      }),
                    })}
                  </span>
                )}
              </div>

            <div className="flex flex-1 flex-col gap-3 px-5 py-6">
              <h3 className="font-funnel text-lg text-foreground">
                {service.title}
              </h3>
              {hasReviews && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Star className="text-primary-bright" size={16} />
                  <span className="font-semibold text-slate-800">
                    {service.reviews.rating.toFixed(2)}
                  </span>
                  <span>
                    (
                    {t("reviewCount", {
                      count: service.reviews.count,
                    })}
                    )
                  </span>
                </div>
              )}
              <div className="mt-auto flex items-center justify-between text-sm text-slate-600">
                <span>{t("flexibleCancellation")}</span>
                {service.href ? (
                  <LocalizedLink
                    href={service.href}
                    className="rounded-full border border-primary-bright/40 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-bright transition hover:bg-primary-bright/10"
                  >
                    {t("reserve")}
                  </LocalizedLink>
                ) : (
                  <button
                    type="button"
                    className="rounded-full border border-primary-bright/40 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-bright transition hover:bg-primary-bright/10"
                  >
                    {t("reserve")}
                  </button>
                )}
              </div>
            </div>
            </article>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3 text-sm text-slate-600">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-primary-bright/40 hover:text-primary-bright disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("previous")}
          </button>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t("pageLabel", { current: currentPage, total: totalPages })}
          </span>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-primary-bright/40 hover:text-primary-bright disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("next")}
          </button>
        </div>
      )}
    </section>
  );
};

export default ServicesSection;
