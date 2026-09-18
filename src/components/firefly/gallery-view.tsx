'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { GALLERY, type View } from '@/lib/firefly-data';
import { FireflyField, Kicker } from './chrome';
import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

const COLLECTIONS = [
  { id: 'room', label: 'The Room', blurb: 'The sofas, the light lines, the corner tables.' },
  { id: 'kitchen', label: 'From the Kitchen', blurb: 'Plates the way they arrive at your table.' },
  { id: 'bar', label: 'The Bar', blurb: 'Poured slow, lit warm.' },
  { id: 'moments', label: 'Moments at Firefly', blurb: 'Birthdays, proposals, reunions — the reason we glow.' },
] as const;

type GalleryItem = { src: string; ar: number; alt: string; caption: string };
type UploadRow = { id: string; tab: string; caption: string; alt: string; width: number; height: number };

export default function GalleryView({ go }: { go: (v: View) => void }) {
  const [tab, setTab] = useState<string>('room');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [uploads, setUploads] = useState<UploadRow[]>([]);

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setUploads(d);
      })
      .catch(() => {});
  }, []);

  const col = COLLECTIONS.find((c) => c.id === tab) ?? COLLECTIONS[0];

  const items: GalleryItem[] = useMemo(() => {
    const curated = GALLERY[col.id as keyof typeof GALLERY] as readonly GalleryItem[];
    const extra = uploads
      .filter((u) => u.tab === col.id)
      .map((u) => ({
        src: `/api/gallery-media/${u.id}`,
        ar: u.width > 0 && u.height > 0 ? u.width / u.height : 0.8,
        alt: u.alt || u.caption,
        caption: u.caption || 'From the café',
      }));
    return [...curated, ...extra];
  }, [col, uploads]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      else if (e.key === 'ArrowRight') setLightbox((l) => (l === null ? null : (l + 1) % items.length));
      else if (e.key === 'ArrowLeft') setLightbox((l) => (l === null ? null : (l - 1 + items.length) % items.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, items.length]);

  const step = (dir: 1 | -1) => {
    if (lightbox === null) return;
    setLightbox((lightbox + dir + items.length) % items.length);
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24">
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <Kicker>02 — The Gallery</Kicker>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-display text-5xl sm:text-6xl text-cream leading-[1.05]">
            A visual room of <span className="gold-gradient-text italic">its own</span>
          </h1>
          <p className="max-w-md text-cream/55 font-light leading-relaxed text-[15px]">
            Real frames from the room — the plating, the pours, the evenings as they
            actually happen. Lose a few minutes here before you have even booked.
          </p>
        </div>

        {/* Collection tabs */}
        <div className="mt-12 -mx-5 px-5 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
          <div className="flex gap-2.5 w-max pb-1" role="tablist" aria-label="Gallery collections">
            {COLLECTIONS.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={tab === c.id}
                onClick={() => {
                  setTab(c.id);
                  setLightbox(null);
                }}
                className={`rounded-full px-5 py-2.5 text-[12px] uppercase tracking-[0.14em] whitespace-nowrap border transition-all duration-300 ${
                  tab === c.id
                    ? 'bg-gold text-espresso border-gold font-medium'
                    : c.id === 'moments'
                      ? 'border-amber-ember/40 text-amber-ember hover:bg-amber-ember hover:text-espresso'
                      : 'border-gold/25 text-cream/60 hover:border-gold/60 hover:text-cream'
                }`}
              >
                {c.id === 'moments' && <Heart className="inline w-3 h-3 mr-1.5 -mt-0.5" />}
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 text-cream/45 text-sm font-light italic">{col.blurb}</p>

        {/* Masonry-ish grid */}
        <div className="mt-8 columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {items.map((img, i) => (
            <button
              key={`${tab}-${i}`}
              onClick={() => setLightbox(i)}
              className="group relative mb-5 w-full break-inside-avoid overflow-hidden rounded-3xl border border-gold/12 transition-all duration-500 hover:border-gold/40"
              aria-label={`Open photo: ${img.caption}`}
            >
              <div className="relative w-full" style={{ aspectRatio: img.ar }}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-104"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
              <p className="absolute bottom-4 left-5 right-5 text-left font-display text-cream/90 text-lg italic translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                {img.caption}
              </p>
            </button>
          ))}
        </div>

        {/* Moments strip CTA */}
        {tab !== 'moments' && (
          <div className="mt-14 relative overflow-hidden rounded-[2rem] border border-amber-ember/25 bg-gradient-to-br from-amber-ember/15 via-card to-card p-8 sm:p-10">
            <FireflyField count={6} />
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
              <div>
                <p className="flex items-center gap-2 text-amber-ember uppercase tracking-[0.22em] text-[11px] mb-3">
                  <Heart className="w-3.5 h-3.5" /> Moments at Firefly
                </p>
                <h2 className="font-display text-3xl text-cream">
                  Your celebration belongs in this strip
                </h2>
                <p className="mt-2.5 text-cream/55 text-[14.5px] font-light max-w-lg leading-relaxed">
                  Birthdays, proposals, reunions — guests who celebrate with us can share
                  their favourite frame, right here where the next celebration begins.
                </p>
              </div>
              <button
                onClick={() => go('celebrate')}
                className="shrink-0 rounded-full bg-amber-ember px-7 py-3.5 text-espresso text-sm font-medium uppercase tracking-[0.14em] hover:bg-gold transition-colors duration-300"
              >
                Celebrate with us
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightbox !== null && items[lightbox] && (
        <div
          className="fixed inset-0 z-[80] bg-espresso-deep/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={col.items[lightbox].caption}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 w-11 h-11 rounded-full border border-gold/30 text-cream/80 hover:text-gold hover:border-gold flex items-center justify-center transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="Close photo"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-gold/30 text-cream/80 hover:text-gold hover:border-gold flex items-center justify-center transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-gold/30 text-cream/80 hover:text-gold hover:border-gold flex items-center justify-center transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <figure className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div
              className="relative mx-auto rounded-2xl overflow-hidden border border-gold/25"
              style={{
                aspectRatio: items[lightbox].ar,
                width: `min(100%, ${(66 * items[lightbox].ar).toFixed(1)}vh)`,
              }}
            >
              <Image
                src={items[lightbox].src}
                alt={items[lightbox].alt}
                fill
                sizes="90vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 text-center font-display italic text-cream/80 text-lg">
              {items[lightbox].caption}
              <span className="block mt-1 text-cream/35 text-xs tracking-[0.2em] uppercase not-italic">
                {lightbox + 1} / {items.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
