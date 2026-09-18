'use client';

import { useMemo, useState } from 'react';
import { BRAND, OCCASIONS, TIME_SLOTS, fmtDate } from '@/lib/firefly-data';
import { FireflyField, Kicker } from './chrome';
import {
  CalendarHeart, CheckCircle2, MessageCircle, Users, Clock,
  CalendarDays, Sparkles, PartyPopper, ShieldCheck,
} from 'lucide-react';

type Conf = {
  name: string;
  date: string;
  time: string;
  partySize: number;
  occasion: string;
};

export default function BookView() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    partySize: 2,
    occasion: 'casual',
    notes: '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [conf, setConf] = useState<Conf | null>(null);

  // "Live availability": slots late evening get scarce, prime 19:00-20:30 fills first.
  // Derived deterministically per date so the same date shows a stable picture.
  const slotState = useMemo(() => {
    const map = new Map<string, 'open' | 'few' | 'full'>();
    if (!form.date) return map;
    const day = new Date(`${form.date}T00:00:00`).getDay();
    for (const t of TIME_SLOTS) {
      const hour = parseInt(t.split(':')[0], 10);
      const prime = hour >= 19 && hour <= 20;
      const seed = (day * 31 + hour * 7 + form.partySize) % 11;
      if (prime && seed < 3) map.set(t, 'full');
      else if (prime || seed < 2) map.set(t, 'few');
      else map.set(t, 'open');
    }
    return map;
  }, [form.date, form.partySize]);

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0];

  const set = (k: keyof typeof form, v: string | number) => {
    setForm((f) => ({ ...f, [k]: v }));
    setError('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.date || !form.time) {
      setError('Please choose both a date and a time for your evening.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setConf({
        name: form.name,
        date: form.date,
        time: form.time,
        partySize: form.partySize,
        occasion: form.occasion,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  /* ------------------------- confirmation state ------------------------- */
  if (conf) {
    const occ = OCCASIONS.find((o) => o.id === conf.occasion);
    return (
      <div className="pt-32 sm:pt-40 pb-24">
        <div className="mx-auto max-w-2xl px-5 sm:px-8 text-center">
          <div className="relative mx-auto w-20 h-20 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center mb-8 ember-pulse">
            <CheckCircle2 className="w-9 h-9 text-gold" />
            <FireflyField count={8} />
          </div>
          <p className="text-gold/85 uppercase tracking-[0.28em] text-[11px] mb-4">Request received</p>
          <h1 className="font-display text-4xl sm:text-5xl text-cream leading-tight">
            The table is being <span className="gold-gradient-text italic">held</span>, {conf.name.split(' ')[0]}
          </h1>
          <p className="mt-5 text-cream/60 font-light leading-relaxed">
            Your reservation request is in. Our team confirms every booking personally —
            you will receive confirmation shortly, and a gentle reminder the morning of.
          </p>

          <div className="mt-10 rounded-3xl card-sheen border border-gold/25 p-7 text-left grid gap-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-cream/45 text-sm flex items-center gap-2"><Users className="w-4 h-4 text-gold/70" /> Party</span>
              <span className="text-cream">{conf.partySize} guest{conf.partySize > 1 ? 's' : ''}</span>
            </div>
            <div className="hairline" />
            <div className="flex items-center justify-between gap-4">
              <span className="text-cream/45 text-sm flex items-center gap-2"><CalendarDays className="w-4 h-4 text-gold/70" /> Date</span>
              <span className="text-cream">{fmtDate(conf.date)}</span>
            </div>
            <div className="hairline" />
            <div className="flex items-center justify-between gap-4">
              <span className="text-cream/45 text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-gold/70" /> Time</span>
              <span className="text-cream">{conf.time}</span>
            </div>
            <div className="hairline" />
            <div className="flex items-center justify-between gap-4">
              <span className="text-cream/45 text-sm flex items-center gap-2"><Sparkles className="w-4 h-4 text-gold/70" /> Occasion</span>
              <span className="text-cream">{occ?.label ?? 'Just dinner'}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <a
              href={`${BRAND.whatsapp}?text=${encodeURIComponent(
                `Hello Firefly Café! I just requested a table for ${conf.partySize} on ${fmtDate(conf.date)} at ${conf.time}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-gold px-7 py-3.5 text-espresso text-sm font-medium uppercase tracking-[0.14em] hover:bg-cream transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Fast-track on WhatsApp
            </a>
            <button
              onClick={() => setConf(null)}
              className="rounded-full border border-cream/25 px-7 py-3.5 text-cream text-sm uppercase tracking-[0.14em] hover:border-gold hover:text-gold transition-colors"
            >
              Book another evening
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------ form state ------------------------------ */
  return (
    <div className="pt-28 sm:pt-36 pb-24">
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20">
          {/* Left rail */}
          <div>
            <Kicker>03 — Reserve a Table</Kicker>
            <h1 className="font-display text-5xl sm:text-6xl text-cream leading-[1.05]">
              Claim your <span className="gold-gradient-text italic">evening</span>
            </h1>
            <p className="mt-6 text-cream/60 font-light leading-[1.85] text-[15.5px]">
              Simple enough to finish while still on the phone with a friend — date, time,
              party size, and a confirmation that lands instantly. Tell us the occasion and
              the table arrives ready in spirit as well as setting.
            </p>

            <ul className="mt-9 grid gap-5">
              {[
                { icon: ShieldCheck, t: 'Live availability', d: 'Slots update with party size — request only what we can honour.' },
                { icon: Sparkles, t: 'The occasion field', d: 'Birthday, date night, family gathering — we walk in prepared.' },
                { icon: MessageCircle, t: 'Instant confirmation', d: 'Email confirmation right away; WhatsApp follow-up one tap away.' },
              ].map(({ icon: Icon, t, d }) => (
                <li key={t} className="flex gap-4">
                  <span className="w-10 h-10 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-gold" />
                  </span>
                  <span>
                    <span className="block text-cream text-[15px]">{t}</span>
                    <span className="block text-cream/50 text-[13.5px] font-light mt-0.5 leading-relaxed">{d}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl border border-gold/15 bg-card/50 p-5">
              <p className="text-cream/60 text-sm font-light leading-relaxed">
                <span className="text-gold font-medium">Good to know —</span> parties larger
                than 10, or full-room private evenings, are handled through{' '}
                <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gold underline decoration-gold/40 underline-offset-2 hover:decoration-gold">
                  Celebrate at Firefly
                </a>{' '}
                so nothing about your night is treated like just another Tuesday table.
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={submit}
            className="relative rounded-[2rem] card-sheen border border-gold/20 p-6 sm:p-9 overflow-hidden"
            aria-label="Reservation form"
          >
            <FireflyField count={5} />
            <div className="relative grid gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <label className="grid gap-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80">Your name *</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="Adaeze Okonkwo"
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
                <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80">Email for confirmation <span className="text-cream/30 normal-case tracking-normal">(optional)</span></span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="you@example.com"
                  className="rounded-xl bg-espresso-deep/70 border border-gold/20 px-4 py-3.5 text-cream placeholder:text-cream/25 focus:border-gold focus:outline-none transition-colors"
                />
              </label>

              <div className="grid sm:grid-cols-2 gap-5">
                <label className="grid gap-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80 flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5" /> Date *
                  </span>
                  <input
                    required
                    type="date"
                    min={today}
                    max={maxDate}
                    value={form.date}
                    onChange={(e) => {
                      set('date', e.target.value);
                      if (e.target.value && !form.time) {
                        const map = new Map<string, 'open' | 'few' | 'full'>();
                        for (const t of TIME_SLOTS) map.set(t, 'open');
                      }
                    }}
                    className="rounded-xl bg-espresso-deep/70 border border-gold/20 px-4 py-3.5 text-cream focus:border-gold focus:outline-none transition-colors [color-scheme:dark]"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" /> Party size *
                  </span>
                  <div className="flex items-center gap-3 rounded-xl bg-espresso-deep/70 border border-gold/20 px-4 py-2.5">
                    <button
                      type="button"
                      onClick={() => set('partySize', Math.max(1, form.partySize - 1))}
                      className="w-8 h-8 rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-espresso transition-colors text-lg leading-none"
                      aria-label="Fewer guests"
                    >
                      −
                    </button>
                    <span className="flex-1 text-center text-cream text-lg font-display">{form.partySize}</span>
                    <button
                      type="button"
                      onClick={() => set('partySize', Math.min(40, form.partySize + 1))}
                      className="w-8 h-8 rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-espresso transition-colors text-lg leading-none"
                      aria-label="More guests"
                    >
                      +
                    </button>
                  </div>
                </label>
              </div>

              {/* Time slots */}
              <div className="grid gap-2">
                <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Time * <span className="text-cream/30 normal-case tracking-normal">— availability updates with party size</span>
                </span>
                {!form.date ? (
                  <p className="text-cream/40 text-sm font-light py-3">Choose a date to see tonight&apos;s open tables.</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2" role="radiogroup" aria-label="Available times">
                    {TIME_SLOTS.map((t) => {
                      const st = slotState.get(t) ?? 'open';
                      const selected = form.time === t;
                      const full = st === 'full';
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={full}
                          onClick={() => set('time', t)}
                          role="radio"
                          aria-checked={selected}
                          className={`rounded-xl px-2 py-2.5 text-sm border transition-all duration-300 ${
                            full
                              ? 'border-white/5 text-cream/20 line-through cursor-not-allowed bg-white/[0.02]'
                              : selected
                                ? 'bg-gold text-espresso border-gold font-medium'
                                : st === 'few'
                                  ? 'border-amber-ember/50 text-amber-ember hover:bg-amber-ember/10'
                                  : 'border-gold/20 text-cream/70 hover:border-gold/60'
                          }`}
                        >
                          {t}
                          {!full && !selected && st === 'few' && (
                            <span className="block text-[9px] uppercase tracking-wider opacity-75">few left</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Occasion */}
              <div className="grid gap-2">
                <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> What are we marking?
                </span>
                <div className="flex flex-wrap gap-2">
                  {OCCASIONS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => set('occasion', o.id)}
                      className={`rounded-full px-4 py-2 text-[12px] tracking-wide border transition-all duration-300 ${
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
                <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80 flex items-center gap-2">
                  <PartyPopper className="w-3.5 h-3.5" /> Anything we should prepare? <span className="text-cream/30 normal-case tracking-normal">(optional)</span>
                </span>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="A quiet corner, a cake at 9pm, one high chair…"
                  className="rounded-xl bg-espresso-deep/70 border border-gold/20 px-4 py-3.5 text-cream placeholder:text-cream/25 focus:border-gold focus:outline-none transition-colors resize-none"
                />
              </label>

              {error && (
                <p className="rounded-xl border border-amber-ember/40 bg-amber-ember/10 px-4 py-3 text-cream/85 text-sm" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="mt-1 inline-flex items-center justify-center gap-2.5 rounded-full bg-gold px-8 py-4 text-espresso text-sm font-medium uppercase tracking-[0.16em] hover:bg-cream transition-colors duration-300 disabled:opacity-60 disabled:cursor-wait"
              >
                {busy ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-espresso/30 border-t-espresso animate-spin" />
                    Holding your table…
                  </>
                ) : (
                  <>
                    <CalendarHeart className="w-4.5 h-4.5" />
                    Request this table
                  </>
                )}
              </button>
              <p className="text-center text-cream/35 text-xs">
                No prepayment. Confirmed by our team within minutes during opening hours.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
