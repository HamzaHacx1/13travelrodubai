"use client";

import SearchSection from "@/components/ui/search";
import React from "react";


const Hero = () => {
  return (
    <section className="flex w-full flex-col items-center bg-[url('/dubai-bg.jpg')] bg-center bg-cover bg-fixed bg-black/60 bg-blend-overlay px-4 py-16 text-center sm:px-6 md:px-10 md:py-24">
      <div className="space-y-4 text-white max-w-3xl">
        <p className="font-tiktok font-bold text-lg uppercase tracking-[0.25em]">
          Experience Dubai
        </p>
        <h1 className="font-funnel uppercase text-2xl sm:text-3xl md:text-5xl">
          Curated stays, tours & unforgettable escapes.
        </h1>
      </div>
      <div className="mt-10 w-full max-w-5xl lg:mt-16">
        <SearchSection />
      </div>
    </section>
  );
};

export default Hero;
