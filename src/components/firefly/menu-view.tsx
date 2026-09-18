'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { MENU_CATEGORIES, MENU_GROUPS, CATEGORY_NOTES, naira } from '@/lib/firefly-data';
import { FireflyField, Kicker } from './chrome';
import { Flame, Leaf, ChefHat, Star, ShoppingBag, CircleOff, Plus, Search, Fish, Crown } from 'lucide-react';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string;
  spiceLevel: number;
  image: string | null;
  featured: boolean;
  available: boolean;
};

export type CartLine = { id: string; name: string; price: number; qty: number };

const TAG_LABELS: Record<string, { label: string; icon?: 'leaf' | 'chef' | 'star' | 'fish' | 'crown' }> = {
  signature: { label: 'Signature', icon: 'star' },
  chef: { label: "Chef's pick", icon: 'chef' },
  bestseller: { label: 'Bestseller', icon: 'star' },
  vegetarian: { label: 'Vegetarian', icon: 'leaf' },
  seafood: { label: 'From the sea', icon: 'fish' },
  premium: { label: 'Top shelf', icon: 'crown' },
  sharing: { label: 'Good for sharing' },
  local: { label: 'Local favourite' },
  spicy: { label: 'Spicy' },
  grill: { label: 'Off the grill' },
};

const TAG_ICONS = {
  leaf: Leaf,
  chef: ChefHat,
  star: Star,
  fish: Fish,
  crown: Crown,
} as const;

export function Spice({ level }: { level: number }) {
  if (!level) return null;
  return (
    <span className="inline-flex items-center gap-1" title={`Spice level ${level} of 3`}>
      {Array.from({ length: level }).map((_, i) => (
        <Flame key={i} className="w-3.5 h-3.5 text-amber-ember" aria-label={`Spice level ${level}`} />
      ))}
    </span>
  );
}

