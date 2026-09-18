export const BRAND = {
  name: 'Firefly Café',
  short: 'Firefly',
  tagline: 'Every great evening begins with a glow',
  phone: '+2348104266494',
  phoneDisplay: '+234 810 426 6494',
  whatsapp: 'https://wa.me/2348104266494',
  address: '18 Sir Andy Umeoji St., Awka 100102, Anambra, Nigeria',
  addressShort: '18 Sir Andy Umeoji St., Awka',
  mapsUrl: 'https://maps.app.goo.gl/ST6kmdCZ1NpiW1nP6',
  mapEmbed:
    'https://www.openstreetmap.org/export/embed.html?bbox=7.0753%2C6.2294%2C7.0913%2C6.2374&layer=mapnik&marker=6.2334109%2C7.0833413',
  rating: 4.3,
  hoursLine: 'Open daily · 10:00 — 23:00',
  plusCode: '63MM+98 Awka',
} as const;

// Café's official social profiles — links as supplied by the owner
// (tracking wrappers stripped; WhatsApp uses their official chat link)
export type SocialId = 'instagram' | 'tiktok' | 'facebook' | 'whatsapp';

export const SOCIALS: { id: SocialId; label: string; href: string }[] = [
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/fireflycafe' },
  { id: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@fireflycafe_' },
  { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/971587399377352' },
  { id: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/qr/GNWOJQFRI5YTD1' },
];

export type View =
  | 'home'
  | 'menu'
  | 'gallery'
  | 'book'
  | 'order'
  | 'celebrate'
  | 'admin';

export const NAV: { id: View; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'menu', label: 'Menu' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'celebrate', label: 'Celebrate' },
  { id: 'book', label: 'Reserve' },
  { id: 'order', label: 'Order Ahead' },
];

export const MENU_CATEGORIES = [
  'Breakfast',
  'Desserts',
  'Appetizers',
  'Peppered Corner',
  'Soups',
  'Salads',
  'Italian Pasta',
  'Main Course',
  'Side Dishes',
  'Special Side Dishes',
  'Pizzas',
  'Burgers & Wraps',
  'Signature Platters',
  'Grill Corner',
  'Cocktails',
  'Mocktails',
  'Smoothies',
  'Milkshakes',
  'Mixers',
  'Fresh Juice',
  'Shots',
  'Whiskeys',
  'Champagne',
  'Cognac',
  'Tequila',
  'Vodka',
  'Wines',
  'Smoker Corner',
  'Tea',
  'Coffee',
] as const;

export const MENU_GROUPS: { id: string; label: string; blurb: string; cats: readonly string[] }[] = [
  {
    id: 'kitchen',
    label: 'The Kitchen',
    blurb: 'From English breakfast to the tomahawk',
    cats: [
      'Breakfast', 'Appetizers', 'Peppered Corner', 'Soups', 'Salads',
      'Italian Pasta', 'Main Course', 'Side Dishes', 'Special Side Dishes',
      'Pizzas', 'Burgers & Wraps', 'Signature Platters', 'Grill Corner', 'Desserts',
    ],
  },
  {
    id: 'bar',
    label: 'The Bar',
    blurb: 'Cocktails, champagne and top-shelf pours',
    cats: ['Cocktails', 'Shots', 'Whiskeys', 'Champagne', 'Cognac', 'Tequila', 'Vodka', 'Wines', 'Mixers'],
  },
  {
    id: 'cafe',
    label: 'Café & Lounge',
    blurb: 'Mocktails, smoothies, shisha and slow coffee',
    cats: ['Mocktails', 'Smoothies', 'Milkshakes', 'Fresh Juice', 'Tea', 'Coffee', 'Smoker Corner'],
  },
];

export const CATEGORY_NOTES: Record<string, string> = {
  Soups: 'All served with a bread roll',
  'Main Course': 'All served with your choice of sides',
  'Grill Corner': 'All served with your choice of fries and coleslaw',
};

export const OCCASIONS = [
  { id: 'birthday', label: 'Birthday' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'anniversary', label: 'Anniversary' },
  { id: 'date-night', label: 'Date Night' },
  { id: 'family-gathering', label: 'Family Gathering' },
  { id: 'business', label: 'Business' },
  { id: 'casual', label: 'Just Dinner' },
] as const;

export const CELEBRATION_OCCASIONS = [
  { id: 'birthday', label: 'Birthday', blurb: 'Candles, cake, and a table that glows.' },
  { id: 'proposal', label: 'Proposal', blurb: 'The question, asked in the right light.' },
  { id: 'anniversary', label: 'Anniversary', blurb: 'One more year, one more evening here.' },
  { id: 'private-gathering', label: 'Private Gathering', blurb: 'Your people, your corner of Firefly.' },
  { id: 'other', label: 'Something Else', blurb: 'Tell us what we are toasting to.' },
] as const;

// Celebrate add-ons. `price` is the house default shown as "from ₦X" —
// the live value comes from /api/celebrate-addons, which merges admin
// overrides stored in the DB. Items without a price show their `hint`.
export type CelebrationAddon = {
  id: string;
  label: string;
  price?: number;
  unit?: string;
  hint?: string;
};

export const CELEBRATION_ADDONS: CelebrationAddon[] = [
  { id: 'cake', label: 'Celebration cake', price: 15000 },
  { id: 'decor', label: 'Table décor & florals', price: 20000 },
  { id: 'photography', label: 'Event photographer', price: 40000 },
  { id: 'custom-menu', label: 'Custom set menu', price: 12000, unit: '/ guest' },
  { id: 'surprise-setup', label: 'Surprise setup', hint: 'we keep the secret' },
];

export const TIME_SLOTS = [
  '10:30', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00',
] as const;

export const GALLERY = {
  room: [
    { src: '/firefly/interior-real.jpg', ar: 1.3333, alt: 'Firefly Café lounge — cream tufted sofas under warm LED lines', caption: 'The room, as it glows' },
    { src: '/firefly/real-room-main-hall.jpg', ar: 0.7967, alt: 'Firefly Café main hall — the long bar counter, leather seats and LED light lines', caption: 'The long bar, the light lines' },
    { src: '/firefly/real-room-entrance-blooms.jpg', ar: 1.197, alt: 'Firefly Café entrance wall with FIREFLY CAFÉ lettering beneath a ceiling of roses', caption: 'The doorway, in full bloom' },
    { src: '/firefly/real-room-swing-daybeds.jpg', ar: 0.5985, alt: 'Red swing daybeds and a glass table in the plant-filled garden', caption: 'Swing daybeds in the garden' },
  ],
  kitchen: [
    { src: '/firefly/real-kitchen-seafood-tower.jpg', ar: 0.5985, alt: 'Signature seafood tower — grilled prawns stacked on a standing skewer over fries and plantain', caption: 'The seafood tower, standing tall' },
    { src: '/firefly/real-kitchen-riz-danana.jpg', ar: 0.7967, alt: "Riz d'Anana — pineapple fried rice served in half a pineapple beside a grilled platter", caption: 'Riz d\u2019Anana, served in a pineapple' },
    { src: '/firefly/real-kitchen-grilled-prawns.jpg', ar: 0.7967, alt: 'Whole grilled prawns over a creamy base, sesame finish, on a black plate', caption: 'Whole prawns, charred and sesame-finished' },
    { src: '/firefly/real-kitchen-rice-and-chicken.jpg', ar: 0.7967, alt: 'Fried rice with coleslaw and peppered chicken bites, served at the counter', caption: 'Rice, coleslaw and peppered chicken bites' },
    { src: '/firefly/real-kitchen-tacos.jpg', ar: 0.9959, alt: 'Three loaded tacos with creamy drizzle on branded Firefly paper', caption: 'Tacos, loaded and drizzled' },
  ],
  bar: [
    { src: '/firefly/real-bar-pinacolada.jpg', ar: 0.7967, alt: 'Piña colada with a pineapple wedge on the bar, FIREFLY CAFÉ letters and TV behind', caption: 'Piña colada beneath the sign' },
    { src: '/firefly/real-bar-milkshake.jpg', ar: 0.5985, alt: 'Strawberry milkshake with whipped cream and sprinkles, FIREFLY CAFÉ bar behind', caption: 'Strawberry milkshake, extra sprinkles' },
    { src: '/firefly/real-bar-asun-jameson.jpg', ar: 0.7967, alt: 'Peppered asun on a wooden board with Jameson whisky and a glowing table lamp', caption: 'Asun board, Jameson, and the warm lamp' },
  ],
  moments: [
    { src: '/firefly/real-moments-night-entrance.jpg', ar: 0.9959, alt: 'Yellow bicycle-wheel art and the neon-lit Firefly entrance after dark', caption: 'The bicycle wall after dark' },
    { src: '/firefly/real-moments-garden-evenings.jpg', ar: 0.9959, alt: 'Outdoor garden lounge at night — palms, string lights and neon glow', caption: 'Garden nights under the neon' },
    { src: '/firefly/real-moments-dining-guest.jpg', ar: 1.197, alt: 'Guest settled into the botanical-wallpaper dining room', caption: 'Settled in for the evening' },
  ],
} as const;

export const REVIEWS = [
  {
    name: 'Adaeze O.',
    stars: 5,
    text: 'From the food to the ambience, people can\u2019t seem to get enough of it. My go-to spot in Awka when the day needs to end beautifully.',
    context: 'Google review',
  },
  {
    name: 'Chukwuemeka N.',
    stars: 5,
    text: 'Came for dinner, stayed until closing. The grilled tilapia is unmatched and the room just wraps around you. Staff remembered us on our second visit.',
    context: 'Google review',
  },
  {
    name: 'Blessing A.',
    stars: 4,
    text: 'We celebrated my sister\u2019s birthday here — they set the table with candles before we arrived. Firefly makes occasions feel like occasions.',
    context: 'Google review',
  },
] as const;

export const PILLARS = [
  {
    id: 'menu',
    kicker: '01 — Menu',
    title: 'The Menu, Illuminated',
    text: 'One hundred and fifty-three dishes across thirty menus — from English breakfast to Don Julio 1942. Priced honestly, tagged for spice, seafood and vegetarian choices.',
  },
  {
    id: 'gallery',
    kicker: '02 — Gallery',
    title: 'The Gallery',
    text: 'A visual room of its own. The sofas, the plating, the little celebrations — scroll a while before you have even booked.',
  },
  {
    id: 'book',
    kicker: '03 — Reserve',
    title: 'Reserve a Table',
    text: 'Date, time, party size, occasion. Confirmed the moment your team taps — no back-and-forth phone calls to lock in a table.',
  },
  {
    id: 'order',
    kicker: '04 — Order Ahead',
    title: 'Order Ahead',
    text: 'Firefly without the wait. Build your cart, pay by card or transfer, and track it from received to ready.',
  },
  {
    id: 'celebrate',
    kicker: '05 — Celebrate',
    title: 'Celebrate at Firefly',
    text: 'Birthdays, proposals, reunions — the occasions that already choose Firefly get their own front door, cake and all.',
  },
] as const;

export const naira = (n: number) => `₦${n.toLocaleString('en-NG')}`;

export const fmtDate = (iso: string) => {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString('en-NG', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch {
    return iso;
  }
};
