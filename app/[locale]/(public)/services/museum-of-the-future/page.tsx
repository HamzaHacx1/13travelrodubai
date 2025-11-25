import { Accessibility, CheckCircle2, Clock, Globe, MapPin, MessageCircle, Phone, RefreshCw, Shield, ShieldCheck, Smartphone, Star, Ticket, Users, } from "lucide-react";
import { Link as LocalizedLink } from "@/navigation";
import { Button } from "@/components/ui/button";
import { routing, type Locale } from "@/i18n";
import Header from "@/components/ui/Header";
import type { ComponentType } from "react";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";


type QuickFactIcon =
  | "clock"
  | "language"
  | "ticket"
  | "mobile"
  | "group"
  | "access";
type LocalizedHref = Parameters<typeof LocalizedLink>[0]["href"];

const toLocalizedHref = (target: string): LocalizedHref => {
  if (target.startsWith("/#")) {
    return { pathname: "/", hash: target.slice(2) };
  }
  return target as LocalizedHref;
};

type ServiceContent = {
  breadcrumbs: {
    home: string;
    category: string;
    current: string;
  };
  hero: {
    tag: string;
    title: string;
    description: string;
    location: string;
    ratingLabel: string;
    reviewCount: string;
    badge: string;
    ctaPrimary: string;
    ctaSecondary: string;
    note: string;
  };
  quickFacts: Array<{
    icon: QuickFactIcon;
    label: string;
    value: string;
  }>;
  overview: string[];
  highlightsTitle: string;
  highlights: string[];
  includesTitle: string;
  includes: string[];
  excludesTitle: string;
  excludes: string[];
  meetingPoint: {
    title: string;
    description: string;
    address: string;
    note: string;
    mapLabel: string;
  };
  timelineTitle: string;
  timeline: Array<{
    time: string;
    title: string;
    description: string;
  }>;
  policiesTitle: string;
  policies: Array<{
    title: string;
    description: string;
  }>;
  booking: {
    title: string;
    subheading: string;
    startingFrom: string;
    perAdult: string;
    perks: string[];
    button: string;
    secondary: string;
    disclaimer: string;
  };
  faqTitle: string;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  reviews: {
    title: string;
    summary: string;
    items: Array<{
      author: string;
      score: string;
      text: string;
    }>;
  };
  contact: {
    title: string;
    phoneLabel: string;
    phone: string;
    whatsappLabel: string;
  };
  suggestions: {
    title: string;
    items: Array<{
      title: string;
      subtitle: string;
      href: string;
    }>;
  };
};

const quickFactIconMap: Record<
  QuickFactIcon,
  ComponentType<{ size?: number }>
> = {
  clock: Clock,
  language: Globe,
  ticket: Ticket,
  mobile: Smartphone,
  group: Users,
  access: Accessibility,
};

const policyIcons = [ShieldCheck, RefreshCw, Shield];

const galleryImages = [
  {
    src: "/services/service-1.jpg",
    span: "col-span-2 row-span-2 min-h-[260px]",
  },
  { src: "/services/service-3.jpg", span: "" },
  { src: "/services/service-6.jpg", span: "" },
  { src: "/services/service-4.jpg", span: "" },
];

