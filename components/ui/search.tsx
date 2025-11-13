import { Clock5, Gem, MapPin, Search, ShieldCheck, Sparkles, } from "lucide-react";
import React, { useState } from "react";


const options = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Fujairah",
  "Ras Al Khaimah",
  "Umm Al Quwain",
  "All Cities",
];

const reasons = [
  {
    icon: ShieldCheck,
    title: "Licensed guides",
    copy: "Every host is accredited and vetted so you get insider access with total peace of mind.",
  },
  {
    icon: Clock5,
    title: "Flexible changes",
    copy: "Plans shift. Reschedule most experiences up to 24h before check-in without the drama.",
  },
  {
    icon: Sparkles,
    title: "Signature moments",
    copy: "From desert dinners to rooftop suites, we curate only the itineraries worth bragging about.",
  },
  {
    icon: Gem,
    title: "Transparent value",
    copy: "No surprise markups—just premium perks and upgrades negotiated directly with our partners.",
  },
];

const SearchSection = () => {
  const [city, setCity] = useState("");
  const [activity, setActivity] = useState("");


  return (
    <section className="mt-8 sm:mt-12 lg:mt-16 rounded-3xl bg-white/5 p-4 sm:p-6 shadow-lg ring-1 ring-white/10 backdrop-blur">
      <div className="flex flex-col gap-5">
        <div className="flex flex-1 flex-col gap-5 rounded-3xl bg-white p-5 sm:p-7 shadow-lg">
          <p className="font-tiktok text-xs tracking-[0.4em] text-primary-bright">
            Plan your escape
          </p>
          <h2 className="font-funnel text-2xl text-foreground">
            Find your next Dubai story
          </h2>
          <p className="text-sm text-slate-500">
            Tell us where you want to wake up and what vibe you’re chasing. We’ll pair
            sky-high suites, desert adventures, and chef’s tables into one seamless plan.
          </p>
          <div className="flex flex-col gap-4">
            <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-5 py-4">
              <MapPin className="text-primary-bright" size={18} />
              <select
                title="Select city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent text-base text-slate-900 outline-none"
              >
                <option value="" disabled>
                  City
                </option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-5 py-4">
              <Search className="text-primary-bright" size={18} />
              <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>
          </div>
          <button
            type="button"
            className="w-full rounded-2xl bg-primary-bright py-4 font-semibold text-white shadow hover:bg-primary-dark transition"
          >
            Search trips
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-white/20  bg-gradient-to-b from-slate-900/80 to-slate-900/30 p-4 sm:p-6 text-white">
          <p className="font-tiktok text-xs tracking-[0.4em] text-secondary">
            Why book with us
          </p>
          <h2 className="font-funnel text-2xl sm:text-3xl">
            Tailor-made adventures. Zero guesswork.
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {reasons.map(({ icon: Icon, title, copy }) => (
              <li
                key={title}
                className="flex items-start gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/20"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-bright/20 text-primary-bright">
                  <Icon size={18} aria-hidden />
                </div>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-white/80">{copy}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
