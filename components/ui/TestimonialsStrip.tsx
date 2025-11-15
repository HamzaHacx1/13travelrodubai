"use client";

import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";


const testimonials = [
  { key: "sasha" },
  { key: "rahul" },
  { key: "daniela" },
];

const TestimonialsStrip = () => {
  const t = useTranslations("Testimonials");

  return (
    <section className="mt-16 w-full bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-0">
        <p className="font-tiktok text-xs uppercase tracking-[0.4em] text-primary-bright">
          {t("eyebrow")}
        </p>
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.key}
              className="rounded-3xl border border-white/60 bg-white p-6 shadow-sm"
            >
              <Quote className="mb-4 text-primary-bright" size={28} />
              <p className="text-sm text-slate-600">{t(`items.${item.key}.quote`)}</p>
              <p className="mt-4 font-semibold text-slate-900">{t(`items.${item.key}.author`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsStrip;
