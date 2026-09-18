import { PrismaClient } from '@prisma/client';
import { FOOD } from './menu-data-food.mjs';
import { BAR } from './menu-data-bar.mjs';
import { CAFE } from './menu-data-cafe.mjs';

const db = new PrismaClient();

// The café's own category order (drives UI section order + sortOrder)
const MENU_CATEGORIES = [
  'Breakfast', 'Desserts', 'Appetizers', 'Peppered Corner', 'Soups', 'Salads',
  'Italian Pasta', 'Main Course', 'Side Dishes', 'Special Side Dishes',
  'Pizzas', 'Burgers & Wraps', 'Signature Platters', 'Grill Corner',
  'Cocktails', 'Mocktails', 'Smoothies', 'Milkshakes', 'Mixers', 'Fresh Juice',
  'Shots', 'Whiskeys', 'Champagne', 'Cognac', 'Tequila', 'Vodka', 'Wines',
  'Smoker Corner', 'Tea', 'Coffee',
];

// Category-level imagery (only where a strong brand-photo match exists;
// everything else renders as an elegant gold monogram tile)
const CATEGORY_IMAGE = {
  Desserts: '/firefly/dish-dessert.png',
  Appetizers: '/firefly/dish-smallchops.png',
  'Peppered Corner': '/firefly/dish-suya.png',
  'Italian Pasta': '/firefly/dish-pasta.png',
  'Main Course': '/firefly/dish-grill.png',
  'Side Dishes': '/firefly/dish-jollof.png',
  'Special Side Dishes': '/firefly/dish-jollof.png',
  'Burgers & Wraps': '/firefly/dish-shawarma.png',
  'Signature Platters': '/firefly/dish-smallchops.png',
  'Grill Corner': '/firefly/dish-grill.png',
  Cocktails: '/firefly/drink-cocktail.png',
  Mocktails: '/firefly/drink-cocktail.png',
  Smoothies: '/firefly/drink-smoothie.png',
  Milkshakes: '/firefly/drink-smoothie.png',
  'Fresh Juice': '/firefly/drink-smoothie.png',
  Tea: '/firefly/dish-coffee.png',
  Coffee: '/firefly/dish-coffee.png',
};

// Curated for the "Glowing this week" rail + Order Ahead quick-add (all have photos)
const FEATURED = new Set([
  'Whole Grilled Chicken',
  'Seafood Platter',
  'Firefly Signature Cocktail',
  'Chicken Shawarma',
]);

async function main() {
  const menu = [...FOOD, ...BAR, ...CAFE].map((item, i) => ({
    ...item,
    basePrice: item.price, // house price snapshot — admin edits change `price` only
    image: CATEGORY_IMAGE[item.category] ?? null,
    featured: FEATURED.has(item.name),
    sortOrder: i + 1,
  }));

  // ── Validate before touching the database ──
  const errors = [];
  const seen = new Set();
  for (const item of menu) {
    if (!MENU_CATEGORIES.includes(item.category)) errors.push(`Unknown category: ${item.category} (${item.name})`);
    if (!item.name || typeof item.price !== 'number' || item.price <= 0) errors.push(`Bad name/price: ${item.name}`);
    if (seen.has(item.name)) errors.push(`Duplicate item: ${item.name}`);
    seen.add(item.name);
  }
  for (const c of MENU_CATEGORIES) {
    if (!menu.some((m) => m.category === c)) errors.push(`Category has no items: ${c}`);
  }
  if (errors.length) {
    console.error('Seed data validation failed:\n' + errors.join('\n'));
    process.exit(1);
  }

  // ── Replace menu with the café's original menu ──
  await db.menuItem.deleteMany({});
  await db.menuItem.createMany({ data: menu });

  const counts = {};
  for (const m of menu) counts[m.category] = (counts[m.category] || 0) + 1;
  console.log(`Seeded ${menu.length} items across ${Object.keys(counts).length} categories:`);
  console.log(counts);
}

main().catch(console.error).finally(() => db.$disconnect());
