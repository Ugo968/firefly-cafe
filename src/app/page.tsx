'use client';

import { useCallback, useState } from 'react';
import type { View } from '@/lib/firefly-data';
import { Header, Footer, useScrollTop } from '@/components/firefly/chrome';
import HomeView from '@/components/firefly/home-view';
import MenuView, { type CartLine, type MenuItem } from '@/components/firefly/menu-view';
import GalleryView from '@/components/firefly/gallery-view';
import BookView from '@/components/firefly/book-view';
import OrderView from '@/components/firefly/order-view';
import CelebrateView from '@/components/firefly/celebrate-view';
import AdminView from '@/components/firefly/admin-view';

export default function Page() {
  const [view, setView] = useState<View>('home');
  const [cart, setCart] = useState<CartLine[]>([]);

  const go = useCallback((v: View) => {
    setView(v);
  }, []);

  useScrollTop(view);

  const addToCart = useCallback((item: MenuItem) => {
    setCart((c) => {
      const found = c.find((l) => l.id === item.id);
      if (found) return c.map((l) => (l.id === item.id ? { ...l, qty: Math.min(30, l.qty + 1) } : l));
      return [...c, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((c) =>
      qty <= 0 ? c.filter((l) => l.id !== id) : c.map((l) => (l.id === id ? { ...l, qty: Math.min(30, qty) } : l))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  return (
    <div className="min-h-screen flex flex-col bg-espresso">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-espresso"
      >
        Skip to content
      </a>
      <Header view={view} go={go} cartCount={cartCount} />
      <main id="main" className="flex-1">
        {view === 'home' && <HomeView go={go} />}
        {view === 'menu' && (
          <MenuView
            onAdd={addToCart}
            cartCount={cartCount}
            goOrder={() => go('order')}
          />
        )}
        {view === 'gallery' && <GalleryView go={go} />}
        {view === 'book' && <BookView />}
        {view === 'order' && (
          <OrderView
            cart={cart}
            setQty={setQty}
            clearCart={clearCart}
            goMenu={() => go('menu')}
          />
        )}
        {view === 'celebrate' && <CelebrateView />}
        {view === 'admin' && <AdminView onExit={() => go('home')} />}
      </main>
      {view !== 'admin' && <Footer go={go} />}
    </div>
  );
}