export default function MenuView({
  onAdd,
  cartCount,
  goOrder,
}: {
  onAdd: (item: MenuItem) => void;
  cartCount: number;
  goOrder: () => void;
}) {
  const [items, setItems] = useState<MenuItem[] | null>(null);
  const [error, setError] = useState('');
  const [active, setActive] = useState<string>('All');
  const [group, setGroup] = useState<string>('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let live = true;
    fetch('/api/menu')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('failed'))))
      .then((data) => live && setItems(data))
      .catch(() => live && setError('The menu could not be loaded. Please refresh in a moment.'));
    return () => {
      live = false;
    };
  }, []);

  const featured = useMemo(() => (items || []).filter((i) => i.available && i.featured).slice(0, 3), [items]);

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  const grouped = useMemo(() => {
    const list = items || [];
    const matches = (i: MenuItem) =>
      !searching || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q);
    const baseCats: readonly string[] = searching
      ? MENU_CATEGORIES
      : (MENU_GROUPS.find((g) => g.id === group)?.cats ?? MENU_CATEGORIES);
    const byCat = new Map<string, MenuItem[]>();
    for (const c of baseCats) byCat.set(c, []);
    for (const item of list) {
      if (!byCat.has(item.category)) {
        if (!searching) continue; // category outside the active group
        byCat.set(item.category, []);
      }
      if (matches(item)) byCat.get(item.category)!.push(item);
    }
    return Array.from(byCat.entries()).filter(([, arr]) => arr.length > 0);
  }, [items, group, searching, q]);

  const cats = ['All', ...grouped.map(([c]) => c)];
  const shown = !searching && active !== 'All' ? grouped.filter(([c]) => c === active) : grouped;
  const resultCount = grouped.reduce((n, [, arr]) => n + arr.length, 0);
  const totalCount = (items || []).length;

  const pickGroup = (id: string) => {
    setGroup(id);
    setActive('All');
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <Kicker>01 — The Menu, Illuminated</Kicker>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-display text-5xl sm:text-6xl text-cream leading-[1.05]">
            From first light to <span className="gold-gradient-text italic">last call</span>
          </h1>
          <p className="max-w-md text-cream/55 font-light leading-relaxed text-[15px]">
            {totalCount} dishes across {MENU_CATEGORIES.length} menus — from English breakfast to Don Julio
            1942 — priced honestly, tagged for spice and dietary choices.
          </p>
        </div>

        {/* Chef's highlights */}
        {featured.length > 0 && (
          <div className="mt-12">
            <p className="flex items-center gap-2 text-gold/85 uppercase tracking-[0.24em] text-[11px] mb-5">
              <ChefHat className="w-4 h-4" /> Glowing this week
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {featured.map((item) => (
                <article
                  key={item.id}
                  className="group relative rounded-3xl overflow-hidden border border-gold/25 card-sheen transition-all duration-500 hover:border-gold/50 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full bg-espresso/85 backdrop-blur px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-gold border border-gold/30">
                      <Star className="w-3 h-3 fill-gold" /> Signature
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-xl text-cream">{item.name}</h3>
                      <span className="text-gold font-medium whitespace-nowrap">{naira(item.price)}</span>
                    </div>
                    <p className="mt-2 text-cream/50 text-[13.5px] leading-relaxed font-light line-clamp-2">
                      {item.description}
                    </p>
                    <button
                      onClick={() => onAdd(item)}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold/12 border border-gold/40 text-gold text-[11px] uppercase tracking-[0.16em] px-4 py-2 hover:bg-gold hover:text-espresso transition-all duration-300"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add to order
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Group tabs + search */}
        <div className="mt-14 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          <div className="-mx-5 px-5 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
            <div className="flex gap-2.5 w-max pb-1" role="tablist" aria-label="Menu collections">
              <button
                role="tab"
                aria-selected={group === 'all'}
                onClick={() => pickGroup('all')}
                className={`rounded-full px-5 py-2.5 text-[12px] uppercase tracking-[0.14em] whitespace-nowrap border transition-all duration-300 ${
                  group === 'all'
                    ? 'bg-gold text-espresso border-gold font-medium'
                    : 'border-gold/25 text-cream/60 hover:border-gold/60 hover:text-cream'
                }`}
              >
                All Menus
              </button>
              {MENU_GROUPS.map((g) => (
                <button
                  key={g.id}
                  role="tab"
                  aria-selected={group === g.id}
                  onClick={() => pickGroup(g.id)}
                  className={`rounded-full px-5 py-2.5 text-[12px] uppercase tracking-[0.14em] whitespace-nowrap border transition-all duration-300 ${
                    group === g.id
                      ? 'bg-gold text-espresso border-gold font-medium'
                      : 'border-gold/25 text-cream/60 hover:border-gold/60 hover:text-cream'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative lg:ml-auto w-full lg:w-72 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/35" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the menu…"
              aria-label="Search the menu"
              className="w-full rounded-full border border-gold/25 bg-white/[0.03] pl-11 pr-5 py-2.5 text-sm text-cream placeholder:text-cream/30 outline-none focus:border-gold/60 transition-colors"
            />
          </div>
        </div>

        {/* Category pills (hidden while searching) */}
        {!searching && (
          <div className="mt-4 -mx-5 px-5 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 w-max pb-1" role="tablist" aria-label="Menu categories">
              {cats.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={active === c}
                  onClick={() => setActive(c)}
                  className={`rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.14em] whitespace-nowrap border transition-all duration-300 ${
                    active === c
                      ? 'bg-gold/15 text-gold border-gold/60 font-medium'
                      : 'border-white/10 text-cream/45 hover:border-gold/40 hover:text-cream'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* States */}
        {error && (
          <p className="mt-10 rounded-2xl border border-amber-ember/40 bg-amber-ember/10 px-5 py-4 text-cream/80 text-sm">
            {error}
          </p>
        )}
        {!items && !error && (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-gold/10 bg-card/60 p-6 animate-pulse">
                <div className="h-5 w-2/3 rounded bg-gold/10" />
                <div className="mt-3 h-3.5 w-full rounded bg-gold/5" />
                <div className="mt-2 h-3.5 w-4/5 rounded bg-gold/5" />
              </div>
            ))}
          </div>
        )}
        {items && !error && resultCount === 0 && (
          <div className="mt-12 rounded-3xl border border-gold/15 card-sheen p-10 text-center">
            <p className="font-display text-2xl text-cream">Nothing on the menu matches “{query.trim()}”</p>
            <p className="mt-2 text-cream/50 text-sm font-light">
              Try a different word — or ask us on WhatsApp, the kitchen loves a challenge.
            </p>
          </div>
        )}
        {searching && resultCount > 0 && (
          <p className="mt-8 text-[12px] uppercase tracking-[0.18em] text-cream/45" role="status">
            {resultCount} {resultCount === 1 ? 'dish' : 'dishes'} match “{query.trim()}”
          </p>
        )}

        {/* Menu lists */}
        {shown.map(([cat, arr]) => (
          <section key={cat} className="mt-16" aria-label={cat}>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8">
              <h2 className="font-display text-3xl text-cream shrink-0">{cat}</h2>
              <span className="text-[11px] uppercase tracking-[0.18em] text-cream/35">{arr.length}</span>
              {CATEGORY_NOTES[cat] && (
                <span className="text-[12.5px] italic font-light text-gold/60">{CATEGORY_NOTES[cat]}</span>
              )}
              <div className="hairline flex-1 min-w-[40px]" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {arr.map((item) => (
                <article
                  key={item.id}
                  className={`group relative flex gap-5 rounded-3xl border p-5 transition-all duration-500 ${
                    item.available
                      ? 'border-gold/12 card-sheen hover:border-gold/35'
                      : 'border-white/5 bg-white/[0.02] opacity-60'
                  }`}
                >
                  {item.image && item.available && (
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-gold/15">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="120px"
                        className="object-cover transition-transform duration-700 group-hover:scale-108"
                      />
                    </div>
                  )}
                  {(!item.image || !item.available) && (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl shrink-0 border border-gold/10 bg-espresso-soft flex items-center justify-center">
                      {item.available ? (
                        <span className="font-display text-3xl text-gold/40">
                          {item.name.charAt(0)}
                        </span>
                      ) : (
                        <CircleOff className="w-6 h-6 text-cream/25" />
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className={`font-display text-lg sm:text-xl truncate ${item.available ? 'text-cream' : 'text-cream/50 line-through decoration-gold/40'}`}>
                        {item.name}
                      </h3>
                      <span className={`whitespace-nowrap ${item.available ? 'text-gold' : 'text-cream/40'}`}>
                        {naira(item.price)}
                      </span>
                    </div>
                    {item.description && (
                      <p className="mt-1.5 text-cream/50 text-[13.5px] leading-relaxed font-light">
                        {item.description}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                      {item.available ? (
                        <>
                          {item.tags
                            .split(',')
                            .filter(Boolean)
                            .map((t) => {
                              const meta = TAG_LABELS[t];
                              if (!meta) return null;
                              const Icon = meta.icon ? TAG_ICONS[meta.icon] : null;
                              return (
                                <span
                                  key={t}
                                  className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-cream/45"
                                >
                                  {Icon && <Icon className="w-3 h-3 text-gold/70" />}
                                  {meta.label}
                                </span>
                              );
                            })}
                          <Spice level={item.spiceLevel} />
                          <button
                            onClick={() => onAdd(item)}
                            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-gold/30 text-gold text-[11px] uppercase tracking-[0.14em] px-3.5 py-1.5 hover:bg-gold hover:text-espresso transition-all duration-300"
                            aria-label={`Add ${item.name} to order`}
                          >
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] uppercase tracking-[0.16em] text-cream/40">
                          Currently unavailable — back soon
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {/* Sticky order bar (mobile-first) */}
        {cartCount > 0 && (
          <div className="fixed bottom-5 inset-x-5 sm:inset-x-auto sm:right-8 z-40">
            <button
              onClick={goOrder}
              className="ember-pulse w-full sm:w-auto flex items-center justify-center gap-3 rounded-full bg-gold px-8 py-4 text-espresso font-medium uppercase tracking-[0.14em] text-sm shadow-2xl shadow-black/50 hover:bg-cream transition-colors"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              Review order · {cartCount} item{cartCount > 1 ? 's' : ''}
            </button>
          </div>
        )}

        {/* Footnote */}
        <div className="mt-20 rounded-3xl border border-gold/12 card-sheen p-7 sm:p-9 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <FireflyField count={5} />
          <div className="relative flex-1">
            <p className="font-display text-2xl text-cream">Prices and availability, always current</p>
            <p className="mt-2 text-cream/55 text-[14.5px] font-light leading-relaxed max-w-xl">
              Our team updates this menu from a private dashboard the moment a seasonal dish
              lands or the kitchen runs out — what you see here is what the kitchen is
              cooking today.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
