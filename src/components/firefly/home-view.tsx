'use client';

import Image from 'next/image';
import { BRAND, PILLARS, REVIEWS, type View } from '@/lib/firefly-data';
import { FireflyField, Kicker } from './chrome';
import {
  Star, MapPin, Clock, Phone, ArrowRight, MessageCircle,
  UtensilsCrossed, CalendarHeart, ShoppingBag, Sparkles, Bike,
} from 'lucide-react';

export default function HomeView({ go }: { go: (v: View) => void }) {
  return (
    <div>
      {/* ============================== HERO ============================== */}
      <section className="relative min-h-[100svh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/firefly/hero-real.png"
            alt="Inside Firefly Café — cream tufted sofas beneath warm golden light lines"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_62%] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/55 to-espresso/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso/80 via-transparent to-espresso/40" />
        </div>
        <FireflyField count={16} />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 pb-20 sm:pb-28 pt-36">
          <p className="rise-in text-gold/90 uppercase tracking-[0.34em] text-[11px] sm:text-xs mb-5 flicker">
            Awka · Anambra · Open till 11 pm
          </p>
          <h1
            className="rise-in font-display text-cream leading-[1.02] text-[13vw] sm:text-7xl lg:text-8xl max-w-4xl"
            style={{ animationDelay: '0.12s' }}
          >
            Firefly
            <span className="block gold-gradient-text text-glow italic">Café</span>
          </h1>
          <p
            className="rise-in mt-5 text-cream/75 text-lg sm:text-2xl font-light max-w-xl leading-relaxed"
            style={{ animationDelay: '0.24s' }}
          >
            {BRAND.tagline}.
          </p>
          <div
            className="rise-in mt-9 flex flex-wrap items-center gap-3.5"
            style={{ animationDelay: '0.36s' }}
          >
            <button
              onClick={() => go('book')}
              className="ember-pulse group inline-flex items-center gap-2.5 rounded-full bg-gold px-7 py-3.5 text-espresso text-sm font-medium uppercase tracking-[0.14em] hover:bg-cream transition-colors duration-300"
            >
              <CalendarHeart className="w-4 h-4" />
              Reserve a Table
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => go('order')}
              className="inline-flex items-center gap-2.5 rounded-full border border-cream/25 px-7 py-3.5 text-cream text-sm uppercase tracking-[0.14em] hover:border-gold hover:text-gold transition-colors duration-300 backdrop-blur-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Order Ahead
            </button>
          </div>

          <div
            className="rise-in mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px] text-cream/55"
            style={{ animationDelay: '0.5s' }}
          >
            <span className="flex items-center gap-2">
              <span className="flex" aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                ))}
                <span className="relative inline-flex">
                  <Star className="w-3.5 h-3.5 text-gold/35" />
                  <span className="absolute inset-0 overflow-hidden" style={{ width: '30%' }}>
                    <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                  </span>
                </span>
              </span>
              {BRAND.rating} on Google
            </span>
            <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gold/80" />{BRAND.addressShort}</span>
            <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-gold/80" />{BRAND.hoursLine}</span>
          </div>

          <div
            className="rise-in mt-5 inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-gold/8 backdrop-blur-sm px-5 py-2.5 text-[12px] sm:text-[13px] text-cream/75"
            style={{ animationDelay: '0.58s' }}
          >
            <Bike className="w-4 h-4 text-gold shrink-0" />
            <span>
              <span className="text-gold">We deliver</span> — every UNIZIK campus terminal, hostel &amp; lodge, plus all of Awka and its axis
            </span>
          </div>
        </div>
      </section>

      {/* ========================= WELCOME / STORY ========================= */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <div className="relative">
            <div className="relative aspect-[4/5] sm:aspect-[5/6] overflow-hidden rounded-[2rem] border border-gold/15">
              <Image
                src="/firefly/interior-warm.png"
                alt="Warm pools of lamplight over lounge tables at Firefly Café"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/50 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-3 sm:-right-6 w-36 sm:w-48 aspect-square overflow-hidden rounded-[1.5rem] border-4 border-espresso shadow-2xl shadow-black/60 rotate-3">
              <Image
                src="/firefly/dish-coffee.png"
                alt="Signature cappuccino with rosetta latte art"
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
            <FireflyField count={6} />
          </div>

          <div>
            <Kicker>A note, before you visit</Kicker>
            <h2 className="font-display text-4xl sm:text-5xl text-cream leading-[1.08]">
              There is a particular kind of{' '}
              <span className="gold-gradient-text italic">room</span> people
              describe without meaning to
            </h2>
            <div className="mt-7 grid gap-5 text-cream/65 leading-[1.85] font-light text-[15.5px]">
              <p>
                The cozy corner for a first date. The quiet table where a family lingers a
                little longer than planned. The plate that arrives and makes someone feel,
                if only for an hour, like they have stepped somewhere far more exclusive
                than the address suggests.
              </p>
              <p>
                That is the room we have already built — in how our guests talk about their
                evenings here, the warmth, the care, the sense of being genuinely looked
                after. Every dish leaves the kitchen the way the light hits the wall at
                8 pm: deliberate.
              </p>
            </div>
            <div className="mt-9 flex flex-wrap gap-6">
              {[
                { icon: UtensilsCrossed, label: 'Smoky grills & signature jollof' },
                { icon: Sparkles, label: 'Room made for occasions' },
                { icon: MessageCircle, label: 'One tap away on WhatsApp' },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-2.5 text-cream/70 text-sm">
                  <Icon className="w-4 h-4 text-gold" />
                  {label}
                </span>
              ))}
            </div>
            <button
              onClick={() => go('menu')}
              className="group mt-9 inline-flex items-center gap-2 text-gold uppercase tracking-[0.2em] text-[13px] hover:text-cream transition-colors"
            >
              Explore the menu
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================ PILLARS ============================ */}
      <section className="relative py-24 sm:py-28 bg-espresso-deep/60 border-y border-gold/10 overflow-hidden">
        <FireflyField count={8} />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl mb-14">
            <Kicker>What waits inside</Kicker>
            <h2 className="font-display text-4xl sm:text-5xl text-cream leading-tight">
              Five pillars, one seamless <span className="italic gold-gradient-text">glow</span>
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => go(p.id as View)}
                className={`group relative text-left rounded-3xl card-sheen border border-gold/12 p-7 sm:p-8 transition-all duration-500 hover:border-gold/40 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/50 ${
                  i === 0 ? 'lg:col-span-2' : ''
                } ${i === 4 ? 'sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-gold/12 via-card to-card' : ''}`}
              >
                <p className="text-gold/70 uppercase tracking-[0.26em] text-[11px] mb-4">{p.kicker}</p>
                <h3 className="font-display text-2xl sm:text-[1.7rem] text-cream group-hover:text-gold transition-colors duration-300">
                  {p.title}
                </h3>
                <p className="mt-3.5 text-cream/55 text-[14.5px] leading-relaxed font-light max-w-md">
                  {p.text}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-gold/0 group-hover:text-gold/90 transition-all duration-300">
                  Step in <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            ))}

            <div className="relative rounded-3xl overflow-hidden border border-gold/12 min-h-[240px] sm:col-span-2 lg:col-span-3">
              <Image
                src="/firefly/dish-grill.png"
                alt="Whole grilled tilapia with pepper sauce"
                fill
                sizes="100vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/20 to-transparent" />
              <p className="absolute bottom-5 left-6 font-display text-cream/90 text-lg italic">
                &ldquo;Smoky, unhurried — exactly how an evening should taste.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ REVIEWS ============================ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <Kicker>Guest reviews</Kicker>
              <h2 className="font-display text-4xl sm:text-5xl text-cream leading-tight">
                The evenings people <span className="italic gold-gradient-text">talk about</span>
              </h2>
            </div>
            <a
              href={BRAND.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-5 py-2.5 text-[12px] uppercase tracking-[0.16em] text-gold hover:bg-gold hover:text-espresso transition-all duration-300"
            >
              <Star className="w-3.5 h-3.5" /> {BRAND.rating} on Google Maps
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure
                key={r.name}
                className="rounded-3xl card-sheen border border-gold/12 p-7 flex flex-col transition-all duration-500 hover:border-gold/35 hover:-translate-y-1"
              >
                <span className="flex gap-1 mb-4" aria-label={`${r.stars} out of 5 stars`}>
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </span>
                <blockquote className="text-cream/75 leading-[1.8] font-light text-[15px] flex-1">
                  &ldquo;{r.text}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 text-gold font-display flex items-center justify-center text-sm">
                    {r.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-cream text-sm">{r.name}</span>
                    <span className="block text-cream/40 text-xs">{r.context}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= CELEBRATE TEASER ========================= */}
      <section className="relative py-24 sm:py-32 overflow-hidden border-t border-gold/10">
        <div className="absolute inset-0">
          <Image
            src="/firefly/celebration-table.png"
            alt="A celebration table lit by candles with gold-rimmed glassware"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-espresso/72" />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso via-espresso/60 to-transparent" />
        </div>
        <FireflyField count={12} />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-xl">
            <Kicker>05 — Celebrations</Kicker>
            <h2 className="font-display text-4xl sm:text-6xl text-cream leading-[1.05]">
              Birthdays already choose <span className="gold-gradient-text italic">Firefly</span>
            </h2>
            <p className="mt-5 text-cream/70 leading-[1.85] font-light">
              Now the website says so first. Cake, décor, a photographer, or a surprise
              setup we keep completely quiet about — tell us the occasion and the table
              will be ready in spirit as well as setting.
            </p>
            <div className="mt-9 flex flex-wrap gap-3.5">
              <button
                onClick={() => go('celebrate')}
                className="group inline-flex items-center gap-2.5 rounded-full bg-gold px-7 py-3.5 text-espresso text-sm font-medium uppercase tracking-[0.14em] hover:bg-cream transition-colors duration-300"
              >
                Plan your evening
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <a
                href={BRAND.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-cream/25 px-7 py-3.5 text-cream text-sm uppercase tracking-[0.14em] hover:border-gold hover:text-gold transition-colors duration-300"
              >
                <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= VISIT / LOCATION ========================= */}
      <section className="py-24 sm:py-32 bg-espresso-deep/60 border-t border-gold/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            <div className="flex flex-col justify-center">
              <Kicker>Hours &amp; location</Kicker>
              <h2 className="font-display text-4xl sm:text-5xl text-cream leading-tight mb-8">
                Find the <span className="italic gold-gradient-text">glow</span>
              </h2>
              <ul className="grid gap-5 text-cream/70 font-light">
                <li className="flex items-start gap-4">
                  <span className="mt-1 w-10 h-10 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-gold" />
                  </span>
                  <span>
                    <span className="block text-cream text-[15px] mb-0.5">The address</span>
                    {BRAND.address}
                    <span className="block text-cream/40 text-xs mt-1">Plus Code: {BRAND.plusCode}</span>
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-1 w-10 h-10 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-gold" />
                  </span>
                  <span>
                    <span className="block text-cream text-[15px] mb-0.5">Hours</span>
                    Monday – Sunday · 10:00 — 23:00
                    <span className="block text-cream/40 text-xs mt-1">Kitchen takes last orders 30 minutes before close</span>
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-1 w-10 h-10 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-gold" />
                  </span>
                  <span>
                    <span className="block text-cream text-[15px] mb-0.5">Reach us</span>
                    <a href={`tel:${BRAND.phone}`} className="hover:text-gold transition-colors">{BRAND.phoneDisplay}</a>
                    <span className="block text-cream/40 text-xs mt-1">Call, or one tap to WhatsApp — however you prefer</span>
                  </span>
                </li>
              </ul>
              <a
                href={BRAND.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-9 inline-flex items-center gap-2.5 rounded-full border border-gold/35 px-6 py-3 text-gold text-[12px] uppercase tracking-[0.18em] hover:bg-gold hover:text-espresso transition-all duration-300 w-fit"
              >
                Get directions
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>

            <div className="relative min-h-[340px] rounded-[2rem] overflow-hidden border border-gold/15">
              <iframe
                title="Map — Firefly Café, 18 Sir Andy Umeoji Street, Awka"
                src={BRAND.mapEmbed}
                className="absolute inset-0 w-full h-full grayscale-[0.35] sepia-[0.25] contrast-[1.05]"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto rounded-2xl bg-espresso/85 backdrop-blur-md border border-gold/20 px-5 py-3.5 flex items-center gap-3">
                <FireflyDot />
                <span className="text-cream/85 text-sm">We are here — 18 Sir Andy Umeoji St.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ CLOSING ============================ */}
      <section className="relative py-28 sm:py-36 overflow-hidden">
        <FireflyField count={18} />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <p className="text-gold/80 uppercase tracking-[0.3em] text-[11px] mb-6">Next steps</p>
          <h2 className="font-display text-5xl sm:text-6xl text-cream leading-[1.05]">
            Let&apos;s light <span className="gold-gradient-text italic text-glow">this up</span>
          </h2>
          <p className="mt-6 text-cream/60 font-light leading-relaxed text-lg">
            The table is ready, the grill is lit and the evening is already glowing.
            All that is missing is you.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3.5">
            <button
              onClick={() => go('book')}
              className="rounded-full bg-gold px-8 py-4 text-espresso text-sm font-medium uppercase tracking-[0.14em] hover:bg-cream transition-colors duration-300"
            >
              Reserve a Table
            </button>
            <button
              onClick={() => go('menu')}
              className="rounded-full border border-cream/25 px-8 py-4 text-cream text-sm uppercase tracking-[0.14em] hover:border-gold hover:text-gold transition-colors duration-300"
            >
              Browse the Menu
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FireflyDot() {
  return (
    <span className="relative inline-flex w-2.5 h-2.5" aria-hidden="true">
      <span className="absolute inset-0 rounded-full bg-gold ember-pulse" />
      <span className="absolute -inset-1 rounded-full bg-gold/30 blur-[3px]" />
    </span>
  );
}
