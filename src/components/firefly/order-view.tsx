'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { BRAND, naira } from '@/lib/firefly-data';
import { DELIVERY_ZONES, FREE_DELIVERY_THRESHOLD, ZONE_GROUPS, type ZoneGroup } from '@/lib/delivery-zones';
import { FireflyField, Kicker } from './chrome';
import type { MenuItem, CartLine } from './menu-view';
import {
  ShoppingBag, Minus, Plus, Store, Bike, CreditCard, Landmark, Banknote,
  CheckCircle2, ChefHat, Package, Receipt, MessageCircle, Clock, MapPin,
  Navigation, ShieldCheck, Lock,
} from 'lucide-react';

type Stage = 'cart' | 'checkout' | 'paying' | 'done';
type PlacedOrder = {
  ref: string; total: number; fulfil: string; status: string;
  zone: string; payment: string; paymentStatus: string; paymentRef: string;
};
type GatewayInit = { paymentRef: string; provider: string; amount: number; settlement: string };

const PICKUP_STEPS = ['received', 'preparing', 'ready'] as const;
const DELIVERY_STEPS = ['received', 'preparing', 'ready', 'out_for_delivery'] as const;

export default function OrderView({
  cart,
  setQty,
  clearCart,
  goMenu,
}: {
  cart: CartLine[];
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  goMenu: () => void;
}) {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [stage, setStage] = useState<Stage>('cart');
  const [form, setForm] = useState({
    name: '', phone: '', fulfil: 'pickup',
    zoneGroup: 'unizik-campus' as ZoneGroup, zoneId: '', detail: '', landmark: '',
    payment: 'card',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);
  const [gateway, setGateway] = useState<GatewayInit | null>(null);
  const [payBusy, setPayBusy] = useState(false);
  const [eta, setEta] = useState(0);

  // quick-add rail: featured available items
  useEffect(() => {
    fetch('/api/menu')
      .then((r) => (r.ok ? r.json() : []))
      .then((d: MenuItem[]) => setMenu(d.filter((i) => i.available)));
  }, []);

  // live status ticker after placing
  useEffect(() => {
    if (stage !== 'done' || !placed) return;
    setEta(placed.fulfil === 'delivery' ? 45 : 25);
    const tick = setInterval(() => setEta((e) => Math.max(0, e - 1)), 60000);
    const advance = setInterval(() => {
      setPlaced((p) => {
        if (!p) return p;
        const steps = p.fulfil === 'delivery' ? DELIVERY_STEPS : PICKUP_STEPS;
        const i = steps.indexOf(p.status as typeof steps[number]);
        if (i < 0 || i >= steps.length - 1) return p; // stop before final step
        return { ...p, status: steps[i + 1] };
      });
    }, 25000);
    return () => {
      clearInterval(tick);
      clearInterval(advance);
    };
  }, [stage, placed?.ref]);

  const zonesInGroup = useMemo(
    () => DELIVERY_ZONES.filter((z) => z.group === form.zoneGroup),
    [form.zoneGroup],
  );
  const selectedZone = useMemo(
    () => DELIVERY_ZONES.find((z) => z.id === form.zoneId),
    [form.zoneId],
  );

  const lines: (CartLine & { image?: string | null })[] = cart.map((l) => ({
    ...l,
    image: menu.find((m) => m.id === l.id)?.image ?? null,
  }));

  const subtotal = cart.reduce((s, l) => s + l.price * l.qty, 0);
  const fee =
    form.fulfil === 'delivery' && selectedZone
      ? subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : selectedZone.fee
      : 0;
  const total = subtotal + fee;
  const deliveryEta = selectedZone?.eta ?? '40–60 min';

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setError('');
  };

  const switchGroup = (g: ZoneGroup) => {
    const first = DELIVERY_ZONES.find((z) => z.group === g);
    setForm((f) => ({ ...f, zoneGroup: g, zoneId: first?.id ?? '' }));
    setError('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.fulfil === 'delivery' && !selectedZone) {
      setError('Please choose where the rider is heading — campus, hostel, street or axis.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          fulfil: form.fulfil,
          zoneId: form.fulfil === 'delivery' ? form.zoneId : undefined,
          address: form.fulfil === 'delivery' ? form.detail : undefined,
          landmark: form.fulfil === 'delivery' ? form.landmark : undefined,
          payment: form.payment,
          items: cart,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not place order.');

      if (form.payment === 'cash') {
        clearCart();
        setPlaced({
          ref: data.ref, total: data.total, fulfil: data.fulfil, status: data.status,
          zone: data.zone, payment: data.payment, paymentStatus: data.paymentStatus, paymentRef: '',
        });
        setStage('done');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // initialize the gateway transaction, then open the payment sheet
        const initRes = await fetch('/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: data.id }),
        });
        const init = await initRes.json();
        if (!initRes.ok) throw new Error(init.error || 'Could not start payment.');
        setGateway({
          paymentRef: init.paymentRef,
          provider: init.provider,
          amount: init.amount,
          settlement: init.settlement,
        });
        setPlaced({
          ref: data.ref, total: data.total, fulfil: data.fulfil, status: data.status,
          zone: data.zone, payment: data.payment?.method ?? form.payment,
          paymentStatus: data.paymentStatus, paymentRef: init.paymentRef,
        });
        setStage('paying');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not place order.');
    } finally {
      setBusy(false);
    }
  };

  const confirmPayment = async (outcome: 'success' | 'failed') => {
    if (!gateway || !placed) return;
    setPayBusy(true);
    setError('');
    try {
      const res = await fetch('/api/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentRef: gateway.paymentRef, outcome }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment could not be confirmed.');
      if (outcome === 'failed') {
        setError('Payment was not completed — you can try again from your order reference.');
        setGateway(null);
        setStage('done');
        setPlaced((p) => (p ? { ...p, paymentStatus: 'pending' } : p));
        return;
      }
      clearCart();
      setPlaced((p) => (p ? { ...p, paymentStatus: 'paid' } : p));
      setGateway(null);
      setStage('done');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment could not be confirmed.');
    } finally {
      setPayBusy(false);
    }
  };

  /* ------------------------------ payment sheet ------------------------------ */
  if (stage === 'paying' && placed && gateway) {
    return (
      <div className="pt-32 sm:pt-40 pb-24">
        <div className="mx-auto max-w-lg px-5 sm:px-8">
          <div className="rounded-[2rem] border border-gold/25 card-sheen p-7 sm:p-9 relative overflow-hidden">
            <FireflyField count={6} />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] text-gold">
                  <Lock className="w-3 h-3" /> Secure checkout
                </span>
                <span className="text-cream/35 text-[11px] uppercase tracking-[0.14em]">{gateway.provider}</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl text-cream mt-7 leading-tight">
                Complete your <span className="gold-gradient-text italic">payment</span>
              </h1>
              <p className="mt-2.5 text-cream/50 text-sm font-light">
                Order <span className="text-gold tracking-[0.18em]">{placed.ref}</span> ·{' '}
                {placed.fulfil === 'delivery' ? `delivery to ${placed.zone}` : 'pickup at the café'}
              </p>

              <div className="mt-7 rounded-2xl bg-espresso-deep/70 border border-gold/20 p-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-cream/55 text-sm">Amount due</span>
                  <span className="font-display text-4xl text-gold">{naira(gateway.amount)}</span>
                </div>
                <div className="hairline my-4" />
                <p className="text-[11px] uppercase tracking-[0.18em] text-cream/40">Reference</p>
                <p className="text-cream/85 text-sm tracking-[0.12em] mt-1">{gateway.paymentRef}</p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-cream/40 mt-4">Settles to</p>
                <p className="text-amber-ember text-[13px] mt-1 leading-relaxed">{gateway.settlement}</p>
              </div>

              <div className="mt-5 grid gap-2 text-[13px] text-cream/55 font-light">
                <p className="flex items-center gap-2.5">
                  {placed.payment === 'card' ? <CreditCard className="w-4 h-4 text-gold/70 shrink-0" /> : <Landmark className="w-4 h-4 text-gold/70 shrink-0" />}
                  {placed.payment === 'card'
                    ? 'Pay with your card — debit/credit, Naira only.'
                    : 'Transfer the exact amount; payment confirms automatically.'}
                </p>
                <p className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-gold/70 shrink-0" />
                  Sandbox mode — no real charge until the café&rsquo;s merchant account goes live.
                </p>
              </div>

              <button
                onClick={() => confirmPayment('success')}
                disabled={payBusy}
                className="mt-7 w-full rounded-full bg-gold px-8 py-4 text-espresso text-sm font-medium uppercase tracking-[0.16em] hover:bg-cream transition-colors disabled:opacity-60 disabled:cursor-wait inline-flex items-center justify-center gap-2.5"
              >
                {payBusy ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-espresso/30 border-t-espresso animate-spin" />
                    Confirming…
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Pay {naira(gateway.amount)} now
                  </>
                )}
              </button>
              <button
                onClick={() => confirmPayment('failed')}
                disabled={payBusy}
                className="mt-3 w-full rounded-full border border-cream/20 px-8 py-3.5 text-cream/60 text-[12px] uppercase tracking-[0.16em] hover:border-amber-ember hover:text-amber-ember transition-colors"
              >
                Cancel this transaction
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------ done ------------------------------ */
  if (stage === 'done' && placed) {
    const steps = placed.fulfil === 'delivery' ? DELIVERY_STEPS : PICKUP_STEPS;
    const icons = placed.fulfil === 'delivery'
      ? [CheckCircle2, ChefHat, Package, Navigation]
      : [CheckCircle2, ChefHat, Package];
    const labels = placed.fulfil === 'delivery'
      ? ['Received', 'Preparing', 'Ready', 'On the way']
      : ['Received', 'Preparing', 'Ready'];
    const stepIdx = Math.max(0, steps.indexOf(placed.status as typeof steps[number]));

    return (
      <div className="pt-32 sm:pt-40 pb-24">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <div className="text-center">
            <div className="relative mx-auto w-20 h-20 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center mb-8 ember-pulse">
              <Receipt className="w-8 h-8 text-gold" />
              <FireflyField count={8} />
            </div>
            <p className="text-gold/85 uppercase tracking-[0.28em] text-[11px] mb-4">
              {placed.paymentStatus === 'paid' ? 'Order paid & placed' : 'Order placed'}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl text-cream leading-tight">
              The kitchen has your <span className="gold-gradient-text italic">order</span>
            </h1>
            <p className="mt-4 text-cream/60 font-light">
              Reference <span className="text-gold tracking-[0.2em] font-medium">{placed.ref}</span>
              {' '}· {placed.fulfil === 'delivery' ? `on its way to ${placed.zone}` : 'ready for pickup'}
            </p>
            {placed.paymentStatus === 'paid' && (
              <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-moss/50 bg-moss/20 px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] text-moss-soft">
                <CheckCircle2 className="w-3.5 h-3.5" /> Payment confirmed {placed.paymentRef ? `· ${placed.paymentRef}` : ''}
              </p>
            )}
            {placed.paymentStatus === 'pending' && placed.payment !== 'cash' && (
              <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-ember/50 bg-amber-ember/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] text-amber-ember">
                <Clock className="w-3.5 h-3.5" /> Payment pending — quote {placed.ref} on WhatsApp to retry
              </p>
            )}
            {placed.paymentStatus === 'on_delivery' && (
              <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] text-gold">
                <Banknote className="w-3.5 h-3.5" /> Pay {naira(placed.total)} on delivery — cash or transfer to the rider
              </p>
            )}
          </div>

          {/* status tracker */}
          <div className="mt-12 rounded-3xl card-sheen border border-gold/20 p-7">
            <div className="flex items-center justify-between">
              {steps.map((s, i) => {
                const Icon = icons[i];
                const active = i <= stepIdx;
                return (
                  <div key={s} className="flex flex-col items-center gap-2 relative flex-1">
                    {i > 0 && (
                      <span
                        className={`absolute right-1/2 top-5 h-px w-full -translate-x-0 ${i <= stepIdx ? 'bg-gold/60' : 'bg-gold/15'}`}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={`relative z-10 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 ${
                        active ? 'bg-gold border-gold text-espresso ember-pulse' : 'border-gold/25 text-cream/30'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </span>
                    <span className={`text-[11px] uppercase tracking-[0.16em] ${active ? 'text-gold' : 'text-cream/35'}`}>
                      {labels[i]}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-7 text-center text-cream/50 text-sm font-light">
              {placed.fulfil === 'delivery'
                ? placed.status === 'out_for_delivery'
                  ? 'Your rider is on the bike — a call comes through as they set off.'
                  : `Heading to ${placed.zone || 'you'}. We will call before the rider sets off — roughly ${eta} minutes to go.`
                : placed.status === 'ready'
                  ? 'Come to the counter, mention your reference and walk away glowing.'
                  : `We will notify you the moment it is ready. Sit tight — roughly ${eta} minutes to go.`}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <a
              href={`${BRAND.whatsapp}?text=${encodeURIComponent(`Hello Firefly! Checking on order ${placed.ref} (${naira(placed.total)}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-gold px-7 py-3.5 text-espresso text-sm font-medium uppercase tracking-[0.14em] hover:bg-cream transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Track on WhatsApp
            </a>
            <button
              onClick={() => {
                setStage('cart');
                setPlaced(null);
              }}
              className="rounded-full border border-cream/25 px-7 py-3.5 text-cream text-sm uppercase tracking-[0.14em] hover:border-gold hover:text-gold transition-colors"
            >
              Start another order
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* --------------------------- empty cart --------------------------- */
  if (stage === 'cart' && cart.length === 0) {
    const suggestions = menu.filter((m) => m.featured).slice(0, 4);
    return (
      <div className="pt-28 sm:pt-36 pb-24">
        <section className="mx-auto max-w-5xl px-5 sm:px-8 text-center">
          <Kicker>04 — Order Ahead</Kicker>
          <h1 className="font-display text-5xl sm:text-6xl text-cream leading-[1.05] mt-2">
            Firefly without the <span className="gold-gradient-text italic">wait</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-cream/55 font-light leading-relaxed">
            Build your cart course by course, pay by card, transfer or cash on delivery, and
            track it from received to delivered — anywhere in Awka, every UNIZIK campus
            terminal, hostel and lodge included.
          </p>
          <div className="my-12 flex justify-center">
            <span className="w-24 h-24 rounded-full border border-gold/20 bg-card flex items-center justify-center">
              <ShoppingBag className="w-9 h-9 text-gold/50" />
            </span>
          </div>
          <p className="text-cream/60 font-light">Your cart is empty — let us fix that.</p>
          <button
            onClick={goMenu}
            className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-gold px-8 py-4 text-espresso text-sm font-medium uppercase tracking-[0.16em] hover:bg-cream transition-colors"
          >
            Browse the menu <Plus className="w-4 h-4" />
          </button>

          <div className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-gold/25 bg-card px-5 py-2.5 text-cream/60 text-[13px]">
            <Bike className="w-4 h-4 text-gold" />
            Now delivering — UNIZIK campus &amp; hostels, Awka city and the whole Awka axis
          </div>

          {suggestions.length > 0 && (
            <div className="mt-14 text-left">
              <p className="flex items-center gap-2 text-gold/85 uppercase tracking-[0.22em] text-[11px] mb-5">
                <ChefHat className="w-4 h-4" /> Guest favourites, ready to add
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {suggestions.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => goMenu()}
                    className="group relative rounded-3xl overflow-hidden border border-gold/15 card-sheen hover:border-gold/40 transition-all duration-500 text-left"
                  >
                    <div className="relative aspect-[4/3]">
                      {m.image && (
                        <Image src={m.image} alt={m.name} fill sizes="300px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-display text-cream text-[15px] leading-snug">{m.name}</p>
                      <p className="mt-1 text-gold text-sm">{naira(m.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    );
  }

  /* --------------------------- cart/checkout --------------------------- */
  return (
    <div className="pt-28 sm:pt-36 pb-24">
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <Kicker>04 — Order Ahead</Kicker>
        <h1 className="font-display text-5xl sm:text-6xl text-cream leading-[1.05]">
          Your <span className="gold-gradient-text italic">cart</span>
        </h1>

        <div className="mt-12 grid lg:grid-cols-[1.35fr_1fr] gap-8 items-start">
          {/* lines */}
          <div className="grid gap-4">
            {lines.map((l) => (
              <article key={l.id} className="flex items-center gap-4 sm:gap-5 rounded-3xl border border-gold/12 card-sheen p-4 sm:p-5">
                {l.image && (
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-gold/15">
                    <Image src={l.image} alt={l.name} fill sizes="80px" className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-cream text-[15.5px] sm:text-lg truncate">{l.name}</h3>
                  <p className="text-gold text-sm mt-0.5">{naira(l.price)}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setQty(l.id, l.qty - 1)}
                    className="w-8 h-8 rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-espresso transition-colors flex items-center justify-center"
                    aria-label={`Remove one ${l.name}`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-cream">{l.qty}</span>
                  <button
                    onClick={() => setQty(l.id, l.qty + 1)}
                    className="w-8 h-8 rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-espresso transition-colors flex items-center justify-center"
                    aria-label={`Add one ${l.name}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="w-20 sm:w-24 text-right text-cream/85 text-sm sm:text-base whitespace-nowrap">
                  {naira(l.price * l.qty)}
                </span>
              </article>
            ))}
            <button
              onClick={goMenu}
              className="justify-self-start inline-flex items-center gap-2 text-gold/90 text-[12px] uppercase tracking-[0.18em] hover:text-gold transition-colors mt-1"
            >
              <Plus className="w-4 h-4" /> Add more from the menu
            </button>

            {stage === 'checkout' && (
              <form
                onSubmit={submit}
                className="mt-4 rounded-[2rem] border border-gold/20 card-sheen p-6 sm:p-8 grid gap-5"
                aria-label="Checkout"
              >
                <h2 className="font-display text-2xl text-cream">Where is it going?</h2>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'pickup', label: 'Pickup', icon: Store, hint: 'Ready ≈ 25 min' },
                    { id: 'delivery', label: 'Delivery', icon: Bike, hint: 'UNIZIK · Awka · axis' },
                  ].map(({ id, label, icon: Icon, hint }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => set('fulfil', id)}
                      className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                        form.fulfil === id
                          ? 'border-gold bg-gold/10'
                          : 'border-gold/15 hover:border-gold/45'
                      }`}
                      aria-pressed={form.fulfil === id}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${form.fulfil === id ? 'text-gold' : 'text-cream/50'}`} />
                      <span className={`block text-sm ${form.fulfil === id ? 'text-cream' : 'text-cream/70'}`}>{label}</span>
                      <span className="block text-cream/40 text-xs mt-0.5">{hint}</span>
                    </button>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <label className="grid gap-2">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80">Name *</span>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      className="rounded-xl bg-espresso-deep/70 border border-gold/20 px-4 py-3.5 text-cream placeholder:text-cream/25 focus:border-gold focus:outline-none transition-colors"
                      placeholder="Chukwuemeka N."
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80">Phone *</span>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      className="rounded-xl bg-espresso-deep/70 border border-gold/20 px-4 py-3.5 text-cream placeholder:text-cream/25 focus:border-gold focus:outline-none transition-colors"
                      placeholder="+234 8xx xxx xxxx"
                    />
                  </label>
                </div>

                {form.fulfil === 'delivery' && (
                  <>
                    <div className="grid gap-3">
                      <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80">Delivery area *</span>
                      <div className="flex flex-wrap gap-2">
                        {ZONE_GROUPS.map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => switchGroup(g.id)}
                            className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.12em] transition-all ${
                              form.zoneGroup === g.id
                                ? 'border-gold bg-gold/10 text-gold'
                                : 'border-gold/15 text-cream/55 hover:border-gold/45'
                            }`}
                            aria-pressed={form.zoneGroup === g.id}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                      <p className="text-cream/35 text-xs">
                        {ZONE_GROUPS.find((g) => g.id === form.zoneGroup)?.blurb}
                      </p>
                      <label className="grid gap-2">
                        <select
                          required
                          value={form.zoneId}
                          onChange={(e) => set('zoneId', e.target.value)}
                          className="rounded-xl bg-espresso-deep/70 border border-gold/20 px-4 py-3.5 text-cream focus:border-gold focus:outline-none transition-colors appearance-none"
                          aria-label="Delivery terminal or area"
                        >
                          <option value="" disabled>Choose your terminal, hostel or area…</option>
                          {zonesInGroup.map((z) => (
                            <option key={z.id} value={z.id}>
                              {z.name} · {naira(z.fee)} · {z.eta}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <label className="grid gap-2">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80">
                          Room / block / street *
                        </span>
                        <input
                          required
                          minLength={5}
                          value={form.detail}
                          onChange={(e) => set('detail', e.target.value)}
                          className="rounded-xl bg-espresso-deep/70 border border-gold/20 px-4 py-3.5 text-cream placeholder:text-cream/25 focus:border-gold focus:outline-none transition-colors"
                          placeholder="e.g. Block C, Room 214, first floor"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80">
                          Landmark (optional)
                        </span>
                        <input
                          value={form.landmark}
                          onChange={(e) => set('landmark', e.target.value)}
                          className="rounded-xl bg-espresso-deep/70 border border-gold/20 px-4 py-3.5 text-cream placeholder:text-cream/25 focus:border-gold focus:outline-none transition-colors"
                          placeholder="e.g. opposite the chapel / beside the kiosk"
                        />
                      </label>
                    </div>
                  </>
                )}

                <div className="grid gap-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80">Payment</span>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { id: 'card', label: 'Card', icon: CreditCard, note: 'Paystack-secured' },
                      { id: 'transfer', label: 'Transfer', icon: Landmark, note: 'Bank transfer' },
                      { id: 'cash', label: 'On delivery', icon: Banknote, note: 'Cash with the rider' },
                    ].map(({ id, label, icon: Icon, note }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => set('payment', id)}
                        className={`rounded-2xl border p-4 text-left transition-all duration-300 flex items-center gap-3.5 ${
                          form.payment === id ? 'border-gold bg-gold/10' : 'border-gold/15 hover:border-gold/45'
                        }`}
                        aria-pressed={form.payment === id}
                      >
                        <Icon className={`w-5 h-5 shrink-0 ${form.payment === id ? 'text-gold' : 'text-cream/50'}`} />
                        <span>
                          <span className={`block text-sm ${form.payment === id ? 'text-cream' : 'text-cream/70'}`}>{label}</span>
                          <span className="block text-cream/40 text-[11px] mt-0.5">{note}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                  {form.fulfil === 'pickup' && form.payment === 'cash' && (
                    <p className="text-cream/40 text-xs">Cash orders are settled at the counter on pickup.</p>
                  )}
                </div>

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
                      Placing your order…
                    </>
                  ) : (
                    <>
                      <Receipt className="w-4.5 h-4.5" />
                      {form.payment === 'cash' ? `Place order · ${naira(total)}` : `Continue to pay ${naira(total)}`}
                    </>
                  )}
                </button>
                <p className="text-center text-cream/35 text-xs leading-relaxed">
                  Payments handled over a trusted Nigerian gateway · settlement to Firefly Café&rsquo;s
                  merchant account is <span className="text-amber-ember/90">pending activation</span> — funds
                  are recorded but not released.
                </p>
              </form>
            )}
          </div>

          {/* summary */}
          <aside className="lg:sticky lg:top-28 rounded-[2rem] border border-gold/20 card-sheen p-6 sm:p-8 overflow-hidden">
            <FireflyField count={4} />
            <h2 className="relative font-display text-2xl text-cream mb-6">Order summary</h2>
            <div className="relative grid gap-3 text-sm">
              <div className="flex justify-between text-cream/60">
                <span>Items ({cart.reduce((s, l) => s + l.qty, 0)})</span>
                <span className="text-cream/85">{naira(subtotal)}</span>
              </div>
              <div className="flex justify-between text-cream/60">
                <span className="flex items-center gap-1.5">
                  {form.fulfil === 'delivery' ? <Bike className="w-3.5 h-3.5 text-gold/70" /> : <Store className="w-3.5 h-3.5 text-gold/70" />}
                  {form.fulfil === 'delivery'
                    ? selectedZone ? `Delivery · ${selectedZone.name}` : 'Delivery fee'
                    : 'Pickup'}
                </span>
                <span className="text-cream/85 whitespace-nowrap pl-2">
                  {form.fulfil !== 'delivery'
                    ? 'Free'
                    : !selectedZone
                      ? 'Pick an area'
                      : fee === 0 ? 'Free' : naira(fee)}
                </span>
              </div>
              {form.fulfil === 'delivery' && selectedZone && subtotal < FREE_DELIVERY_THRESHOLD && (
                <p className="text-cream/40 text-xs leading-relaxed">
                  Add {naira(FREE_DELIVERY_THRESHOLD - subtotal)} more and delivery is on the house.
                </p>
              )}
              <div className="hairline my-1" />
              <div className="flex justify-between items-baseline">
                <span className="text-cream">Total</span>
                <span className="font-display text-3xl text-gold">{naira(total)}</span>
              </div>
            </div>
            <div className="relative mt-7 grid gap-3 text-[13px] text-cream/50 font-light">
              <p className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-gold/70 shrink-0" />
                {form.fulfil === 'delivery' ? `≈ ${deliveryEta} to your door` : '≈ 25 minutes to pickup'}
              </p>
              <p className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-gold/70 shrink-0" />
                Every UNIZIK terminal, hostel &amp; lodge · all Awka axis
              </p>
              <p className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-gold/70 shrink-0" />Status updates at every step</p>
            </div>
            {stage === 'cart' && (
              <button
                onClick={() => setStage('checkout')}
                className="relative mt-8 w-full rounded-full bg-gold px-8 py-4 text-espresso text-sm font-medium uppercase tracking-[0.16em] hover:bg-cream transition-colors"
              >
                Continue to checkout
              </button>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
