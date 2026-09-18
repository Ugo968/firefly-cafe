'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { BRAND, fmtDate, naira } from '@/lib/firefly-data';
import { Kicker } from './chrome';
import {
  Lock, CalendarHeart, ShoppingBag, PartyPopper, RefreshCw,
  Check, X, Clock, Phone, Users, MapPin, ChevronDown, ShieldCheck,
  LayoutDashboard, Bike, Banknote, AlertTriangle, CreditCard,
  ImagePlus, Trash2, Image as ImageIcon, UtensilsCrossed,
} from 'lucide-react';

type Booking = {
  id: string; name: string; phone: string; email: string;
  date: string; time: string; partySize: number;
  occasion: string; notes: string; status: string;
  createdAt: string;
};
type Order = {
  id: string; ref: string; name: string; phone: string;
  fulfil: string; address: string; zone: string; zoneId: string;
  landmark: string; items: string;
  subtotal: number; fee: number; total: number;
  payment: string; paymentStatus: string; paymentRef: string;
  status: string; createdAt: string;
};
type Celebration = {
  id: string; name: string; phone: string; email: string;
  date: string; time: string; occasion: string; guestCount: number;
  addOns: string; notes: string; status: string; createdAt: string;
};
type GalleryUpload = {
  id: string; tab: string; caption: string; alt: string;
  mime: string; width: number; height: number; size: number; createdAt: string;
};
type AddonRow = {
  id: string; label: string; unit: string | null; hint: string | null; price: number | null;
};
type MenuItemRow = {
  id: string; name: string; category: string; price: number; basePrice: number;
  image: string | null; available: boolean;
};
const GALLERY_TABS = [
  { id: 'room', label: 'The Room' },
  { id: 'kitchen', label: 'From the Kitchen' },
  { id: 'bar', label: 'The Bar' },
  { id: 'moments', label: 'Moments' },
  { id: 'celebrate', label: 'Celebrate page' },
] as const;

const PICKUP_FLOW = ['received', 'preparing', 'ready', 'completed'] as const;
const DELIVERY_FLOW = ['received', 'preparing', 'ready', 'out_for_delivery', 'delivered'] as const;