const serviceContent: Record<Locale, ServiceContent> = {
  en: {
    breadcrumbs: {
      home: "Home",
      category: "Experiences",
      current: "Museum of the Future Immersive Pass",
    },
    hero: {
      tag: "Featured experience",
      title: "Museum of the Future Immersive Access Pass",
      description:
        "Step beyond the velvet rope with a timed admission that guides you through five interactive chapters packed with storytellers, projections, and multi-sensory rooms.",
      location: "Dubai, United Arab Emirates",
      ratingLabel: "4.8/5",
      reviewCount: "1,250 travelers",
      badge: "Likely to sell out",
      ctaPrimary: "Check availability",
      ctaSecondary: "Share itinerary",
      note: "Ticket supplied by 13 Travelro concierge partner.",
    },
    quickFacts: [
      { icon: "clock", label: "Duration", value: "75 minutes" },
      {
        icon: "language",
        label: "Languages",
        value: "English & Arabic narration",
      },
      { icon: "ticket", label: "Ticket type", value: "Mobile ticket accepted" },
      { icon: "mobile", label: "Confirmation", value: "Instant after booking" },
      { icon: "group", label: "Group size", value: "Max 20 guests per slot" },
      { icon: "access", label: "Accessibility", value: "Wheelchair friendly" },
    ],
    overview: [
      "Traverse five immersive chapters—from OSS Hope to Future Heroes—with narration that imagines Dubai in 2071. Light, scent, and kinetic installations keep every traveler engaged.",
      "Timed entry ensures minimal waiting while a concierge host ushers you through security, gives headset tips, and captures keepsake photos as you explore.",
    ],
    highlightsTitle: "Highlights",
    highlights: [
      "Travel to 2071 aboard the OSS Hope shuttle simulation.",
      "Interact with sensory therapy pods inside Al-Waha.",
      "Discover prototypes shaping Dubai’s next decade in Tomorrow Today.",
      "Let kids design inventions within the Future Heroes lab.",
    ],
    includesTitle: "What’s included",
    includes: [
      "Timed admission ticket to Museum of the Future",
      "Access to all five narrative chapters",
      "Dedicated concierge host for entry assistance",
      "Complimentary digital photo download",
      "10% savings on Museum retail purchases",
    ],
    excludesTitle: "What’s not included",
    excludes: [
      "Hotel transfers or private driver",
      "Food, drinks, or café purchases",
      "VR add-ons sold on-site",
    ],
    meetingPoint: {
      title: "Meeting point",
      description:
        "Arrive 15 minutes before your slot for security and check-in.",
      address: "Museum of the Future, Sheikh Zayed Road, Dubai",
      note: "Look for the ‘Timed Experiences’ lane beside the escalators.",
      mapLabel: "Open in Google Maps",
    },
    timelineTitle: "What to expect",
    timeline: [
      {
        time: "0:00",
        title: "Arrival & security",
        description:
          "Concierge scans your mobile ticket and guides you through the express lane.",
      },
      {
        time: "0:10",
        title: "Launch to OSS Hope",
        description:
          "Ride the immersive elevator to the orbital station with narration by 2071 archivists.",
      },
      {
        time: "0:30",
        title: "Healing Institute & Al-Waha",
        description:
          "Experience AI-guided reforestation labs followed by the multi-sensory relaxation garden.",
      },
      {
        time: "0:55",
        title: "Tomorrow Today & Future Heroes",
        description:
          "Test prototypes, then hand younger travelers over to the supervised inventors’ lab.",
      },
    ],
    policiesTitle: "Policies & terms",
    policies: [
      {
        title: "Free cancellation",
        description: "Cancel up to 24 hours in advance for a full refund.",
      },
      {
        title: "Reserve now, pay later",
        description:
          "Secure your slot today and settle the balance closer to the experience.",
      },
      {
        title: "Health & safety",
        description:
          "Thermal scans and UV-sanitized touchpoints keep each gallery compliant.",
      },
    ],
    booking: {
      title: "Check availability",
      subheading: "Secure your slot before it sells out",
      startingFrom: "From $45.00",
      perAdult: "per adult",
      perks: [
        "Skip-the-line access",
        "Instant confirmation",
        "Free cancellation up to 24h",
      ],
      button: "Reserve now",
      secondary: "Message concierge",
      disclaimer: "You won't be charged today.",
    },
    faqTitle: "Frequently asked questions",
    faq: [
      {
        question: "Do I need to print the ticket?",
        answer:
          "No, the concierge sends a QR code that’s scanned directly from your phone.",
      },
      {
        question: "Are children allowed?",
        answer:
          "Yes. Children under 4 enter free, and Future Heroes is included for ages 6-12.",
      },
      {
        question: "Can I reschedule?",
        answer:
          "One date change is complimentary up to 24 hours before your visit.",
      },
    ],
    reviews: {
      title: "Traveler reviews",
      summary: "98% of guests recommend this experience.",
      items: [
        {
          author: "Lina — May 2024",
          score: "5/5",
          text: "The timed entry meant zero waiting and the concierge even grabbed our photo downloads.",
        },
        {
          author: "Omar — Feb 2024",
          score: "4/5",
          text: "Interactive rooms feel straight out of a movie. Book an evening slot for dramatic lighting.",
        },
        {
          author: "Soraya — Nov 2023",
          score: "5/5",
          text: "Our kids vanished into Future Heroes while we lingered in Tomorrow Today. Perfect balance.",
        },
      ],
    },
    contact: {
      title: "Need help deciding?",
      phoneLabel: "Call concierge",
      phone: "+971 4 555 0101",
      whatsappLabel: "Chat on WhatsApp",
    },
    suggestions: {
      title: "You may also like",
      items: [
        {
          title: "Skyline Helicopter Circuit",
          subtitle: "12-minute private flight over Palm Jumeirah",
          href: "/#experiences",
        },
        {
          title: "Hot Air Balloon + Breakfast",
          subtitle: "Sunrise over the desert with chef-led picnic",
          href: "/#experiences",
        },
      ],
    },
  },
  ro: {
    breadcrumbs: {
      home: "Acasă",
      category: "Experiențe",
      current: "Museum of the Future - acces imersiv",
    },
    hero: {
      tag: "Experiență recomandată",
      title: "Acces imersiv la Museum of the Future",
      description:
        "Intră înaintea mulțimii cu un bilet programat care te poartă prin cinci capitole interactive pline de ghizi povestitori, proiecții și camere multisenzoriale.",
      location: "Dubai, Emiratele Arabe Unite",
      ratingLabel: "4,8/5",
      reviewCount: "1.250 de călători",
      badge: "Se epuizează rapid",
      ctaPrimary: "Verifică disponibilitatea",
      ctaSecondary: "Trimite itinerarul",
      note: "Bilet emis de partenerul concierge 13 Travelro.",
    },
    quickFacts: [
      { icon: "clock", label: "Durată", value: "75 de minute" },
      {
        icon: "language",
        label: "Limbi",
        value: "Narațiune în engleză și arabă",
      },
      { icon: "ticket", label: "Tip bilet", value: "Bilet digital acceptat" },
      { icon: "mobile", label: "Confirmare", value: "Instant după rezervare" },
      {
        icon: "group",
        label: "Grup",
        value: "Maximum 20 de oaspeți per interval",
      },
      {
        icon: "access",
        label: "Accesibilitate",
        value: "Potrivit pentru scaun rulant",
      },
    ],
    overview: [
      "Parcurge cinci capitole imersive — de la OSS Hope la Future Heroes — cu o narațiune care imaginează Dubaiul în 2071. Lumini, arome și instalații cinetice țin toți oaspeții implicați.",
      "Intrările temporizate reduc cozile, iar concierge-ul te ghidează prin securitate, îți explică accesoriile audio și surprinde fotografii memorabile.",
    ],
    highlightsTitle: "Momente cheie",
    highlights: [
      "Călătorește spre 2071 la bordul navetei OSS Hope.",
      "Testează capsulele senzoriale din spațiul Al-Waha.",
      "Descoperă prototipurile care vor modela următorul deceniu în Tomorrow Today.",
      "Lasă-i pe cei mici să-și creeze invențiile în laboratorul Future Heroes.",
    ],
    includesTitle: "Ce este inclus",
    includes: [
      "Bilet temporizat la Museum of the Future",
      "Acces la toate cele cinci capitole narative",
      "Asistență la intrare din partea concierge-ului dedicat",
      "Descărcare gratuită a fotografiilor digitale",
      "Reducere de 10% la magazinul muzeului",
    ],
    excludesTitle: "Nu este inclus",
    excludes: [
      "Transferuri la hotel sau șofer privat",
      "Mâncare, băuturi ori achiziții din cafenea",
      "Experiențele VR opționale de la fața locului",
    ],
    meetingPoint: {
      title: "Punct de întâlnire",
      description:
        "Sosește cu 15 minute înainte pentru securitate și check-in.",
      address: "Museum of the Future, Sheikh Zayed Road, Dubai",
      note: "Caută culoarul „Timed Experiences” de lângă scările rulante.",
      mapLabel: "Deschide în Google Maps",
    },
    timelineTitle: "Cum se desfășoară",
    timeline: [
      {
        time: "0:00",
        title: "Sosire și securitate",
        description:
          "Concierge-ul scanează biletul digital și te conduce pe culoarul rapid.",
      },
      {
        time: "0:10",
        title: "Lansare spre OSS Hope",
        description:
          "Urcă în liftul imersiv către stația orbitală, cu naratori din anul 2071.",
      },
      {
        time: "0:30",
        title: "Healing Institute & Al-Waha",
        description:
          "Vizitează laboratoarele de reîmpădurire asistate de AI și spațiul de relaxare multisenzorial.",
      },
      {
        time: "0:55",
        title: "Tomorrow Today & Future Heroes",
        description:
          "Testează prototipuri, apoi lasă-i pe cei mici sub supraveghere în laboratorul inventatorilor.",
      },
    ],
    policiesTitle: "Politici & condiții",
    policies: [
      {
        title: "Anulare gratuită",
        description:
          "Anulează cu până la 24h înainte pentru rambursare integrală.",
      },
      {
        title: "Rezervă acum, plătești mai târziu",
        description:
          "Blochează-ți locul astăzi și achită mai aproape de experiență.",
      },
      {
        title: "Siguranță",
        description:
          "Scanări termice și suprafețe igienizate cu UV în fiecare galerie.",
      },
    ],
    booking: {
      title: "Verifică disponibilitatea",
      subheading: "Asigură-ți locul înainte să se ocupe",
      startingFrom: "De la 45 USD",
      perAdult: "de persoană",
      perks: [
        "Acces prin linia rapidă",
        "Confirmare instant",
        "Anulare gratuită până la 24h",
      ],
      button: "Rezervă acum",
      secondary: "Scrie concierge-ului",
      disclaimer: "Nu plătești acum.",
    },
    faqTitle: "Întrebări frecvente",
    faq: [
      {
        question: "Trebuie să printez biletul?",
        answer:
          "Nu, concierge-ul trimite un cod QR care este scanat direct de pe telefon.",
      },
      {
        question: "Copiii au acces?",
        answer:
          "Da. Copiii sub 4 ani intră gratuit, iar Future Heroes este inclus pentru 6-12 ani.",
      },
      {
        question: "Pot reprograma?",
        answer: "Poți modifica o dată gratuit cu până la 24 de ore înainte.",
      },
    ],
    reviews: {
      title: "Recenzii",
      summary: "98% dintre oaspeți recomandă această experiență.",
      items: [
        {
          author: "Lina — mai 2024",
          score: "5/5",
          text: "Intrarea temporizată a eliminat așteptarea, iar concierge-ul ne-a trimis fotografiile digitale.",
        },
        {
          author: "Omar — feb 2024",
          score: "4/5",
          text: "Camerele interactive par scoase dintr-un film. Alege o vizită seara pentru lumine dramatică.",
        },
        {
          author: "Soraya — nov 2023",
          score: "5/5",
          text: "Copiii au dispărut în Future Heroes, iar noi am explorat pe îndelete Tomorrow Today. Echilibru perfect.",
        },
      ],
    },
    contact: {
      title: "Ai nevoie de ajutor?",
      phoneLabel: "Sună concierge-ul",
      phone: "+971 4 555 0101",
      whatsappLabel: "Scrie pe WhatsApp",
    },
    suggestions: {
      title: "Experiențe similare",
      items: [
        {
          title: "Skyline Helicopter Circuit",
          subtitle: "Zbor privat de 12 minute peste Palm Jumeirah",
          href: "/#experiences",
        },
        {
          title: "Zbor cu balonul + mic dejun",
          subtitle: "Răsărit peste deșert și picnic cu chef",
          href: "/#experiences",
        },
      ],
    },
  },
};

