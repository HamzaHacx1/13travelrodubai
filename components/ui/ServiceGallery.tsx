"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import FallbackImage from "@/components/ui/FallbackImage";

type ServiceGalleryImage = {
  src: string;
  span?: string;
};

type ServiceGalleryProps = {
  images: ServiceGalleryImage[];
  alt: string;
};

const ServiceGallery = ({ images, alt }: ServiceGalleryProps) => {
  const t = useTranslations("ServiceDetail");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const galleryImages = useMemo(
    () => images.filter((image) => Boolean(image.src)),
    [images],
  );
  const totalImages = galleryImages.length;

  const handleNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || totalImages === 0) {
        return current;
      }
      return (current + 1) % totalImages;
    });
  }, [totalImages]);

  const handlePrev = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || totalImages === 0) {
        return current;
      }
      return (current - 1 + totalImages) % totalImages;
    });
  }, [totalImages]);

  useEffect(() => {
    if (activeIndex === null) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }
      if (event.key === "ArrowRight") {
        handleNext();
      }
      if (event.key === "ArrowLeft") {
        handlePrev();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, handleNext, handlePrev]);

  if (totalImages === 0) {
    return null;
  }

  return (
    <>
      <div className="grid auto-rows-[180px] gap-4 rounded-3xl bg-white p-4 shadow-xl sm:p-6 lg:grid-cols-2">
        {galleryImages.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            className={`group relative overflow-hidden rounded-2xl ${image.span ?? ""}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Open image ${index + 1} of ${totalImages}`}
          >
            <FallbackImage
              src={image.src}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover transition duration-300 group-hover:scale-105"
              priority={index === 0}
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} gallery`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-0 top-0 z-10 -translate-y-12 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
              aria-label={t("galleryClose")}
            >
              <X size={20} />
            </button>

            <div className="relative h-[70vh] w-full overflow-hidden rounded-3xl bg-black">
              <FallbackImage
                src={galleryImages[activeIndex].src}
                alt={alt}
                fill
                sizes="(min-width: 1024px) 70vw, 100vw"
                className="object-contain"
                priority
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-white/80">
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
                aria-label={t("galleryPrevious")}
              >
                <ChevronLeft size={16} />
                {t("galleryPrevious")}
              </button>
              <span className="text-xs font-semibold uppercase tracking-[0.3em]">
                {activeIndex + 1} / {totalImages}
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
                aria-label={t("galleryNext")}
              >
                {t("galleryNext")}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceGallery;
