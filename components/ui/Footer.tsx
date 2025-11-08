import Link from "next/link";


const footerLinks = [
  {
    title: "Plan",
    links: [
      { label: "Stays", href: "#stays" },
      { label: "Experiences", href: "#experiences" },
      { label: "Private Dining", href: "#dining" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Journal", href: "#journal" },
      { label: "Careers", href: "#careers" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "#contact" },
      { label: "FAQs", href: "#faqs" },
      { label: "Terms", href: "#terms" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-slate-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <p className="font-tiktok text-xs tracking-[0.4em] text-secondary">
              13 Travelro Dubai
            </p>
            <h3 className="max-w-lg font-funnel text-3xl">
              Ultra-tailored itineraries since 2013.
            </h3>
            <p className="max-w-md text-sm text-white/70">
              We obsess over every transfer, tasting menu, and turndown so you don’t
              have to. Swap this copy with your own story when you’re ready.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <p className="font-semibold text-white">{group.title}</p>
                <ul className="mt-3 space-y-2 text-sm text-white/70">
                  {group.links.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="transition hover:text-secondary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} 13 Travelro. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#privacy" className="hover:text-secondary">
              Privacy
            </Link>
            <Link href="#terms" className="hover:text-secondary">
              Terms
            </Link>
            <Link href="#cookies" className="hover:text-secondary">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
