"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";


const highlights = [
  {
    key: "oldDubai",
    image: "/services/service-3.jpg",
  },
  {
    key: "palmWestBeach",
    image: "/services/service-8.jpg",
  },
  {
    key: "abuDhabi",
    image: "/services/service-6.jpg",
  },
];

const DestinationsPreview = () => {
  const t = useTranslations("Destinations");

  return (
    <section className="mx-auto mt-16 w-full max-w-6xl px-4 sm:px-6 lg:px-0">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-tiktok text-xs uppercase tracking-[0.4em] text-primary-bright">
            {t("eyebrow")}
          </p>
          <h2 className="font-funnel text-3xl text-foreground md:text-4xl">
            {t("title")}
          </h2>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-primary-bright hover:text-primary-bright">
          {t("button")}
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {highlights.map((item) => (
          <article
            key={item.key}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition hover:-translate-y-1"
          >
            <div className="relative h-48 w-full">
              <Image
                src={item.image}
                alt={t(`highlights.${item.key}.title`)}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-2 p-5">
              <h3 className="font-funnel text-xl text-foreground">
                {t(`highlights.${item.key}.title`)}
              </h3>
              <p className="text-sm text-slate-500">
                {t(`highlights.${item.key}.description`)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DestinationsPreview;
