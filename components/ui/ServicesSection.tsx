import Image from "next/image";
import { Star } from "lucide-react";


const services = [
  {
    id: 1,
    name: "Sunrise Desert Safari",
    image: "/services/service-1.jpg",
    priceFrom: 249,
    reviews: { rating: 4.9, count: 182 },
  },
  {
    id: 2,
    name: "Burj Khalifa Horizon Suite",
    image: "/services/service-2.jpg",
    priceFrom: 1299,
    reviews: { rating: 5, count: 96 },
  },
  {
    id: 3,
    name: "Old Dubai Culinary Trail",
    image: "/services/service-3.jpg",
    priceFrom: 189,
    reviews: { rating: 4.8, count: 142 },
  },
  {
    id: 4,
    name: "Yacht Charter on the Palm",
    image: "/services/service-4.jpg",
    priceFrom: 2100,
    reviews: { rating: 4.95, count: 65 },
  },
  {
    id: 5,
    name: "Hot Air Balloon + Breakfast",
    image: "/services/service-5.jpg",
    priceFrom: 379,
    reviews: { rating: 4.7, count: 118 },
  },
  {
    id: 6,
    name: "Private Louvre Abu Dhabi Transfer",
    image: "/services/service-6.jpg",
    priceFrom: 420,
    reviews: { rating: 4.85, count: 73 },
  },
  {
    id: 7,
    name: "Skyline Helicopter Circuit",
    image: "/services/service-7.jpg",
    priceFrom: 560,
    reviews: { rating: 4.92, count: 88 },
  },
  {
    id: 8,
    name: "Palm Sunset Yacht Dinner",
    image: "/services/service-8.jpg",
    priceFrom: 980,
    reviews: { rating: 4.97, count: 54 },
  },
  {
    id: 9,
    name: "Wellness Hammam Ritual",
    image: "/services/service-9.jpg",
    priceFrom: 310,
    reviews: { rating: 4.75, count: 61 },
  },
];

const ServicesSection = () => {
  return (
    <section className="mx-auto mt-16 w-full max-w-6xl px-4 sm:px-6 lg:px-0">
      <div className="flex flex-col items-start gap-4 text-white">
        <p className="font-tiktok text-xs tracking-[0.4em] text-secondary">
          Curated services
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="font-funnel text-3xl text-foreground md:text-4xl">
            Book the moments Dubai is famous for.
          </h2>
          <p className="max-w-xl text-sm text-slate-500 md:text-base">
            Swap these placeholders with live API results later. Each card comes
            with an image, rate, and social proof so guests can commit with
            confidence.
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
                alt={service.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw"
                priority={service.id <= 3}
              />
              <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                from ${service.priceFrom}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 px-5 py-6">
              <h3 className="font-funnel text-lg text-foreground">
                {service.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Star className="text-primary-bright" size={16} />
                <span className="font-semibold text-slate-800">
                  {service.reviews.rating.toFixed(2)}
                </span>
                <span>({service.reviews.count} reviews)</span>
              </div>
              <div className="mt-auto flex items-center justify-between text-sm text-slate-600">
                <span>Flexible cancellation</span>
                <button
                  type="button"
                  className="rounded-full border border-primary-bright/40 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-bright transition hover:bg-primary-bright/10"
                >
                  Reserve
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
