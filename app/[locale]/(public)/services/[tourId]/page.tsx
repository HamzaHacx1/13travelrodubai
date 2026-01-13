import {
  CheckCircle2,
  Clock,
  Globe,
  MapPin,
  RefreshCw,
  Shield,
  ShieldCheck,
  Smartphone,
  Star,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import Header from "@/components/ui/Header";
import ServiceGallery from "@/components/ui/ServiceGallery";
import { Link as LocalizedLink } from "@/navigation";
import { getRaynaConfig } from "@/lib/rayna";
import {
  buildRaynaImageProxyUrl,
} from "@/lib/raynaImages";

const galleryLayout = [
  "col-span-2 row-span-2 min-h-[260px]",
  "",
  "",
  "",
];

type TourDetail = {
  tourId: number;
  tourName: string;
  countryName?: string;
  cityName?: string;
  duration?: string;
  rating?: number;
  reviewCount?: number;
  tourDescription?: string;
  tourShortDescription?: string;
  tourInclusion?: string;
  tourExclusion?: string;
  importantInformation?: string;
  cancellationPolicyName?: string;
  cancellationPolicyDescription?: string;
  termsAndConditions?: string;
  tourLanguage?: string;
  departurePoint?: string;
  reportingTime?: string;
  imagePath?: string;
  tourImages?: Array<{ imagePath?: string }>;
  latitude?: number;
  longitude?: number;
  googleMapUrl?: string;
  whatsInThisTour?: string;
  raynaToursAdvantage?: string;
  usefulInformation?: string;
};

type TourDetailResponse = {
  result?: TourDetail[];
};

type TourPrice = {
  cityTourID: number;
  finalAdultAmount?: number;
  currency?: string;
};

type TourPriceResponse = {
  result?: {
    tourPrice?: TourPrice[];
  };
};

const buildTravelDate = () => {
  const travelDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  return travelDate.toISOString().slice(0, 10);
};

const stripHtml = (value: string | undefined) => {
  if (!value) {
    return "";
  }
  return value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
};

const getNumberParam = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

const fetchRayna = async (endpoint: string, payload: Record<string, unknown>) => {
  const { baseUrl, token, headers, authScheme } = getRaynaConfig();
  const url = new URL(endpoint, baseUrl);
  const requestHeaders = new Headers({
    accept: "application/json",
    "content-type": "application/json",
  });

  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      requestHeaders.set(key, value);
    });
  }

  if (token) {
    const authValue = authScheme ? `${authScheme} ${token}` : token;
    requestHeaders.set("authorization", authValue);
  }

  const response = await fetch(url, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Rayna request failed: ${response.status}`);
  }

  return response.json();
};

type Translations = Awaited<ReturnType<typeof getTranslations>>;

type BookingCardProps = {
  cityId: number;
  countryId: number;
  tourId: number;
  travelDate: string;
  bookingPerks: string[];
  servicesT: Translations;
  t: Translations;
};

const BookingCardSkeleton = () => (
  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 animate-pulse">
    <div className="h-6 w-36 rounded-full bg-slate-200" />
    <div className="mt-3 h-4 w-56 rounded-full bg-slate-200" />
    <div className="mt-6 h-8 w-40 rounded-full bg-slate-200" />
    <div className="mt-2 h-4 w-20 rounded-full bg-slate-200" />
    <div className="mt-4 space-y-2">
      <div className="h-4 w-44 rounded-full bg-slate-200" />
      <div className="h-4 w-36 rounded-full bg-slate-200" />
      <div className="h-4 w-40 rounded-full bg-slate-200" />
    </div>
    <div className="mt-6 h-11 w-full rounded-2xl bg-slate-200" />
    <div className="mt-2 h-11 w-full rounded-2xl bg-slate-200" />
  </div>
);

async function BookingCard({
  cityId,
  countryId,
  tourId,
  travelDate,
  bookingPerks,
  servicesT,
  t,
}: BookingCardProps) {
  let price: TourPrice | undefined;

  try {
    const priceData = (await fetchRayna("/api/Tour/gettourprice", {
      countryId,
      cityId,
      travelDate,
    })) as TourPriceResponse;

    price = priceData.result?.tourPrice?.find(
      (item) => item.cityTourID === tourId,
    );
  } catch {
    price = undefined;
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <h3 className="text-xl font-semibold text-slate-900">
        {t("booking")}
      </h3>

      <p className="text-sm text-slate-600">{t("bookingCopy")}</p>

      {typeof price?.finalAdultAmount === "number" ? (
        <p className="mt-6 text-3xl font-semibold text-slate-900">
          {servicesT("fromPrice", {
            price: new Intl.NumberFormat("en", {
              style: "currency",
              currency: price.currency ?? "AED",
              maximumFractionDigits: 0,
            }).format(price.finalAdultAmount),
          })}
        </p>
      ) : (
        <p className="mt-6 text-2xl font-semibold text-slate-900">
          {t("priceUnavailable")}
        </p>
      )}

      <p className="text-sm text-slate-600">{t("perAdult")}</p>

      {bookingPerks.length > 0 && (
        <div className="mt-4 space-y-2 text-sm text-slate-600">
          {bookingPerks.map((perk) => (
            <div key={perk} className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-primary-bright" />
              <span>{perk}</span>
            </div>
          ))}
        </div>
      )}

      <Button className="mt-6 w-full rounded-2xl bg-primary-bright text-white hover:bg-primary-dark">
        {servicesT("reserve")}
      </Button>

      <Button
        variant="ghost"
        className="mt-2 w-full rounded-2xl border border-slate-200 text-slate-700 hover:bg-white"
      >
        {t("ctaSecondary")}
      </Button>
    </div>
  );
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function ServiceDetailPage({
  params,
  searchParams,
}: {
  params: { locale: string; tourId: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const { tourId } = await Promise.resolve(params);
  const query = await Promise.resolve(searchParams ?? {});
  const cityId = getNumberParam(query.cityId);
  const countryId = getNumberParam(query.countryId);
  const contractId = getNumberParam(query.contractId);
  const tourIdNumber = Number(tourId);

  if (!cityId || !countryId || !contractId || !Number.isFinite(tourIdNumber)) {
    notFound();
  }

  const t = await getTranslations("ServiceDetail");
  const servicesT = await getTranslations("Services");
  const travelDate = buildTravelDate();

  let detailData: TourDetailResponse;

  try {
    detailData = await fetchRayna("/api/Tour/tourstaticdatabyid", {
      countryId,
      cityId,
      tourId: tourIdNumber,
      contractId,
      travelDate,
    });
  } catch {
    notFound();
  }

  const tour = detailData.result?.[0];
  if (!tour) {
    notFound();
  }

  const imageCandidates = [
    ...((tour.tourImages ?? []).map((img) => img.imagePath).filter(Boolean) as string[]),
    tour.imagePath,
  ].filter(Boolean) as string[];
  const proxyCandidates = imageCandidates
    .map((path) => buildRaynaImageProxyUrl([path]))
    .filter(Boolean);
  const uniqueCandidates = Array.from(new Set(proxyCandidates));

  const galleryImages = uniqueCandidates
    .slice(0, galleryLayout.length)
    .map((src, index) => ({
      span: galleryLayout[index] ?? "",
      src,
    }));

  const locationLabel = [tour.cityName, tour.countryName]
    .filter(Boolean)
    .join(", ");
  const hasReviews = (tour.rating ?? 0) > 0 && (tour.reviewCount ?? 0) > 0;
  const overviewParagraphs = [
    stripHtml(tour.tourShortDescription),
    stripHtml(tour.tourDescription),
  ].filter(Boolean);

  const quickFacts = [
    { icon: Clock, label: t("duration"), value: tour.duration },
    { icon: Globe, label: t("language"), value: tour.tourLanguage },
    { icon: Smartphone, label: t("reporting"), value: tour.reportingTime },
    { icon: MapPin, label: t("departure"), value: tour.departurePoint },
  ].filter((fact) => Boolean(fact.value));

  const includesHtml = tour.tourInclusion;
  const excludesHtml = tour.tourExclusion;
  const highlightsHtml =
    tour.whatsInThisTour || tour.raynaToursAdvantage || tour.usefulInformation;

  const policyItems = [
    {
      title: t("cancellation"),
      description: stripHtml(tour.cancellationPolicyDescription),
    },
    {
      title: t("terms"),
      description: stripHtml(tour.termsAndConditions),
    },
    {
      title: t("importantInfo"),
      description: stripHtml(tour.importantInformation),
    },
  ].filter((item) => item.description);

  const mapUrl =
    tour.googleMapUrl ||
    (tour.latitude && tour.longitude
      ? `https://maps.google.com/?q=${tour.latitude},${tour.longitude}`
      : undefined);

  const bookingPerks = [
    tour.cancellationPolicyName,
    tour.duration,
    tour.tourLanguage,
  ].filter((value): value is string => Boolean(value));

  return (
    <div className="bg-white">
      <Suspense fallback={<div className="h-16" />}>
        <Header />
      </Suspense>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-0">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="order-1">
              <ServiceGallery images={galleryImages} alt={tour.tourName} />
            </div>

            <div className="order-2 space-y-6">
              <nav className="text-xs uppercase tracking-[0.3em] text-white/70">
                <LocalizedLink href="/" className="hover:text-secondary">
                  {t("breadcrumbHome")}
                </LocalizedLink>
                <span className="mx-2">/</span>
                <LocalizedLink href="/" className="hover:text-secondary">
                  {t("breadcrumbCategory")}
                </LocalizedLink>
              </nav>

              <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-secondary">
                  {t("heroTag")}
                </p>

                <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                  {tour.tourName}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                  {hasReviews && (
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <Star size={18} className="text-secondary" />
                      {tour.rating?.toFixed(1)}
                    </span>
                  )}
                  {hasReviews && (
                    <span>
                      {servicesT("reviewCount", {
                        count: tour.reviewCount ?? 0,
                      })}
                    </span>
                  )}
                  {locationLabel && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={16} className="text-secondary" />
                      {locationLabel}
                    </span>
                  )}
                  {tour.cancellationPolicyName && (
                    <span className="rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-wide">
                      {tour.cancellationPolicyName}
                    </span>
                  )}
                </div>

                {overviewParagraphs[0] && (
                  <p className="max-w-3xl text-base text-white/85">
                    {overviewParagraphs[0]}
                  </p>
                )}

                <p className="text-xs text-white/60">{t("note")}</p>

                <div className="flex flex-wrap gap-3">
                  <Button className="rounded-2xl bg-secondary px-6 text-slate-950 hover:bg-secondary/80">
                    {t("ctaPrimary")}
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-2xl border-white/40 bg-primary px-6 text-white hover:bg-primary-bright/10 hover:text-white"
                  >
                    {t("ctaSecondary")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-6xl gap-10 px-4 pb-16 sm:px-6 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:px-0">
        <article className="space-y-10">
          {quickFacts.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {quickFacts.map((fact) => {
                const Icon = fact.icon;
                return (
                  <div
                    key={fact.label}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-bright/10 text-primary-bright">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        {fact.label}
                      </p>
                      <p className="text-base font-semibold text-slate-900">
                        {fact.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {(overviewParagraphs.length > 0 || highlightsHtml) && (
            <div className="space-y-4">
              {overviewParagraphs.map((paragraph) => (
                <p key={paragraph} className="text-base text-slate-600">
                  {paragraph}
                </p>
              ))}

              {highlightsHtml && (
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {t("highlights")}
                  </h2>
                  <div
                    className="prose mt-4 max-w-none text-slate-600"
                    dangerouslySetInnerHTML={{ __html: highlightsHtml }}
                  />
                </div>
              )}
            </div>
          )}

          {(includesHtml || excludesHtml) && (
            <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 sm:grid-cols-2">
              {includesHtml && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {t("inclusions")}
                  </h3>
                  <div
                    className="prose mt-3 max-w-none text-slate-600"
                    dangerouslySetInnerHTML={{ __html: includesHtml }}
                  />
                </div>
              )}

              {excludesHtml && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {t("exclusions")}
                  </h3>
                  <div
                    className="prose mt-3 max-w-none text-slate-600"
                    dangerouslySetInnerHTML={{ __html: excludesHtml }}
                  />
                </div>
              )}
            </div>
          )}

          {(tour.departurePoint || mapUrl) && (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                {t("meetingPoint")}
              </h3>
              {tour.departurePoint && (
                <p className="mt-2 text-slate-600">{tour.departurePoint}</p>
              )}
              {mapUrl && (
                <Link
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-bright hover:underline"
                >
                  <MapPin size={16} className="text-primary-bright" />
                  {t("openMap")}
                </Link>
              )}
            </div>
          )}

          {policyItems.length > 0 && (
            <div className="rounded-3xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900">
                {t("policiesTitle")}
              </h3>

              <div className="mt-4 flex flex-col gap-4">
                {policyItems.map((policy, index) => {
                  const icons = [ShieldCheck, RefreshCw, Shield];
                  const Icon = icons[index % icons.length];
                  return (
                    <div
                      key={policy.title}
                      className="rounded-2xl border border-slate-100 p-4"
                    >
                      <Icon size={20} className="text-primary-bright" />
                      <h4 className="mt-3 text-base font-semibold text-slate-900">
                        {policy.title}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {policy.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </article>

        <aside className="space-y-6">
          <Suspense fallback={<BookingCardSkeleton />}>
            <BookingCard
              cityId={cityId}
              countryId={countryId}
              tourId={tourIdNumber}
              travelDate={travelDate}
              bookingPerks={bookingPerks}
              servicesT={servicesT}
              t={t}
            />
          </Suspense>
        </aside>
      </section>
    </div>
  );
}
