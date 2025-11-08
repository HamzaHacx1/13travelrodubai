import { ArrowRight } from "lucide-react";
import Image from "next/image";


const highlights = [
  {
    title: "Old Dubai",
    description: "Abra rides, spice souks & Michelin Bib food tours.",
    image: "/services/service-3.jpg",
  },
  {
    title: "Palm West Beach",
    description: "Designer clubs, sunset views, and private cabanas.",
    image: "/services/service-8.jpg",
  },
  {
    title: "Abu Dhabi Daytrip",
    description: "Falcons, Louvre, and Saadiyat stays in one route.",
    image: "/services/service-6.jpg",
  },
];

const DestinationsPreview = () => (
  <section className="mx-auto mt-16 w-full max-w-6xl px-4 sm:px-6 lg:px-0">
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-tiktok text-xs uppercase tracking-[0.4em] text-primary-bright">
          trending routes
        </p>
        <h2 className="font-funnel text-3xl text-foreground md:text-4xl">
          Pick a district, we’ll handle the storytelling.
        </h2>
      </div>
      <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-primary-bright hover:text-primary-bright">
        Full destination guide
        <ArrowRight size={16} />
      </button>
    </div>

    <div className="mt-8 grid gap-6 lg:grid-cols-3">
      {highlights.map((item) => (
        <article
          key={item.title}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition hover:-translate-y-1"
        >
          <div className="relative h-48 w-full">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-2 p-5">
            <h3 className="font-funnel text-xl text-foreground">{item.title}</h3>
            <p className="text-sm text-slate-500">{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default DestinationsPreview;
