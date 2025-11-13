"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Bell,
  Globe,
  Menu,
  Search,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";


const navLinks = [
  { label: "Stays", href: "#stays" },
  { label: "Experiences", href: "#experiences" },
  { label: "Dining", href: "#dining" },
  { label: "Concierge", href: "#concierge" },
];

const currentLang = "en";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/30 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <Image src="/logo-primary.png" alt="13 Travelro Dubai" width={80} height={42} />
         
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative transition hover:text-primary-bright"
            >
              {item.label}
              <span className="absolute inset-x-0 -bottom-2 hidden h-0.5 rounded-full bg-primary-bright/70 group-hover:block" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Search"
            className="text-primary-bright hover:bg-primary-bright/10"
          >
            <Search size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Notifications"
            className="text-primary-bright hover:bg-primary-bright/10"
          >
            <Bell size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Account"
            className="text-primary-bright hover:bg-primary-bright/10"
          >
            <User size={18} />
          </Button>
          <div className="hidden items-center gap-1 rounded-full border border-primary-bright/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-bright md:flex">
            <Globe size={16} />
            {currentLang}
          </div>
          <Button className="hidden rounded-full bg-primary-bright px-5 text-white shadow-sm hover:bg-primary-dark md:inline-flex">
            Plan a trip
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle navigation"
            className="lg:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="border-t border-white/20 bg-white/95 px-4 py-4 shadow-lg lg:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium text-slate-700">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 hover:bg-primary-bright/10"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button className="flex-1 rounded-full bg-primary-bright text-white hover:bg-primary-dark">
              Plan a trip
            </Button>
            <div className="flex flex-1 min-w-[150px] items-center justify-around rounded-2xl border border-slate-200 px-4 py-2">
              <Globe size={16} className="text-primary-bright" />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                {currentLang}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
