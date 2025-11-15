"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { Link as LocalizedLink } from "@/navigation";

type LocalizedHref = Parameters<typeof LocalizedLink>[0]["href"];

type ServiceCard = {
  id: number;
  titleKey: string;
  image: string;
  priceFrom: number;
  reviews: { rating: number; count: number };
  href?: LocalizedHref;
};

const services: ServiceCard[] = [
  {
    id: 1,
    titleKey: "museumFuture",
    image: "/services/service-1.jpg",
    priceFrom: 45,
    reviews: { rating: 4.8, count: 1250 },
    href: { pathname: "/services/museum-of-the-future" },
  },
  {
    id: 2,
    titleKey: "burjKhalifaSuite",
    image: "/services/service-2.jpg",
    priceFrom: 1299,
    reviews: { rating: 5, count: 96 },
  },
  {
    id: 3,
    titleKey: "oldDubaiCulinary",
    image: "/services/service-3.jpg",
    priceFrom: 189,
    reviews: { rating: 4.8, count: 142 },
  },
  {
    id: 4,
    titleKey: "yachtCharterPalm",
    image: "/services/service-4.jpg",
    priceFrom: 2100,
    reviews: { rating: 4.95, count: 65 },
  },
  {
    id: 5,
    titleKey: "hotAirBalloon",
    image: "/services/service-5.jpg",
    priceFrom: 379,
    reviews: { rating: 4.7, count: 118 },
  },
  {
    id: 6,
    titleKey: "louvreTransfer",
    image: "/services/service-6.jpg",
    priceFrom: 420,
    reviews: { rating: 4.85, count: 73 },
  },
  {
    id: 7,
    titleKey: "helicopterCircuit",
    image: "/services/service-7.jpg",
    priceFrom: 560,
    reviews: { rating: 4.92, count: 88 },
  },
  {
    id: 8,
    titleKey: "palmSunsetDinner",
    image: "/services/service-8.jpg",
    priceFrom: 980,
    reviews: { rating: 4.97, count: 54 },
  },
  {
    id: 9,
    titleKey: "wellnessHammam",
    image: "/services/service-9.jpg",
    priceFrom: 310,
    reviews: { rating: 4.75, count: 61 },
  },
];

const ServicesSection = () => {
  const t = useTranslations("Services");
  const formatter = useFormatter();

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

      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <article
            key={service.id}
            className="group flex flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={service.image}
                alt={t(`cards.${service.titleKey}`)}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw"
                priority={service.id <= 3}
              />
              <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                {t("fromPrice", {
                  price: formatter.number(service.priceFrom, {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }),
                })}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 px-5 py-6">
              <h3 className="font-funnel text-lg text-foreground">
                {t(`cards.${service.titleKey}`)}
              </h3>
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
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
