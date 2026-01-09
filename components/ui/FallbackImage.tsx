"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type FallbackImageProps = {
  src: string;
  fallbackSrc?: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

const toLargeVariant = (value: string) => {
  if (!value.startsWith("http://") && !value.startsWith("https://")) {
    return value;
  }

  try {
    const url = new URL(value);
    let pathname = url.pathname.replace(/\/$/, "");
    if (/_([LMS])\.(jpg|jpeg)$/i.test(pathname)) {
      pathname = pathname.replace(/_[LMS]\.(jpg|jpeg)$/i, "_L.$1");
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(pathname)) {
      pathname = pathname.replace(/\.(jpg|jpeg|png|webp)$/i, "_L.$1");
    } else {
      pathname = `${pathname}_L.jpg`;
    }
    url.pathname = pathname;
    return url.toString();
  } catch {
    return value;
  }
};

const FallbackImage = ({
  src,
  alt,
  fill,
  width,
  height,
  className,
  sizes,
  priority,
}: FallbackImageProps) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [triedLarge, setTriedLarge] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isRemote =
    currentSrc.startsWith("http://") || currentSrc.startsWith("https://");

  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
    setTriedLarge(false);
    setHasError(false);
  }, [src]);

  if (!currentSrc || hasError) {
    return (
      <span
        aria-hidden
        className="absolute inset-0 bg-slate-100"
      />
    );
  }

  return (
    <>
      {!isLoaded && (
        <span
          aria-hidden
          className="absolute inset-0 animate-pulse bg-slate-200/60"
        />
      )}
      <Image
        src={currentSrc}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        className={className}
        sizes={sizes}
        priority={priority}
        unoptimized={isRemote}
        referrerPolicy={isRemote ? "no-referrer" : undefined}
        onLoadingComplete={() => {
          setIsLoaded(true);
        }}
        onError={() => {
          if (!triedLarge) {
            const largeVariant = toLargeVariant(currentSrc);
            if (largeVariant !== currentSrc) {
              setCurrentSrc(largeVariant);
              setTriedLarge(true);
              setIsLoaded(false);
              return;
            }
          }

          setHasError(true);
          setIsLoaded(true);
        }}
      />
    </>
  );
};

export default FallbackImage;
