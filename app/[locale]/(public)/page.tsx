import { Suspense } from "react";

import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import Hero from "@/components/ui/Hero";
import ServicesSection from "@/components/ui/ServicesSection";
import AuthCTA from "@/components/ui/AuthCTA";
import DestinationsPreview from "@/components/ui/DestinationsPreview";
import TestimonialsStrip from "@/components/ui/TestimonialsStrip";


export default function Page() {
  return (
    <>
      <Suspense fallback={<div className="h-16" />}>
        <Header />
      </Suspense>
      <Hero />
      <ServicesSection />
      <DestinationsPreview />
      <TestimonialsStrip />
      <AuthCTA />
      <Footer />
    </>
  );
}