export default function AdminView({ onExit }: { onExit: () => void }) {
  const [authed, setAuthed] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [tab, setTab] = useState<'bookings' | 'orders' | 'celebrations' | 'gallery' | 'menuphotos'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cels, setCels] = useState<Celebration[]>([]);
  const [uploads, setUploads] = useState<GalleryUpload[]>([]);
  const [uploadTab, setUploadTab] = useState<string>('moments');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [addons, setAddons] = useState<AddonRow[]>([]);
  const [addonDrafts, setAddonDrafts] = useState<Record<string, string>>({});
  const [pricesBusy, setPricesBusy] = useState(false);
  const [priceNotice, setPriceNotice] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItemRow[]>([]);
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoNotice, setPhotoNotice] = useState('');
  const [priceDraft, setPriceDraft] = useState('');
  const [priceBusy, setPriceBusy] = useState(false);
  const [itemPriceNotice, setItemPriceNotice] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [b, o, c, g, a, m] = await Promise.all([
        fetch('/api/bookings').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/celebrations').then((r) => r.json()),
        fetch('/api/gallery').then((r) => r.json()),
        fetch('/api/celebrate-addons').then((r) => r.json()),
        fetch('/api/menu').then((r) => r.json()),
      ]);
      setBookings(Array.isArray(b) ? b : []);
      setOrders(Array.isArray(o) ? o : []);
      setCels(Array.isArray(c) ? c : []);
      setUploads(Array.isArray(g) ? g : []);
      if (Array.isArray(a)) {
        setAddons(a);
        setAddonDrafts(Object.fromEntries(
          a.filter((x: AddonRow) => x.price !== null).map((x: AddonRow) => [x.id, String(x.price)]),
        ));
      }
      setMenuItems(Array.isArray(m) ? m : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode }),
    });
    if (res.ok) setAuthed(true);
    else setAuthError('Incorrect passcode — ask the developer for the house key.');
  };

  const setBookingStatus = async (id: string, status: string) => {
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  };

  const setOrderStatus = async (id: string, status?: string, paymentStatus?: string) => {
    setOrders((os) => os.map((o) => (o.id === id ? {
      ...o,
      status: status ?? o.status,
      paymentStatus: paymentStatus ?? o.paymentStatus,
    } : o)));
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, paymentStatus }),
    });
  };

  const setCelebrationStatus = async (id: string, status: string) => {
    setCels((cs) => cs.map((c) => (c.id === id ? { ...c, status } : c)));
    await fetch(`/api/celebrations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  };

  const uploadPhoto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadError('');
    const form = e.currentTarget;
    const input = form.elements.namedItem('photo') as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      setUploadError('Choose a photo first.');
      return;
    }
    setUploading(true);
    try {
      let width = 0;
      let height = 0;
      try {
        const dims = await new Promise<{ w: number; h: number }>((resolve, reject) => {
          const url = URL.createObjectURL(file);
          const img = new window.Image();
          img.onload = () => {
            resolve({ w: img.naturalWidth, h: img.naturalHeight });
            URL.revokeObjectURL(url);
          };
          img.onerror = reject;
          img.src = url;
        });
        width = dims.w;
        height = dims.h;
      } catch {
        /* dimensions are optional */
      }
      const fd = new FormData();
      fd.append('photo', file);
      fd.append('tab', uploadTab);
      fd.append('caption', uploadCaption);
      fd.append('width', String(width));
      fd.append('height', String(height));
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'x-admin-passcode': passcode },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || 'Upload failed — please try again.');
        return;
      }
      setUploads((u) => [data, ...u]);
      setUploadCaption('');
      form.reset();
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (id: string) => {
    const res = await fetch(`/api/gallery/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-passcode': passcode },
    });
    if (res.ok) setUploads((u) => u.filter((p) => p.id !== id));
    setConfirmDel(null);
  };

  /* --------------------- celebrate add-on pricing --------------------- */

  const savePrices = async () => {
    setPricesBusy(true);
    setPriceNotice('');
    try {
      const prices: Record<string, number> = {};
      for (const a of addons) {
        if (a.price === null) continue;
        const v = Number(addonDrafts[a.id]);
        if (!Number.isFinite(v) || v < 0) {
          setPriceNotice('Enter a valid number for every price.');
          return;
        }
        prices[a.id] = Math.round(v);
      }
      const res = await fetch('/api/celebrate-addons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-passcode': passcode },
        body: JSON.stringify({ prices }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPriceNotice(data.error || 'Could not save prices.');
        return;
      }
      setAddons(data);
      setPriceNotice('Prices updated — live on the Celebrate page.');
    } finally {
      setPricesBusy(false);
    }
  };

  const resetPrices = async () => {
    setPricesBusy(true);
    setPriceNotice('');
    try {
      const res = await fetch('/api/celebrate-addons', {
        method: 'DELETE',
        headers: { 'x-admin-passcode': passcode },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setAddons(data);
        setAddonDrafts(Object.fromEntries(
          data.filter((x: AddonRow) => x.price !== null).map((x: AddonRow) => [x.id, String(x.price)]),
        ));
        setPriceNotice('House prices restored.');
      } else {
        setPriceNotice(data.error || 'Could not restore prices.');
      }
    } finally {
      setPricesBusy(false);
    }
  };

  /* ------------------------ menu item photos ------------------------ */

  const refreshMenu = async () => {
    const r = await fetch('/api/menu');
    if (r.ok) setMenuItems(await r.json());
  };

  const uploadItemPhoto = async () => {
    if (!selectedItemId) return;
    const file = photoInputRef.current?.files?.[0];
    if (!file) {
      setPhotoNotice('Choose a photo first.');
      return;
    }
    setPhotoBusy(true);
    setPhotoNotice('');
    try {
      const fd = new FormData();
      fd.append('photo', file);
      const res = await fetch(`/api/menu-items/${selectedItemId}/photo`, {
        method: 'POST',
        headers: { 'x-admin-passcode': passcode },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setPhotoNotice(data.error || 'Upload failed — please try again.');
        return;
      }
      await refreshMenu();
      if (photoInputRef.current) photoInputRef.current.value = '';
      setPhotoNotice('Photo published — live on the menu.');
    } finally {
      setPhotoBusy(false);
    }
  };

  const removeItemPhoto = async () => {
    if (!selectedItemId) return;
    setPhotoBusy(true);
    setPhotoNotice('');
    try {
      const res = await fetch(`/api/menu-items/${selectedItemId}/photo`, {
        method: 'DELETE',
        headers: { 'x-admin-passcode': passcode },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setPhotoNotice(data.error || 'Could not remove the photo.');
        return;
      }
      await refreshMenu();
      setPhotoNotice('Uploaded photo removed — house photo restored.');
    } finally {
      setPhotoBusy(false);
    }
  };

  /* --------------------- menu price & availability --------------------- */

  const patchItem = async (body: Record<string, unknown>) => {
    if (!selectedItemId) return { ok: false } as const;
    const res = await fetch(`/api/menu-items/${selectedItemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-passcode': passcode },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data } as const;
  };

  const saveItemPrice = async () => {
    if (!selectedItemId) return;
    const v = Number(priceDraft);
    if (!Number.isFinite(v) || v < 0) {
      setItemPriceNotice('Enter a valid price — a number, 0 or more.');
      return;
    }
    setPriceBusy(true);
    setItemPriceNotice('');
    try {
      const { ok, data } = await patchItem({ price: Math.round(v) });
      if (!ok) {
        setItemPriceNotice(data.error || 'Could not update the price.');
        return;
      }
      await refreshMenu();
      setPriceDraft(String(data.price));
      setItemPriceNotice('Price updated — live on the menu and at checkout.');
    } finally {
      setPriceBusy(false);
    }
  };

  const restoreItemPrice = async () => {
    if (!selectedItem || selectedItem.basePrice <= 0) return;
    setPriceBusy(true);
    setItemPriceNotice('');
    try {
      const { ok, data } = await patchItem({ price: selectedItem.basePrice });
      if (!ok) {
        setItemPriceNotice(data.error || 'Could not restore the house price.');
        return;
      }
      await refreshMenu();
      setPriceDraft(String(data.price));
      setItemPriceNotice('House price restored.');
    } finally {
      setPriceBusy(false);
    }
  };

  const toggleItemAvailability = async () => {
    if (!selectedItem) return;
    setPriceBusy(true);
    setItemPriceNotice('');
    try {
      const { ok, data } = await patchItem({ available: !selectedItem.available });
      if (!ok) {
        setItemPriceNotice(data.error || 'Could not change availability.');
        return;
      }
      await refreshMenu();
      setItemPriceNotice(data.available
        ? 'Item is back on the menu.'
        : 'Item marked unavailable — it now shows greyed out on the menu.');
    } finally {
      setPriceBusy(false);
    }
  };

  /* ---------------------------- login gate ---------------------------- */
  if (!authed) {
    return (
      <div className="min-h-[80vh] pt-32 pb-24 flex items-center justify-center px-5">
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-[2rem] card-sheen border border-gold/20 p-8 text-center"
          aria-label="Staff login"
        >
          <span className="mx-auto w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-6">
            <Lock className="w-6 h-6 text-gold" />
          </span>
          <h1 className="font-display text-3xl text-cream">Behind the glow</h1>
          <p className="mt-2.5 text-cream/50 text-sm font-light leading-relaxed">
            The staff dashboard — bookings, orders and celebrations in one place.
          </p>
          <input
            type="password"
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value);
              setAuthError('');
            }}
            placeholder="House passcode"
            className="mt-7 w-full rounded-xl bg-espresso-deep/70 border border-gold/20 px-4 py-3.5 text-cream placeholder:text-cream/25 focus:border-gold focus:outline-none transition-colors text-center tracking-[0.3em]"
            aria-label="Passcode"
          />
          {authError && (
            <p className="mt-3 text-amber-ember text-sm" role="alert">{authError}</p>
          )}
          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-gold px-8 py-3.5 text-espresso text-sm font-medium uppercase tracking-[0.16em] hover:bg-cream transition-colors"
          >
            Open dashboard
          </button>
          <p className="mt-4 text-cream/30 text-xs">Demo passcode: firefly2026</p>
          <button
            type="button"
            onClick={onExit}
            className="mt-4 text-cream/40 hover:text-gold text-xs uppercase tracking-[0.18em] transition-colors"
          >
            Back to the café
          </button>
        </form>
      </div>
    );
  }

  /* ----------------------------- dashboard ----------------------------- */
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const activeOrders = orders.filter((o) => o.status !== 'completed').length;
  const pendingCels = cels.filter((c) => c.status === 'pending').length;
  const todayRevenue = orders
    .filter((o) => o.status !== 'completed' && o.createdAt.slice(0, 10) === new Date().toISOString().slice(0, 10))
    .reduce((s, o) => s + o.total, 0);

  const tabs = [
    { id: 'bookings' as const, label: 'Reservations', count: bookings.length, icon: CalendarHeart, badge: pendingBookings },
    { id: 'orders' as const, label: 'Order Queue', count: orders.length, icon: ShoppingBag, badge: activeOrders },
    { id: 'celebrations' as const, label: 'Celebrations', count: cels.length, icon: PartyPopper, badge: pendingCels },
    { id: 'gallery' as const, label: 'Gallery', count: uploads.length, icon: ImageIcon, badge: 0 },
    { id: 'menuphotos' as const, label: 'Menu Manager', count: menuItems.length, icon: UtensilsCrossed, badge: 0 },
  ];

  const awaitingSettlement = orders
    .filter((o) => o.payment !== 'cash' && o.paymentStatus !== 'paid')
    .reduce((s, o) => s + o.total, 0);

  const filteredItems = menuItems.filter((i) => {
    const q = menuSearch.trim().toLowerCase();
    if (!q) return true;
    return i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q);
  });
  const selectedItem = menuItems.find((i) => i.id === selectedItemId) ?? null;

  return (
    <div className="pt-28 sm:pt-32 pb-24 min-h-screen">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Kicker>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Behind the glow — staff view
              </span>
            </Kicker>
            <h1 className="font-display text-4xl sm:text-5xl text-cream leading-tight">
              One dashboard, <span className="gold-gradient-text italic">everything</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={load}
              className="inline-flex items-center gap-2 rounded-full border border-gold/25 px-5 py-2.5 text-[12px] uppercase tracking-[0.16em] text-gold hover:bg-gold hover:text-espresso transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={onExit}
              className="rounded-full border border-cream/15 px-5 py-2.5 text-[12px] uppercase tracking-[0.16em] text-cream/60 hover:border-cream/40 transition-all"
            >
              Exit
            </button>
          </div>
        </div>

        {/* settlement pending banner */}
        <div className="mt-6 flex items-start gap-3.5 rounded-2xl border border-amber-ember/40 bg-amber-ember/8 px-5 py-4">
          <AlertTriangle className="w-4.5 h-4.5 text-amber-ember shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-ember text-[13px] uppercase tracking-[0.14em]">Payments — settlement pending</p>
            <p className="text-cream/55 text-sm mt-1 leading-relaxed">
              Card &amp; transfer payments are captured and recorded, but the café&rsquo;s merchant account
              is not configured yet, so no funds are released. Connect Paystack/Flutterwave and set the
              settlement account to start moving money.
            </p>
          </div>
        </div>

        {/* stat cards */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Pending reservations', value: pendingBookings, icon: CalendarHeart },
            { label: 'Orders in flight', value: activeOrders, icon: ShoppingBag },
            { label: 'Awaiting settlement', value: naira(awaitingSettlement), icon: Banknote },
            { label: 'Celebrations to plan', value: pendingCels, icon: PartyPopper },
            { label: "Tonight's order value", value: naira(todayRevenue), icon: LayoutDashboard },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-3xl card-sheen border border-gold/12 p-5 sm:p-6">
              <Icon className="w-4.5 h-4.5 text-gold/70 mb-3" />
              <p className="font-display text-2xl sm:text-3xl text-cream">{value}</p>
              <p className="mt-1 text-cream/45 text-[11px] uppercase tracking-[0.16em]">{label}</p>
            </div>
          ))}
        </div>

        {/* tabs */}
        <div className="mt-10 flex gap-2.5 overflow-x-auto no-scrollbar pb-1" role="tablist">
          {tabs.map(({ id, label, count, icon: Icon, badge }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[12px] uppercase tracking-[0.14em] border whitespace-nowrap transition-all ${
                tab === id ? 'bg-gold text-espresso border-gold font-medium' : 'border-gold/25 text-cream/60 hover:border-gold/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label} ({count})
              {badge > 0 && tab !== id && (
                <span className="rounded-full bg-amber-ember text-espresso text-[10px] font-semibold min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* --------------------------- bookings --------------------------- */}
        {tab === 'bookings' && (
          <div className="mt-8 grid gap-3.5">
            {bookings.length === 0 && <EmptyState icon={CalendarHeart} text="No reservations yet — the first one will land here." />}
            {bookings.map((b) => (
              <article key={b.id} className={`rounded-3xl border p-5 sm:p-6 card-sheen ${b.status === 'pending' ? 'border-amber-ember/40' : 'border-gold/12'}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-display text-xl text-cream">{b.name}</h3>
                      <StatusPill status={b.status} />
                      {b.occasion !== 'casual' && (
                        <span className="rounded-full bg-gold/12 border border-gold/30 text-gold text-[10px] uppercase tracking-[0.14em] px-2.5 py-1">
                          {b.occasion.replace('-', ' ')}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-cream/60">
                      <span className="flex items-center gap-1.5"><CalendarHeart className="w-3.5 h-3.5 text-gold/70" />{fmtDate(b.date)} · {b.time}</span>
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gold/70" />{b.partySize} guests</span>
                      <a href={`tel:${b.phone}`} className="flex items-center gap-1.5 hover:text-gold transition-colors"><Phone className="w-3.5 h-3.5 text-gold/70" />{b.phone}</a>
                    </p>
                    {b.notes && (
                      <p className="mt-2.5 text-cream/45 text-[13.5px] font-light italic">&ldquo;{b.notes}&rdquo;</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    {b.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => setBookingStatus(b.id, 'confirmed')}
                          className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4.5 py-2.5 text-espresso text-[11px] uppercase tracking-[0.14em] font-medium hover:bg-cream transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" /> Confirm
                        </button>
                        <button
                          onClick={() => setBookingStatus(b.id, 'declined')}
                          className="inline-flex items-center gap-1.5 rounded-full border border-cream/20 px-4 py-2.5 text-cream/60 text-[11px] uppercase tracking-[0.14em] hover:border-amber-ember hover:text-amber-ember transition-colors"
                        >
                          <X className="w-3.5 h-3.5" /> Decline
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setBookingStatus(b.id, 'pending')}
                        className="text-cream/40 text-[11px] uppercase tracking-[0.14em] hover:text-gold transition-colors"
                      >
                        Undo
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ---------------------------- orders ---------------------------- */}
        {tab === 'orders' && (
          <div className="grid gap-3.5">
            {orders.length === 0 && <EmptyState icon={ShoppingBag} text="No orders yet — the kitchen queue is quiet." />}
            {orders.map((o) => {
              const items = safeParse(o.items);
              const flow = o.fulfil === 'delivery' ? DELIVERY_FLOW : PICKUP_FLOW;
              const idx = flow.indexOf(o.status as typeof flow[number]);
              const next = idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : null;
              const nextLabel =
                next === 'preparing' ? 'preparing' :
                next === 'ready' ? 'ready' :
                next === 'out_for_delivery' ? 'out for delivery' :
                next === 'delivered' ? 'delivered' : 'completed';
              return (
                <article key={o.id} className={`rounded-3xl border p-5 sm:p-6 card-sheen ${o.status === 'received' ? 'border-amber-ember/40' : 'border-gold/12'}`}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="font-display text-xl text-gold tracking-[0.08em]">{o.ref}</h3>
                        <StatusPill status={o.status} />
                        <span className="rounded-full border border-gold/25 text-cream/60 text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 inline-flex items-center gap-1.5">
                          {o.fulfil === 'delivery' ? <Bike className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
                          {o.fulfil === 'delivery' ? 'Delivery' : 'Pickup'}
                        </span>
                        <PaymentBadge method={o.payment} status={o.paymentStatus} />
                      </div>
                      <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-cream/60">
                        <span>{o.name}</span>
                        <a href={`tel:${o.phone}`} className="flex items-center gap-1.5 hover:text-gold transition-colors"><Phone className="w-3.5 h-3.5 text-gold/70" />{o.phone}</a>
                      </p>
                      {o.fulfil === 'delivery' && o.zone && (
                        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-cream/50">
                          <MapPin className="w-3.5 h-3.5 text-gold/70 shrink-0" />
                          <span className="text-gold/90">{o.zone}</span>
                          {o.landmark && <span className="text-cream/40">· near {o.landmark}</span>}
                          {o.address && <span className="block w-full text-cream/40">{o.address}</span>}
                        </p>
                      )}
                      {o.fulfil !== 'delivery' && o.address && (
                        <p className="mt-1.5 flex items-center gap-1.5 min-w-0 text-[13px] text-cream/50"><MapPin className="w-3.5 h-3.5 text-gold/70 shrink-0" /><span className="truncate">{o.address}</span></p>
                      )}
                      <button
                        onClick={() => setOpenRow(openRow === o.id ? null : o.id)}
                        className="mt-2.5 inline-flex items-center gap-1.5 text-gold/80 text-xs uppercase tracking-[0.14em] hover:text-gold"
                        aria-expanded={openRow === o.id}
                      >
                        {items.length} items <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openRow === o.id ? 'rotate-180' : ''}`} />
                      </button>
                      {openRow === o.id && (
                        <ul className="mt-3 grid gap-1.5 text-sm text-cream/60 border-l border-gold/20 pl-4">
                          {items.map((it: { name: string; qty: number; price: number }, i: number) => (
                            <li key={i} className="flex justify-between gap-6 max-w-xs">
                              <span>{it.qty} × {it.name}</span>
                              <span className="text-cream/40">{naira(it.price * it.qty)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display text-2xl text-gold">{naira(o.total)}</p>
                      {o.payment !== 'cash' && o.paymentStatus !== 'paid' && (
                        <button
                          onClick={() => setOrderStatus(o.id, o.status, 'paid')}
                          className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-moss/50 bg-moss/15 px-4.5 py-2 text-moss-soft text-[11px] uppercase tracking-[0.14em] font-medium hover:bg-moss/30 transition-colors"
                        >
                          <CreditCard className="w-3.5 h-3.5" /> Mark paid
                        </button>
                      )}
                      {next ? (
                        <button
                          onClick={() => setOrderStatus(o.id, next)}
                          className={`${o.payment !== 'cash' && o.paymentStatus !== 'paid' ? 'ml-2' : ''} mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-gold px-4.5 py-2.5 text-espresso text-[11px] uppercase tracking-[0.14em] font-medium hover:bg-cream transition-colors`}
                        >
                          Mark {nextLabel}
                        </button>
                      ) : (
                        <span className="mt-2.5 inline-flex items-center gap-1.5 text-cream/40 text-[11px] uppercase tracking-[0.14em]">
                          <Check className="w-3.5 h-3.5" /> Done
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* -------------------------- celebrations -------------------------- */}
        {tab === 'celebrations' && (
        <div className="grid gap-8">
          {/* add-on pricing */}
          <div className="rounded-3xl border border-gold/15 card-sheen p-6">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                <Banknote className="w-4.5 h-4.5 text-gold" />
              </span>
              <div>
                <h2 className="font-display text-xl text-cream">Celebrate add-on prices</h2>
                <p className="text-cream/45 text-xs">Shown as “from ₦…” on the Celebrate page · changes go live instantly</p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {addons.filter((a) => a.price !== null).map((a) => (
                <label key={a.id} className="grid gap-2">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-cream/50">
                    {a.label}{a.unit ? ` ${a.unit}` : ''}
                  </span>
                  <span className="relative block">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/70 text-sm">₦</span>
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={addonDrafts[a.id] ?? ''}
                      onChange={(e) => {
                        setAddonDrafts((d) => ({ ...d, [a.id]: e.target.value }));
                        setPriceNotice('');
                      }}
                      className="w-full rounded-xl bg-espresso-deep/70 border border-gold/20 pl-9 pr-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
                      aria-label={`${a.label} price in naira`}
                    />
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button
                onClick={savePrices}
                disabled={pricesBusy}
                className="rounded-full bg-gold px-6 py-3 text-espresso text-[12px] font-medium uppercase tracking-[0.16em] hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-wait"
              >
                {pricesBusy ? 'Saving…' : 'Save prices'}
              </button>
              <button
                onClick={resetPrices}
                disabled={pricesBusy}
                className="text-cream/40 text-[11px] uppercase tracking-[0.14em] hover:text-gold transition-colors disabled:opacity-50"
              >
                Restore house prices
              </button>
              {priceNotice && <p className="text-cream/60 text-xs" role="status">{priceNotice}</p>}
            </div>
          </div>

          {/* requests */}
          <div className="grid gap-3.5">
            {cels.length === 0 && <EmptyState icon={PartyPopper} text="No celebration requests yet — the next birthday is out there." />}
            {cels.map((c) => (
              <article key={c.id} className={`rounded-3xl border p-5 sm:p-6 card-sheen ${c.status === 'pending' ? 'border-amber-ember/50 bg-gradient-to-br from-amber-ember/8 to-card' : 'border-gold/12'}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-display text-xl text-cream">{c.name}</h3>
                      <StatusPill status={c.status} />
                      <span className="rounded-full bg-amber-ember/15 border border-amber-ember/40 text-amber-ember text-[10px] uppercase tracking-[0.14em] px-2.5 py-1">
                        {c.occasion.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-cream/60">
                      <span className="flex items-center gap-1.5"><CalendarHeart className="w-3.5 h-3.5 text-gold/70" />{fmtDate(c.date)} · {c.time}</span>
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gold/70" />{c.guestCount} guests</span>
                      <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 hover:text-gold transition-colors"><Phone className="w-3.5 h-3.5 text-gold/70" />{c.phone}</a>
                    </p>
                    {c.addOns && (
                      <p className="mt-2.5 flex flex-wrap gap-1.5">
                        {c.addOns.split(',').filter(Boolean).map((a) => (
                          <span key={a} className="rounded-full border border-gold/25 text-gold/90 text-[10px] uppercase tracking-[0.12em] px-2.5 py-1">
                            {a.replace('-', ' ')}
                          </span>
                        ))}
                      </p>
                    )}
                    {c.notes && (
                      <p className="mt-2.5 text-cream/45 text-[13.5px] font-light italic max-w-xl">&ldquo;{c.notes}&rdquo;</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    {c.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => setCelebrationStatus(c.id, 'confirmed')}
                          className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4.5 py-2.5 text-espresso text-[11px] uppercase tracking-[0.14em] font-medium hover:bg-cream transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" /> Take it on
                        </button>
                        <button
                          onClick={() => setCelebrationStatus(c.id, 'declined')}
                          className="inline-flex items-center gap-1.5 rounded-full border border-cream/20 px-4 py-2.5 text-cream/60 text-[11px] uppercase tracking-[0.14em] hover:border-amber-ember hover:text-amber-ember transition-colors"
                        >
                          <X className="w-3.5 h-3.5" /> Decline
                        </button>
                      </>
                    ) : (
                      <a
                        href={`${BRAND.whatsapp}?text=${encodeURIComponent(`Hello ${c.name}, about your ${c.occasion.replace('-', ' ')} on ${fmtDate(c.date)}...`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold text-[11px] uppercase tracking-[0.14em] hover:underline underline-offset-4"
                      >
                        Message guest
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        )}

        {/* ---------------------------- gallery ---------------------------- */}
        {tab === 'gallery' && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr] items-start">
            {/* upload form */}
            <form
              onSubmit={uploadPhoto}
              className="rounded-3xl border border-gold/15 card-sheen p-6 lg:sticky lg:top-28"
              aria-label="Upload a gallery photo"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                  <ImagePlus className="w-4.5 h-4.5 text-gold" />
                </span>
                <div>
                  <h2 className="font-display text-xl text-cream">Add a photo</h2>
                  <p className="text-cream/45 text-xs">Gallery or Celebrate page · 5MB max</p>
                </div>
              </div>
              <label className="block text-[11px] uppercase tracking-[0.16em] text-cream/50 mb-2">Collection</label>
              <div className="flex flex-wrap gap-2">
                {GALLERY_TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setUploadTab(t.id)}
                    aria-pressed={uploadTab === t.id}
                    className={`rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.12em] border transition-all ${
                      uploadTab === t.id
                        ? 'bg-gold text-espresso border-gold font-medium'
                        : 'border-gold/25 text-cream/60 hover:border-gold/60'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <label className="block text-[11px] uppercase tracking-[0.16em] text-cream/50 mb-2 mt-5" htmlFor="gallery-photo-input">Photo</label>
              <input
                id="gallery-photo-input"
                name="photo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="w-full rounded-xl bg-espresso-deep/70 border border-gold/20 px-4 py-3 text-cream/70 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-1.5 file:text-espresso file:text-xs file:uppercase file:tracking-[0.12em] file:cursor-pointer cursor-pointer focus:border-gold focus:outline-none"
              />
              <label className="block text-[11px] uppercase tracking-[0.16em] text-cream/50 mb-2 mt-5" htmlFor="gallery-caption-input">Caption</label>
              <input
                id="gallery-caption-input"
                type="text"
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                placeholder="e.g. Seafood tower, Friday night"
                maxLength={120}
                className="w-full rounded-xl bg-espresso-deep/70 border border-gold/20 px-4 py-3 text-cream placeholder:text-cream/25 focus:border-gold focus:outline-none text-sm"
              />
              {uploadError && <p className="mt-3 text-amber-ember text-sm" role="alert">{uploadError}</p>}
              <button
                type="submit"
                disabled={uploading}
                className="mt-6 w-full rounded-full bg-gold px-8 py-3.5 text-espresso text-sm font-medium uppercase tracking-[0.16em] hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading…' : uploadTab === 'celebrate' ? 'Publish to Celebrate page' : 'Publish to gallery'}
              </button>
              <p className="mt-4 text-cream/30 text-xs leading-relaxed">
                Photos in a gallery collection appear in the public Gallery, after the house
                set. Photos marked <span className="text-gold/70">Celebrate page</span> show
                on the Celebrate view — leave it empty and that page stays photo-free.
              </p>
            </form>

            {/* uploaded photos */}
            <div>
              {uploads.length === 0 ? (
                <EmptyState icon={ImageIcon} text="No uploaded photos yet — the gallery currently shows the house collection." />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {uploads.map((u) => (
                    <figure key={u.id} className="rounded-2xl border border-gold/12 overflow-hidden card-sheen">
                      <div className="relative w-full aspect-[4/3]">
                        <Image
                          src={`/api/gallery-media/${u.id}`}
                          alt={u.alt || u.caption}
                          fill
                          sizes="(max-width: 640px) 50vw, 240px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <figcaption className="p-3.5">
                        <p className="text-cream/85 text-[13px] font-medium leading-snug line-clamp-2">{u.caption || 'Untitled'}</p>
                        <p className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-gold/12 border border-gold/30 text-gold text-[9px] uppercase tracking-[0.14em] px-2 py-0.5">
                            {GALLERY_TABS.find((t) => t.id === u.tab)?.label ?? u.tab}
                          </span>
                          <span className="text-cream/35 text-[10px]">{Math.max(1, Math.round(u.size / 1024))} KB</span>
                        </p>
                        <div className="mt-2.5">
                          {confirmDel === u.id ? (
                            <span className="flex items-center gap-2">
                              <button
                                onClick={() => deletePhoto(u.id)}
                                className="rounded-full bg-amber-ember px-3 py-1.5 text-espresso text-[10px] uppercase tracking-[0.12em] font-medium hover:bg-gold transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setConfirmDel(null)}
                                className="text-cream/40 text-[10px] uppercase tracking-[0.12em] hover:text-cream transition-colors"
                              >
                                Keep
                              </button>
                            </span>
                          ) : (
                            <button
                              onClick={() => setConfirmDel(u.id)}
                              className="inline-flex items-center gap-1.5 text-cream/40 text-[10px] uppercase tracking-[0.12em] hover:text-amber-ember transition-colors"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          )}
                        </div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --------------------------- menu photos --------------------------- */}
        {tab === 'menuphotos' && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr] items-start">
            {/* item picker */}
            <div className="rounded-3xl border border-gold/15 card-sheen p-6 lg:sticky lg:top-28">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                  <UtensilsCrossed className="w-4.5 h-4.5 text-gold" />
                </span>
                <div>
                  <h2 className="font-display text-xl text-cream">Menu manager</h2>
                  <p className="text-cream/45 text-xs">{menuItems.length} items · prices, availability &amp; photos</p>
                </div>
              </div>
              <input
                type="search"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search dishes, drinks, categories…"
                className="w-full rounded-xl bg-espresso-deep/70 border border-gold/20 px-4 py-3 text-cream placeholder:text-cream/25 focus:border-gold focus:outline-none text-sm"
                aria-label="Search menu items"
              />
              <div className="mt-4 max-h-[520px] overflow-y-auto grid gap-1.5 pr-1">
                {filteredItems.map((it) => {
                  const overridden = it.image?.startsWith('/api/menu-media/');
                  return (
                    <button
                      key={it.id}
                      onClick={() => {
                        setSelectedItemId(it.id);
                        setPriceDraft(String(it.price));
                        setItemPriceNotice('');
                        setPhotoNotice('');
                      }}
                      className={`flex items-center gap-3 rounded-2xl border p-2.5 text-left transition-all ${
                        selectedItemId === it.id ? 'border-gold bg-gold/10' : 'border-transparent hover:border-gold/30'
                      }`}
                      aria-pressed={selectedItemId === it.id}
                    >
                      <span className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-gold/15 bg-espresso-deep/60 flex items-center justify-center">
                        {it.image ? (
                          <Image src={it.image} alt="" width={44} height={44} className="w-full h-full object-cover" unoptimized />
                        ) : (
                          <span className="font-display text-gold/70 text-sm">{it.name.charAt(0)}</span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-cream text-[13.5px] truncate">{it.name}</span>
                        <span className="block text-cream/40 text-[11px] truncate">{it.category} · {naira(it.price)}</span>
                      </span>
                      {it.price !== it.basePrice && (
                        <span className="w-2 h-2 rounded-full bg-amber-ember shrink-0" title="Price adjusted" />
                      )}
                      {overridden && (
                        <span className="w-2 h-2 rounded-full bg-gold shrink-0" title="Admin photo attached" />
                      )}
                    </button>
                  );
                })}
                {filteredItems.length === 0 && (
                  <p className="text-cream/40 text-sm py-6 text-center">Nothing matches &ldquo;{menuSearch}&rdquo;.</p>
                )}
              </div>
            </div>

            {/* price & photo panels */}
            <div className="grid gap-6">
              {!selectedItem ? (
                <EmptyState icon={UtensilsCrossed} text="Pick a menu item on the left to manage its price, availability and photo." />
              ) : (
                <>
                  {/* pricing & availability */}
                  <div className="rounded-3xl border border-gold/15 card-sheen p-6">
                    <div className="flex items-center gap-2.5">
                      <span className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                        <Banknote className="w-4.5 h-4.5 text-gold" />
                      </span>
                      <div>
                        <h2 className="font-display text-xl text-cream">{selectedItem.name}</h2>
                        <p className="text-cream/45 text-xs">{selectedItem.category} · price &amp; availability — changes go live instantly</p>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,260px)_1fr] sm:items-end">
                      <label className="grid gap-2">
                        <span className="text-[11px] uppercase tracking-[0.16em] text-cream/50">
                          Menu price{selectedItem.price !== selectedItem.basePrice ? ` · house ${naira(selectedItem.basePrice)}` : ''}
                        </span>
                        <span className="relative block">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/70 text-sm">₦</span>
                          <input
                            type="number"
                            min={0}
                            inputMode="numeric"
                            value={priceDraft}
                            onChange={(e) => {
                              setPriceDraft(e.target.value);
                              setItemPriceNotice('');
                            }}
                            className="w-full rounded-xl bg-espresso-deep/70 border border-gold/20 pl-9 pr-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
                            aria-label={`Price for ${selectedItem.name} in naira`}
                          />
                        </span>
                      </label>
                      <div className="flex flex-wrap items-center gap-3.5">
                        <button
                          onClick={saveItemPrice}
                          disabled={priceBusy}
                          className="rounded-full bg-gold px-6 py-3 text-espresso text-[12px] font-medium uppercase tracking-[0.16em] hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-wait"
                        >
                          {priceBusy ? 'Saving…' : 'Save price'}
                        </button>
                        {selectedItem.price !== selectedItem.basePrice && selectedItem.basePrice > 0 && (
                          <button
                            onClick={restoreItemPrice}
                            disabled={priceBusy}
                            className="text-cream/40 text-[11px] uppercase tracking-[0.14em] hover:text-gold transition-colors disabled:opacity-50"
                          >
                            Restore house price ({naira(selectedItem.basePrice)})
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-3.5 border-t border-gold/10 pt-5">
                      {selectedItem.available ? (
                        <button
                          onClick={toggleItemAvailability}
                          disabled={priceBusy}
                          className="rounded-full border border-cream/20 px-5 py-2.5 text-cream/60 text-[11px] uppercase tracking-[0.14em] hover:border-amber-ember hover:text-amber-ember transition-colors disabled:opacity-50"
                        >
                          Mark unavailable
                        </button>
                      ) : (
                        <button
                          onClick={toggleItemAvailability}
                          disabled={priceBusy}
                          className="inline-flex items-center gap-1.5 rounded-full border border-moss/50 bg-moss/15 px-4.5 py-2.5 text-moss-soft text-[11px] uppercase tracking-[0.14em] font-medium hover:bg-moss/30 transition-colors disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" /> Back on the menu
                        </button>
                      )}
                      <p className="text-cream/45 text-xs">
                        {selectedItem.available
                          ? 'On the menu — guests can order it.'
                          : 'Off the menu — shows greyed out as “currently unavailable”.'}
                      </p>
                    </div>
                    {itemPriceNotice && <p className="mt-3 text-cream/60 text-xs" role="status">{itemPriceNotice}</p>}
                  </div>

                  {/* photo panel */}
                  <div className="rounded-3xl border border-gold/15 card-sheen p-6">
                    <div className="flex items-center gap-2.5 mb-5">
                      <span className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-4.5 h-4.5 text-gold" />
                      </span>
                      <div>
                        <h2 className="font-display text-xl text-cream">Photo</h2>
                        <p className="text-cream/45 text-xs">House photo or your upload — the upload wins until removed</p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-[220px_1fr] gap-6 items-start">
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-gold/15 bg-espresso-deep/60 flex items-center justify-center">
                    {selectedItem.image ? (
                      <Image
                        src={selectedItem.image}
                        alt={selectedItem.name}
                        fill
                        sizes="220px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="font-display text-5xl text-gold/50">{selectedItem.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-cream/45 text-[13px] leading-relaxed">
                      {selectedItem.image?.startsWith('/api/menu-media/')
                        ? 'This item shows your uploaded photo. Removing it brings back the house photo.'
                        : selectedItem.image
                          ? 'This item currently shows the house photo — attach yours to replace it on the live menu.'
                          : 'No photo yet — this item shows a gold monogram. Attach a photo to bring it to life.'}
                    </p>
                    <label
                      className="block text-[11px] uppercase tracking-[0.16em] text-cream/50 mb-2 mt-5"
                      htmlFor="menu-photo-input"
                    >
                      Photo (JPG, PNG or WebP · 5MB max)
                    </label>
                    <input
                      id="menu-photo-input"
                      ref={photoInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="w-full rounded-xl bg-espresso-deep/70 border border-gold/20 px-4 py-3 text-cream/70 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-1.5 file:text-espresso file:text-xs file:uppercase file:tracking-[0.12em] file:cursor-pointer cursor-pointer focus:border-gold focus:outline-none"
                    />
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        onClick={uploadItemPhoto}
                        disabled={photoBusy}
                        className="rounded-full bg-gold px-6 py-3 text-espresso text-[12px] font-medium uppercase tracking-[0.16em] hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-wait"
                      >
                        {photoBusy
                          ? 'Working…'
                          : selectedItem.image?.startsWith('/api/menu-media/')
                            ? 'Replace photo'
                            : 'Attach photo'}
                      </button>
                      {selectedItem.image?.startsWith('/api/menu-media/') && (
                        <button
                          onClick={removeItemPhoto}
                          disabled={photoBusy}
                          className="rounded-full border border-cream/20 px-5 py-3 text-cream/60 text-[11px] uppercase tracking-[0.14em] hover:border-amber-ember hover:text-amber-ember transition-colors disabled:opacity-50"
                        >
                          Remove uploaded photo
                        </button>
                      )}
                    </div>
                    {photoNotice && <p className="mt-3 text-cream/60 text-xs" role="status">{photoNotice}</p>}
                  </div>
                </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <p className="mt-12 text-center text-cream/30 text-xs flex items-center justify-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          Notifications fire automatically — confirmation emails, order updates, celebration flags.
        </p>
      </div>
    </div>
  );
}

function PaymentBadge({ method, status }: { method: string; status: string }) {
  const paid = status === 'paid';
  const cash = method === 'cash';
  const tone = paid
    ? 'bg-moss/25 border-moss/50 text-moss-soft'
    : cash
      ? 'bg-gold/12 border-gold/40 text-gold'
      : 'bg-amber-ember/15 border-amber-ember/50 text-amber-ember';
  const label = paid ? 'PAID' : cash ? 'PAY ON DELIVERY' : 'PAYMENT PENDING';
  const Icon = cash ? Banknote : CreditCard;
  return (
    <span className={`rounded-full border text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 inline-flex items-center gap-1.5 ${tone}`}>
      <Icon className="w-3 h-3" /> {label}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === 'confirmed' || status === 'ready' || status === 'completed' || status === 'delivered'
      ? 'bg-moss/25 border-moss/50 text-moss-soft'
      : status === 'out_for_delivery'
        ? 'bg-gold/15 border-gold/50 text-gold'
        : status === 'declined'
          ? 'bg-amber-ember/15 border-amber-ember/50 text-amber-ember'
          : status === 'received' || status === 'pending'
            ? 'bg-gold/12 border-gold/40 text-gold'
            : 'bg-cream/8 border-cream/25 text-cream/70';
  const label = status.replace(/_/g, ' ');
  return (
    <span className={`rounded-full border text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 ${tone}`}>
      {label}
    </span>
  );
}

function EmptyState({ icon: Icon, text }: { icon: typeof Lock; text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-gold/20 p-14 text-center">
      <Icon className="w-8 h-8 text-gold/40 mx-auto mb-4" />
      <p className="text-cream/45 font-light">{text}</p>
    </div>
  );
}

function safeParse(json: string): unknown[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
