'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  BRAND, CELEBRATION_ADDONS, CELEBRATION_OCCASIONS, TIME_SLOTS, fmtDate,
  naira, type CelebrationAddon,
} from '@/lib/firefly-data';
import { FireflyField, Kicker } from './chrome';
import {
  Cake, Flower2, Camera, UtensilsCrossed, Sparkles,
  CheckCircle2, MessageCircle, Heart,
} from 'lucide-react';

const ADDON_ICONS: Record<string, typeof Cake> = {
  cake: Cake,
  decor: Flower2,
  photography: Camera,
  'custom-menu': UtensilsCrossed,
  'surprise-setup': Sparkles,
};

type CelebratePhoto = { id: string; tab: string; caption: string; alt: string };

export default function CelebrateView() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    occasion: 'birthday',
    guestCount: 10,
    notes: '',
  });
  const [addons, setAddons] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [conf, setConf] = useState<{ occasion: string; date: string } | null>(null);
  const [photos, setPhotos] = useState<CelebratePhoto[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});

  // Photos on this page are fully admin-curated: uploaded under the
  // "Celebrate page" collection in the dashboard. None uploaded, none shown.
  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setPhotos(d.filter((p: CelebratePhoto) => p.tab === 'celebrate'));
      })
      .catch(() => {});
  }, []);

  // Add-on prices are admin-adjustable; fall back to the house defaults.
  useEffect(() => {
    fetch('/api/celebrate-addons')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          const map: Record<string, number> = {};
          for (const a of d) if (typeof a.price === 'number') map[a.id] = a.price;
          setPrices(map);
        }
      })
      .catch(() => {});
  }, []);

  const priceLine = (a: CelebrationAddon) => {
    if (a.price === undefined) return a.hint ?? '';
    return `from ${naira(prices[a.id] ?? a.price)}${a.unit ? ` ${a.unit}` : ''}`;
  };

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0];

  const set = (k: keyof typeof form, v: string | number) => {
    setForm((f) => ({ ...f, [k]: v }));
    setError('');
  };

  const toggleAddon = (id: string) =>
    setAddons((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/celebrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, addOns: addons }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setConf({ occasion: form.occasion, date: form.date });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  if (conf) {
    const occ = CELEBRATION_OCCASIONS.find((o) => o.id === conf.occasion);
    return (
      <div className="pt-32 sm:pt-40 pb-24">
        <div className="mx-auto max-w-2xl px-5 sm:px-8 text-center">
          <div className="relative mx-auto w-20 h-20 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center mb-8 ember-pulse">
            <Heart className="w-8 h-8 text-gold" />
            <FireflyField count={10} />
          </div>
          <p className="text-gold/85 uppercase tracking-[0.28em] text-[11px] mb-4">Request received</p>
          <h1 className="font-display text-4xl sm:text-5xl text-cream leading-tight">
            Nothing about this will be treated like{' '}
            <span className="gold-gradient-text italic">just another table</span>
          </h1>
          <p className="mt-5 text-cream/60 font-light leading-relaxed">
            Your {occ?.label.toLowerCase()} on {fmtDate(conf.date)} is flagged on our
            dashboard the moment this was sent. Our celebrations lead will reach out to
            shape the evening with you — cake flavours, décor colours, every special touch.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3.5">
            <a
              href={`${BRAND.whatsapp}?text=${encodeURIComponent(
                `Hello Firefly! I just requested a ${occ?.label} celebration for ${fmtDate(conf.date)}. Let's plan the details.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-gold px-7 py-3.5 text-espresso text-sm font-medium uppercase tracking-[0.14em] hover:bg-cream transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Start planning on WhatsApp
            </a>
            <button
              onClick={() => setConf(null)}
              className="rounded-full border border-cream/25 px-7 py-3.5 text-cream text-sm uppercase tracking-[0.14em] hover:border-gold hover:text-gold transition-colors"
            >
              Plan another occasion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-36 pb-24">
      {/* hero strip */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <Kicker>05 — Celebrate at Firefly</Kicker>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-display text-5xl sm:text-6xl text-cream leading-[1.05]">
            Where the best evenings <span className="gold-gradient-text italic">begin</span>
          </h1>
          <p className="max-w-md text-cream/55 font-light leading-relaxed text-[15px]">
            Firefly is already where Awka chooses to mark a birthday, a promotion, a first
            anniversary. This is that reputation&apos;s own front door.
          </p>
        </div>

        {/* Moments — admin-curated: renders only once photos are uploaded
            to the "Celebrate page" collection from the dashboard */}
        {photos.length > 0 && (
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {photos.map((m, i) => (
              <div
                key={m.id}
                className={`relative rounded-3xl overflow-hidden border border-gold/15 group h-56 sm:h-72 lg:h-[400px] ${
                  i === 0 ? 'col-span-2' : ''
                }`}
              >
                <Image
                  src={`/api/gallery-media/${m.id}`}
                  alt={m.alt || m.caption || 'A moment celebrated at Firefly'}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/75 to-transparent" />
                {m.caption && (
                  <p className="absolute bottom-4 left-5 font-display italic text-cream/90">{m.caption}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* occasion chooser strip */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CELEBRATION_OCCASIONS.map((o) => (
            <button
              key={o.id}
              onClick={() => {
                set('occasion', o.id);
                document.getElementById('celebrate-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`rounded-3xl border p-5 text-left transition-all duration-500 hover:-translate-y-1 ${
                form.occasion === o.id
                  ? 'border-gold bg-gold/10'
                  : 'border-gold/12 card-sheen hover:border-gold/35'
              }`}
              aria-pressed={form.occasion === o.id}
            >
              <Sparkles className={`w-4.5 h-4.5 mb-3 ${form.occasion === o.id ? 'text-gold' : 'text-gold/50'}`} />
              <span className="block font-display text-lg text-cream">{o.label}</span>
              <span className="block mt-1.5 text-cream/45 text-[13px] font-light leading-relaxed">{o.blurb}</span>
            </button>
          ))}
        </div>
      </section>

      {/* form */}
      <section id="celebrate-form" className="mx-auto max-w-7xl px-5 sm:px-8 mt-20 scroll-mt-28">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <Kicker>The occasion request</Kicker>
            <h2 className="font-display text-4xl sm:text-5xl text-cream leading-tight">
              Tell us what we are <span className="gold-gradient-text italic">toasting to</span>
            </h2>
            <p className="mt-5 text-cream/60 font-light leading-[1.85] text-[15.5px]">
              One form — date, guests, cake or décor add-ons, any special touches. It lands
              on the same dashboard as every booking, but flagged and glowing, so your
              table is ready in spirit as well as setting.
            </p>
            <div className="mt-8 grid gap-3.5">
              {CELEBRATION_ADDONS.map((a) => {
                const Icon = ADDON_ICONS[a.id] ?? Sparkles;
                const on = addons.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggleAddon(a.id)}
                    className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ${
                      on ? 'border-gold bg-gold/10' : 'border-gold/15 hover:border-gold/40'
                    }`}
                    aria-pressed={on}
                  >
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${on ? 'bg-gold/15 border-gold/40' : 'border-gold/20'}`}>
                      <Icon className={`w-4.5 h-4.5 ${on ? 'text-gold' : 'text-gold/60'}`} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-cream text-[14.5px]">{a.label}</span>
                      <span className="block text-cream/40 text-xs mt-0.5">{priceLine(a)}</span>
                    </span>
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${on ? 'bg-gold border-gold' : 'border-cream/25'}`}>
                      {on && <CheckCircle2 className="w-3.5 h-3.5 text-espresso" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={submit}
            className="relative rounded-[2rem] card-sheen border border-gold/20 p-6 sm:p-9 overflow-hidden"
            aria-label="Celebration request form"
          >
            <FireflyField count={6} />
            <div className="relative grid gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <label className="grid gap-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80">Your name *</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="Blessing A."
                    className="rounded-xl bg-espresso-deep/70 border border-gold/20 px-4 py-3.5 text-cream placeholder:text-cream/25 focus:border-gold focus:outline-none transition-colors"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80">Phone (WhatsApp best) *</span>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    placeholder="+234 8xx xxx xxxx"
                    className="rounded-xl bg-espresso-deep/70 border border-gold/20 px-4 py-3.5 text-cream placeholder:text-cream/25 focus:border-gold focus:outline-none transition-colors"
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80">Email <span className="text-cream/30 normal-case tracking-normal">(optional)</span></span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="you@example.com"
                  className="rounded-xl bg-espresso-deep/70 border border-gold/20 px-4 py-3.5 text-cream placeholder:text-cream/25 focus:border-gold focus:outline-none transition-colors"
                />
              </label>

              <div className="grid sm:grid-cols-3 gap-5">
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80">The date *</span>
                  <input
                    required
                    type="date"
                    min={today}
                    max={maxDate}
                    value={form.date}
                    onChange={(e) => set('date', e.target.value)}
                    className="rounded-xl bg-espresso-deep/70 border border-gold/20 px-4 py-3.5 text-cream focus:border-gold focus:outline-none transition-colors [color-scheme:dark]"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80">Time *</span>
                  <select
                    required
                    value={form.time}
                    onChange={(e) => set('time', e.target.value)}
                    className="rounded-xl bg-espresso-deep/70 border border-gold/20 px-4 py-3.5 text-cream focus:border-gold focus:outline-none transition-colors [color-scheme:dark]"
                  >
                    <option value="" disabled>Choose</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="grid gap-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80">Occasion *</span>
                  <div className="flex flex-wrap gap-2">
                    {CELEBRATION_OCCASIONS.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => set('occasion', o.id)}
                        className={`rounded-full px-3.5 py-2 text-[12px] border transition-all duration-300 ${
                          form.occasion === o.id
                            ? 'bg-gold/15 border-gold text-gold'
                            : 'border-gold/15 text-cream/55 hover:border-gold/45'
                        }`}
                        aria-pressed={form.occasion === o.id}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="grid gap-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80">Guest count * <span className="text-cream/40 normal-case tracking-normal">({form.guestCount})</span></span>
                  <input
                    required
                    type="range"
                    min={2}
                    max={120}
                    value={form.guestCount}
                    onChange={(e) => set('guestCount', Number(e.target.value))}
                    className="mt-4 accent-[#E8B54D]"
                  />
                  <span className="flex justify-between text-cream/30 text-[10px] -mt-1">
                    <span>2</span><span>60</span><span>120</span>
                  </span>
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80">Special touches <span className="text-cream/30 normal-case tracking-normal">(optional)</span></span>
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="A cake that says 'Adaeze is 25', one bouquet of white roses, a toast at 8:30 — she does not know about any of it."
                  className="rounded-xl bg-espresso-deep/70 border border-gold/20 px-4 py-3.5 text-cream placeholder:text-cream/25 focus:border-gold focus:outline-none transition-colors resize-none"
                />
              </label>

              {addons.length > 0 && (
                <p className="text-cream/50 text-[13px] flex flex-wrap items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  Selected add-ons: {addons.map((a) => CELEBRATION_ADDONS.find((x) => x.id === a)?.label).join(' · ')}
                </p>
              )}

              {error && (
                <p className="rounded-xl border border-amber-ember/40 bg-amber-ember/10 px-4 py-3 text-cream/85 text-sm" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gold px-8 py-4 text-espresso text-sm font-medium uppercase tracking-[0.16em] hover:bg-cream transition-colors disabled:opacity-60 disabled:cursor-wait"
              >
                {busy ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-espresso/30 border-t-espresso animate-spin" />
                    Flagging your evening…
                  </>
                ) : (
                  <>
                    <Heart className="w-4.5 h-4.5" />
                    Request this celebration
                  </>
                )}
              </button>
              <p className="text-center text-cream/35 text-xs">
                We reply with a curated plan and quote — no obligation until you say yes.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