const DEFAULT_LOCALE = routing.defaultLocale as Locale;

const getServiceContent = (locale?: string): ServiceContent => {
  const resolvedLocale: Locale =
    typeof locale === "string" && hasLocale(routing.locales, locale)
      ? locale
      : DEFAULT_LOCALE;
  return serviceContent[resolvedLocale];
};

type PageProps = {
  params: { locale?: string };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = params;
  const content = getServiceContent(locale);

  return {
    title: content.hero.title,
    description: content.hero.description,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { locale } = params;
  const content = getServiceContent(locale);

  return (
    <div className="bg-white">
      <Header />
      {/* HERO & BREADCRUMBS */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-0">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="order-1">
              <div className="grid auto-rows-[180px] gap-4 rounded-3xl bg-white p-4 shadow-xl sm:p-6 lg:grid-cols-2">
                {galleryImages.map((image, index) => (
                  <div
                    key={`${image.src}-${index}`}
                    className={`relative overflow-hidden rounded-2xl ${image.span || ""}`}
                  >
                    <Image
                      src={image.src}
                      alt={content.hero.title}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="order-2 space-y-6">
              <nav className="text-xs uppercase tracking-[0.3em] text-white/70">
                <LocalizedLink href="/" className="hover:text-secondary">
                  {content.breadcrumbs.home}
                </LocalizedLink>
                <span className="mx-2">/</span>
                <LocalizedLink href="/" className="hover:text-secondary">
                  {content.breadcrumbs.category}
                </LocalizedLink>
                <span className="mx-2">/</span>
                {/* <span className="text-white">{content.breadcrumbs.current}</span> */}
              </nav>

              <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-secondary">
                  {content.hero.tag}
                </p>

                <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                  {content.hero.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <Star size={18} className="text-secondary" />
                    {content.hero.ratingLabel}
                  </span>
                  <span>{content.hero.reviewCount}</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={16} className="text-secondary" />
                    {content.hero.location}
                  </span>
                  <span className="rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-wide">
                    {content.hero.badge}
                  </span>
                </div>

                <p className="max-w-3xl text-base text-white/85">
                  {content.hero.description}
                </p>
                <p className="text-xs text-white/60">{content.hero.note}</p>

                <div className="flex flex-wrap gap-3">
                  <Button className="rounded-2xl bg-secondary px-6 text-slate-950 hover:bg-secondary/80">
                    {content.hero.ctaPrimary}
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-2xl border-white/40 bg-primary px-6 text-white hover:bg-primary-bright/10 hover:text-white"
                  >
                    {content.hero.ctaSecondary}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto mt-14 w-full max-w-6xl gap-10 px-4 pb-16 sm:px-6 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:px-0">
        <article className="space-y-10">
          {/* QUICK FACTS */}
          <div className="grid gap-4 sm:grid-cols-2">
            {content.quickFacts.map((fact) => {
              const Icon = quickFactIconMap[fact.icon];
              return (
                <div
                  key={fact.label}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-bright/10 text-primary-bright">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      {fact.label}
                    </p>
                    <p className="text-base font-semibold text-slate-900">
                      {fact.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* OVERVIEW + HIGHLIGHTS */}
          <div className="space-y-4">
            {content.overview.map((paragraph) => (
              <p key={paragraph} className="text-base text-slate-600">
                {paragraph}
              </p>
            ))}

            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {content.highlightsTitle}
              </h2>
              <ul className="mt-4 space-y-2">
                {content.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-slate-600"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-1 text-primary-bright"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* INCLUDES / EXCLUDES */}
          <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {content.includesTitle}
              </h3>
              <ul className="mt-3 space-y-2 text-slate-600">
                {content.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2
                      size={16}
                      className="mt-1 text-primary-bright"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {content.excludesTitle}
              </h3>
              <ul className="mt-3 space-y-2 text-slate-600">
                {content.excludes.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 text-primary-bright">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* MEETING POINT */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              {content.meetingPoint.title}
            </h3>

            <p className="mt-2 text-slate-600">
              {content.meetingPoint.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} className="text-primary-bright" />
                {content.meetingPoint.address}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {content.meetingPoint.note}
            </p>

            <Link
              href="https://maps.google.com/?q=Museum+of+the+Future"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-bright hover:underline"
            >
              {content.meetingPoint.mapLabel}
            </Link>
          </div>

          {/* TIMELINE */}
          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              {content.timelineTitle}
            </h3>
            <ol className="mt-6 space-y-4 border-l border-slate-200 pl-6">
              {content.timeline.map((entry) => (
                <li key={entry.title} className="relative">
                  <span className="absolute -left-9 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary-bright text-xs font-semibold text-white">
                    {entry.time}
                  </span>
                  <h4 className="text-base font-semibold text-slate-900">
                    {entry.title}
                  </h4>
                  <p className="text-sm text-slate-600">{entry.description}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* POLICIES */}
          <div className="rounded-3xl border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-900">
              {content.policiesTitle}
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {content.policies.map((policy, index) => {
                const Icon = policyIcons[index % policyIcons.length];
                return (
                  <div
                    key={policy.title}
                    className="rounded-2xl border border-slate-100 p-4"
                  >
                    <Icon size={20} className="text-primary-bright" />
                    <h4 className="mt-3 text-base font-semibold text-slate-900">
                      {policy.title}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {policy.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">
              {content.faqTitle}
            </h3>

            {content.faq.map((item) => (
              <details
                key={item.question}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <summary className="cursor-pointer text-base font-semibold text-slate-900">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>

          {/* REVIEWS */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="text-xl font-semibold text-slate-900">
                {content.reviews.title}
              </h3>
              <p className="text-sm text-slate-600">
                {content.reviews.summary}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {content.reviews.items.map((review) => (
                <div
                  key={review.author}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-900">
                      {review.author}
                    </span>
                    <span className="inline-flex items-center gap-1 text-primary-bright">
                      <Star size={14} /> {review.score}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-600">{review.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SUGGESTIONS */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">
              {content.suggestions.title}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {content.suggestions.items.map((item) => (
                <LocalizedLink
                  key={item.title}
                  href="/"
                  className="rounded-2xl border border-slate-200 p-4 transition hover:border-primary-bright"
                >
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-600">{item.subtitle}</p>
                </LocalizedLink>
              ))}
            </div>
          </div>
        </article>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          {/* BOOKING CARD */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-xl font-semibold text-slate-900">
              {content.booking.title}
            </h3>

            <p className="text-sm text-slate-600">
              {content.booking.subheading}
            </p>

            <p className="mt-6 text-3xl font-semibold text-slate-900">
              {content.booking.startingFrom}
            </p>

            <p className="text-sm text-slate-600">{content.booking.perAdult}</p>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
              {content.booking.perks.map((perk) => (
                <div key={perk} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-primary-bright" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>

            <Button className="mt-6 w-full rounded-2xl bg-primary-bright text-white hover:bg-primary-dark">
              {content.booking.button}
            </Button>

            <Button
              variant="ghost"
              className="mt-2 w-full rounded-2xl border border-slate-200 text-slate-700 hover:bg-white"
            >
              {content.booking.secondary}
            </Button>

            <p className="mt-3 text-xs text-slate-500">
              {content.booking.disclaimer}
            </p>
          </div>

          {/* CONTACT CARD */}
          <div className="rounded-3xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              {content.contact.title}
            </h3>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <a
                href={`tel:${content.contact.phone}`}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3"
              >
                <Phone size={16} className="text-primary-bright" />
                <div>
                  <p className="font-semibold text-slate-900">
                    {content.contact.phoneLabel}
                  </p>
                  <p className="text-xs text-slate-500">
                    {content.contact.phone}
                  </p>
                </div>
              </a>

              <a
                href="https://wa.me/97145550101"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3"
              >
                <MessageCircle size={16} className="text-primary-bright" />
                <div>
                  <p className="font-semibold text-slate-900">
                    {content.contact.whatsappLabel}
                  </p>
                  <p className="text-xs text-slate-500">
                    {content.contact.phone}
                  </p>
                </div>
              </a>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
