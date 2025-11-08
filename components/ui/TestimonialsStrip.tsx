import { Quote } from "lucide-react";


const testimonials = [
  {
    quote:
      "13 Travelro stitched together transfers, restaurants, and a sunrise balloon ride in 48 hours. It felt like our trip had its own showrunner.",
    name: "Sasha, NYC",
  },
  {
    quote:
      "They got us a last-minute table at Tresind Studio and a private yacht with kids’ programming. Nothing felt standard.",
    name: "Rahul & Aditi, Singapore",
  },
  {
    quote:
      "Our concierge used WhatsApp voice notes to tweak the itinerary in real time. Every edit was executed within minutes.",
    name: "Daniela, Madrid",
  },
];

const TestimonialsStrip = () => (
  <section className="mt-16 w-full bg-slate-50">
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-0">
      <p className="font-tiktok text-xs uppercase tracking-[0.4em] text-primary-bright">
        Loved by guests
      </p>
      <div className="grid gap-6 lg:grid-cols-3">
        {testimonials.map((item) => (
          <article
            key={item.name}
            className="rounded-3xl border border-white/60 bg-white p-6 shadow-sm"
          >
            <Quote className="mb-4 text-primary-bright" size={28} />
            <p className="text-sm text-slate-600">{item.quote}</p>
            <p className="mt-4 font-semibold text-slate-900">{item.name}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsStrip;
