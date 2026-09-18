'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { BRAND, NAV, SOCIALS, type View } from '@/lib/firefly-data';
import { SocialIcon } from '@/components/firefly/social-icons';
import { Phone, MapPin, Clock, MessageCircle, Star, Flame, Sun, Moon } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Firefly logo mark — a single glowing firefly                       */
/* ------------------------------------------------------------------ */
export function FlyMark({ size = 22, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <radialGradient id="ff-body" cx="50%" cy="62%" r="55%">
          <stop offset="0%" stopColor="#FFE9AD" />
          <stop offset="55%" stopColor="#E8B54D" />
          <stop offset="100%" stopColor="#C9793A" />
        </radialGradient>
      </defs>
      <path
        d="M12 9.2 C10 6.2 10.6 3.4 12 1.8 C13.4 3.4 14 6.2 12 9.2 Z"
        fill="url(#ff-body)"
        opacity="0.9"
      />
      <path d="M11.2 12.6 C8.4 12.9 6.3 12 4.8 10.4 C6.9 9.7 9.3 10.4 11.2 12.6 Z" fill="#E8B54D" opacity="0.55" />
      <path d="M12.8 12.6 C15.6 12.9 17.7 12 19.2 10.4 C17.1 9.7 14.7 10.4 12.8 12.6 Z" fill="#E8B54D" opacity="0.55" />
      <ellipse cx="12" cy="16.4" rx="3.1" ry="4.4" fill="url(#ff-body)" />
      <circle cx="12" cy="21" r="1.6" fill="#FFE9AD">
        <animate attributeName="opacity" values="1;0.35;1" dur="2.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Ambient fireflies — sparse, drifting glow dots                     */
/* ------------------------------------------------------------------ */
export function FireflyField({ count = 14, className = '' }: { count?: number; className?: string }) {
  const flies = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const seed = (i * 2654435761) % 1000;
        const r1 = (seed % 97) / 97;
        const r2 = ((seed * 7) % 89) / 89;
        const r3 = ((seed * 13) % 83) / 83;
        return {
          left: `${(r1 * 92 + 4).toFixed(1)}%`,
          top: `${(r2 * 80 + 12).toFixed(1)}%`,
          dur: `${(14 + r3 * 16).toFixed(1)}s`,
          delay: `${(-r1 * 22).toFixed(1)}s`,
          blinkDur: `${(4.5 + r2 * 5).toFixed(1)}s`,
          scale: 0.6 + r3 * 0.8,
        };
      }),
    [count]
  );
  return (
    <div className={`ff-field ${className}`} aria-hidden="true">
      {flies.map((f, i) => (
        <span
          key={i}
          className="ff-dot"
          style={{
            left: f.left,
            top: f.top,
            animationDuration: `${f.dur}, ${f.blinkDur}`,
            animationDelay: `${f.delay}, ${f.delay}`,
            transform: `scale(${f.scale})`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Light / dark mode toggle — evening glow by default, parchment day  */
/* ------------------------------------------------------------------ */
const themeStore = {
  listeners: new Set<() => void>(),
  subscribe(cb: () => void) {
    themeStore.listeners.add(cb);
    return () => {
      themeStore.listeners.delete(cb);
    };
  },
  emit() {
    themeStore.listeners.forEach((l) => l());
  },
};

const readLight = () =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('light');

export function ThemeToggle({ className = '' }: { className?: string }) {
  // getServerSnapshot=false keeps hydration safe; the client snapshot re-syncs after mount
  const light = useSyncExternalStore(themeStore.subscribe, readLight, () => false);

  const toggle = () => {
    const next = !readLight();
    document.documentElement.classList.toggle('light', next);
    try {
      localStorage.setItem('ff-theme', next ? 'light' : 'dark');
    } catch {
      /* private mode — theme just won't persist */
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next ? '#F6F0E4' : '#1C1410');
    themeStore.emit();
  };

  return (
    <button
      onClick={toggle}
      aria-label={light ? 'Switch to evening mode' : 'Switch to daylight mode'}
      title={light ? 'Evening mode' : 'Daylight mode'}
      className={`inline-flex items-center justify-center rounded-full border border-gold/35 text-gold hover:bg-gold hover:text-espresso transition-all duration-300 ${className}`}
    >
      {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */
export function Header({
  view,
  go,
  cartCount,
}: {
  view: View;
  go: (v: View) => void;
  cartCount: number;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-espresso/90 backdrop-blur-md border-b border-gold/15 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 flex items-center justify-between gap-4">
        <button
          onClick={() => go('home')}
          className="flex items-center gap-2.5 group"
          aria-label="Firefly Café — home"
        >
          <FlyMark size={26} className="transition-transform duration-500 group-hover:rotate-12" />
          <span className="font-display text-xl sm:text-2xl tracking-wide text-cream">
            Firefly <span className="text-gold">Café</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                setOpen(false);
                go(n.id);
              }}
              className={`relative px-4 py-2 text-[13px] uppercase tracking-[0.18em] transition-colors duration-300 rounded-full ${
                view === n.id ? 'text-gold' : 'text-cream/60 hover:text-cream'
              }`}
            >
              {n.label}
              {n.id === 'order' && cartCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-gold text-espresso text-[10px] font-semibold min-w-[18px] h-[18px] px-1 align-middle">
                  {cartCount}
                </span>
              )}
              {view === n.id && (
                <span className="absolute inset-x-4 -bottom-0.5 h-px bg-gold/70" />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="h-9 w-9 shrink-0" />
          <a
            href={BRAND.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-gold/35 px-4 py-2 text-[12px] uppercase tracking-[0.16em] text-gold hover:bg-gold hover:text-espresso transition-all duration-300"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
          <button
            className="md:hidden p-2 text-cream/80 hover:text-gold"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M4 7h16" strokeLinecap="round" />
                  <path d="M4 12h16" strokeLinecap="round" />
                  <path d="M4 17h10" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden mt-3 mx-4 rounded-2xl border border-gold/20 bg-espresso-deep/95 backdrop-blur-md p-3 grid gap-1 shadow-2xl shadow-black/50" aria-label="Mobile">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                setOpen(false);
                go(n.id);
              }}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm uppercase tracking-[0.18em] ${
                view === n.id ? 'text-gold bg-gold/10' : 'text-cream/70 active:bg-white/5'
              }`}
            >
              {n.label}
              {n.id === 'order' && cartCount > 0 && (
                <span className="rounded-full bg-gold text-espresso text-[10px] font-semibold min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          ))}
          <a
            href={BRAND.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gold/30 text-gold text-sm uppercase tracking-[0.18em] mt-1"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp us
          </a>
        </nav>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */
export function Footer({ go }: { go: (v: View) => void }) {
  return (
    <footer className="mt-auto border-t border-gold/10 bg-espresso-deep">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <FlyMark size={24} />
            <span className="font-display text-2xl text-cream">
              Firefly <span className="text-gold">Café</span>
            </span>
          </div>
          <p className="text-cream/50 text-sm leading-relaxed max-w-xs">
            {BRAND.tagline}. Awka&apos;s room for slow dinners, soft light and the
            occasions you will talk about for years.
          </p>
          <div className="flex items-center gap-1.5 mt-5" aria-label={`Rated ${BRAND.rating} on Google`}>
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
            <span className="text-cream/60 text-xs">{BRAND.rating} · Google Maps</span>
          </div>
          <div className="mt-6">
            <h3 className="uppercase tracking-[0.22em] text-gold/80 text-xs mb-3">Follow the glow</h3>
            <div className="flex items-center gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Firefly Café on ${s.label}`}
                  title={s.label}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gold/25 text-cream/60 hover:bg-gold hover:border-gold hover:text-espresso hover:-translate-y-0.5 transition-all duration-300"
                >
                  <SocialIcon id={s.id} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="text-sm">
          <h3 className="uppercase tracking-[0.22em] text-gold/80 text-xs mb-4">Explore</h3>
          <ul className="grid gap-2.5">
            {NAV.map((n) => (
              <li key={n.id}>
                <button onClick={() => go(n.id)} className="text-cream/60 hover:text-gold transition-colors">
                  {n.label === 'Reserve' ? 'Reserve a Table' : n.label}
                </button>
              </li>
            ))}
            <li>
              <button onClick={() => go('admin')} className="text-cream/35 hover:text-gold transition-colors text-xs tracking-wider">
                Staff Login
              </button>
            </li>
          </ul>
        </div>

        <div className="text-sm grid gap-3.5 content-start">
          <h3 className="uppercase tracking-[0.22em] text-gold/80 text-xs mb-1">Visit</h3>
          <a href={BRAND.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 text-cream/60 hover:text-gold transition-colors">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gold/70" />
            {BRAND.address}
          </a>
          <a href={`tel:${BRAND.phone}`} className="flex items-center gap-2.5 text-cream/60 hover:text-gold transition-colors">
            <Phone className="w-4 h-4 shrink-0 text-gold/70" />
            {BRAND.phoneDisplay}
          </a>
          <span className="flex items-center gap-2.5 text-cream/60">
            <Clock className="w-4 h-4 shrink-0 text-gold/70" />
            {BRAND.hoursLine}
          </span>
          <a
            href={BRAND.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-gold/10 border border-gold/30 px-4 py-2.5 text-gold text-xs uppercase tracking-[0.16em] hover:bg-gold hover:text-espresso transition-all duration-300 w-fit"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
      <div className="border-t border-gold/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] tracking-wider text-cream/30">
          <span>© {new Date().getFullYear()} Firefly Café, Awka. All evenings reserved.</span>
          <span className="flex items-center gap-1.5">
            Crafted with <Flame className="w-3 h-3 text-amber-ember/70" aria-hidden="true" /> for the glow
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Section kicker heading used across views                           */
/* ------------------------------------------------------------------ */
export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-gold/90 uppercase tracking-[0.3em] text-[11px] sm:text-xs mb-3 flex items-center gap-3">
      <span className="inline-block h-px w-8 bg-gold/50" aria-hidden="true" />
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll restoration on view change                                  */
/* ------------------------------------------------------------------ */
export function useScrollTop(dep: unknown) {
  const ref = useRef(dep);
  useEffect(() => {
    if (ref.current !== dep) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      ref.current = dep;
    }
  }, [dep]);
}
