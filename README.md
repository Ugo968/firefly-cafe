# Firefly Café — Website

Luxury single-page website for **Firefly Café**, 18 Sir Andy Umeoji St., Awka, Anambra State, Nigeria.

Built with **Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · Prisma + SQLite**.

---

## Quick start (Visual Studio Code)

> Requires **Node.js 20.9 or newer** — download from https://nodejs.org (LTS).

1. Open this folder in VS Code: **File → Open Folder…**
2. Open the integrated terminal (**Terminal → New Terminal**) and install dependencies:

   ```bash
   npm install
   ```

3. Generate the Prisma client (the SQLite database `prisma/dev.db` is already included with your menu, bookings, orders and gallery data):

   ```bash
   npx prisma generate
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open **http://localhost:3000** in your browser.

That's it — no database setup is needed because `prisma/dev.db` ships with the project.

---

## Staff / Admin dashboard

- Click **Staff Login** at the bottom of the site (footer) to open **Behind the Glow**.
- Passcode: **`firefly2026`** (override it by setting `ADMIN_PASSCODE` in `.env`).

From the dashboard you can:

| Tab | What you can do |
|---|---|
| Bookings | Confirm / decline table reservations |
| Orders | Move orders through the kitchen + delivery flow, mark payments paid |
| Celebrations | Manage celebration requests, reprice Celebrate add-ons |
| Gallery | Upload photos to the public gallery (Room / Kitchen / Bar / Moments) or to the Celebrate page |
| Menu Manager | Reprice any of the 153 menu items, restore house prices, mark items unavailable, attach photos |

---

## Npm scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Sync `prisma/schema.prisma` to the SQLite database |
| `npm run db:generate` | Generate the Prisma client (after schema changes) |
| `npm run seed:menu` | Reset the menu to the original 153-item house menu |

---

## Where things live

```
src/
  app/                     Next.js app router (page shell + API routes)
    api/menu               Public menu API
    api/menu-items/[id]    Admin price & availability updates
    api/bookings           Reservations
    api/orders             Orders + delivery + payment status
    api/celebrations       Celebration requests
    api/celebrate-addons   Celebrate add-on pricing (admin adjustable)
    api/gallery(+media)    Admin photo uploads & image serving
    api/admin              Admin passcode gate + dashboard data
  components/firefly/      All views: home, menu, gallery, reserve,
                           order, celebrate, admin + header/footer chrome
  lib/firefly-data.ts      Brand info, social links, categories, static fallbacks
prisma/
  schema.prisma            Database models
  dev.db                   SQLite database (included)
public/firefly/            Brand & food imagery
scripts/
  seed-menu.mjs            Menu seeder (run: npm run seed:menu)
  menu-data-*.mjs          The café's full menu data (edit prices here to re-seed)
```

### Common customisations

- **Social links** (Instagram / TikTok / Facebook / WhatsApp): `src/lib/firefly-data.ts` → `SOCIALS`
- **Phone, address, hours, tagline**: `src/lib/firefly-data.ts` → `BRAND`
- **Menu items & house prices**: edit `scripts/menu-data-*.mjs`, then run `npm run seed:menu`
- **Theme colours**: `src/app/globals.css` (light + dark palettes)

---

## Notes

- **Theme**: the site is in evening (dark) mode by default; the sun/moon button in the header switches to daylight mode and remembers the choice per device.
- **Payments**: the checkout uses a sandbox gateway. Settlement is intentionally marked *PENDING* until a real merchant account (e.g. Paystack/Flutterwave) is configured — see `src/app/api/payments`.
- **Database**: to start completely fresh, delete `prisma/dev.db`, run `npm run db:push`, then `npm run seed:menu`.
- **Delivery zones** (UNIZIK campus, hostels, Awka & axis) are defined in `src/lib/delivery-zones.ts`.
