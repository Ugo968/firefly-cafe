// Firefly Café — ORIGINAL MENU (as provided by the café)
// The Bar: Cocktails → Wines (in the café's own menu order)

export const BAR = [
  // ─── COCKTAILS ───────────────────────────────────────────────
  { name: 'Margarita', description: 'Salt, tequila, triple sec, lime juice.', price: 7500, category: 'Cocktails', tags: '', spiceLevel: 0 },
  { name: 'Sex on the Beach', description: 'Vodka, orange juice, grenadine, schnapps, cranberry juice.', price: 7500, category: 'Cocktails', tags: '', spiceLevel: 0 },
  { name: 'Long Island', description: 'Vodka, tequila, gin, rum, Cointreau, lime juice, coke.', price: 9000, category: 'Cocktails', tags: '', spiceLevel: 0 },
  { name: 'Adios Motherf**ker', description: 'Vodka, rum, gin, blue curaçao, triple sec, 7up.', price: 9000, category: 'Cocktails', tags: '', spiceLevel: 0 },
  { name: 'Piña Colada', description: 'Vodka, coconut cream, coconut milk, pineapple juice, fresh pineapple.', price: 8000, category: 'Cocktails', tags: '', spiceLevel: 0 },
  { name: 'Cosmopolitan', description: 'Vodka, cranberry juice, lemon juice.', price: 7500, category: 'Cocktails', tags: '', spiceLevel: 0 },
  { name: 'Strawberry Margarita', description: 'Salt, tequila, triple sec, lime juice, strawberry flavour.', price: 8000, category: 'Cocktails', tags: '', spiceLevel: 0 },
  { name: 'Baileys Russian', description: 'Baileys, vodka, liquid milk, Kahlúa liqueur.', price: 8000, category: 'Cocktails', tags: '', spiceLevel: 0 },
  { name: 'White Russian', description: 'Vodka, liquid milk, Kahlúa liqueur.', price: 7500, category: 'Cocktails', tags: '', spiceLevel: 0 },
  { name: 'Long Beach', description: 'Vodka, gin, rum, grenadine, lemon juice, orange juice.', price: 8000, category: 'Cocktails', tags: '', spiceLevel: 0 },
  { name: 'Tequila Sunrise', description: 'Tequila, grenadine, orange juice.', price: 8000, category: 'Cocktails', tags: '', spiceLevel: 0 },
  { name: 'Firefly Signature Cocktail', description: "The drink that gave us our glow — our bartender's signature pour. Ask what's mixing tonight.", price: 10000, category: 'Cocktails', tags: 'signature', spiceLevel: 0 },

  // ─── MOCKTAILS ───────────────────────────────────────────────
  { name: 'Chapman', description: 'Fanta, sprite, grenadine, orange juice, ribena, bitters.', price: 6000, category: 'Mocktails', tags: 'local,bestseller', spiceLevel: 0 },
  { name: 'Virgin Colada', description: 'Pineapple juice, coconut cream, coconut milk.', price: 6500, category: 'Mocktails', tags: 'vegetarian', spiceLevel: 0 },
  { name: 'Sunrise', description: 'Orange juice, grenadine and an orange slice.', price: 5000, category: 'Mocktails', tags: 'vegetarian', spiceLevel: 0 },
  { name: 'Pineapple Cobbler', description: 'Fresh pineapple, strawberry syrup, simple syrup, lime, pineapple juice.', price: 6000, category: 'Mocktails', tags: 'vegetarian', spiceLevel: 0 },

  // ─── SMOOTHIES ───────────────────────────────────────────────
  { name: 'Banana Boat', description: 'Banana, Peak milk, yoghurt, powdered milk, sugar.', price: 7000, category: 'Smoothies', tags: 'vegetarian', spiceLevel: 0 },
  { name: 'Tropical Sunset', description: 'Banana, pineapple, watermelon, orange juice, grenadine.', price: 5500, category: 'Smoothies', tags: 'vegetarian', spiceLevel: 0 },
  { name: 'Paradise Nectar', description: 'Banana, pineapple, watermelon, orange juice, grenadine, condensed milk, liquid milk.', price: 6500, category: 'Smoothies', tags: 'vegetarian', spiceLevel: 0 },

  // ─── MILK SHAKES ─────────────────────────────────────────────
  { name: 'Vanilla Milkshake', description: 'Vanilla ice cream, vanilla syrup, milk, whipped cream.', price: 6000, category: 'Milkshakes', tags: 'vegetarian', spiceLevel: 0 },
  { name: 'Strawberry Milkshake', description: 'Strawberry syrup, strawberry ice cream, milk.', price: 6000, category: 'Milkshakes', tags: 'vegetarian', spiceLevel: 0 },
  { name: 'Chocolate Milkshake', description: 'Chocolate syrup, chocolate ice cream, milk.', price: 6500, category: 'Milkshakes', tags: 'vegetarian', spiceLevel: 0 },

  // ─── MIXERS ──────────────────────────────────────────────────
  { name: 'Can Coke', description: '', price: 1500, category: 'Mixers', tags: '', spiceLevel: 0 },
  { name: 'Can Sprite', description: '', price: 1500, category: 'Mixers', tags: '', spiceLevel: 0 },
  { name: 'Can Heineken', description: '', price: 2000, category: 'Mixers', tags: '', spiceLevel: 0 },
  { name: 'Can Budweiser', description: '', price: 2000, category: 'Mixers', tags: '', spiceLevel: 0 },
  { name: 'Bottled Water', description: '', price: 1000, category: 'Mixers', tags: '', spiceLevel: 0 },
  { name: 'Can Star', description: '', price: 2000, category: 'Mixers', tags: '', spiceLevel: 0 },

  // ─── FRESH JUICE ─────────────────────────────────────────────
  { name: 'Watermelon Juice', description: 'Pressed fresh, served chilled.', price: 9000, category: 'Fresh Juice', tags: 'vegetarian', spiceLevel: 0 },
  { name: 'Pineapple Juice', description: 'Pressed fresh, served chilled.', price: 10000, category: 'Fresh Juice', tags: 'vegetarian', spiceLevel: 0 },

  // ─── SHOTS ───────────────────────────────────────────────────
  { name: 'Whiskey Shot', description: '', price: 3500, category: 'Shots', tags: '', spiceLevel: 0 },
  { name: 'Jameson Black Shot', description: '', price: 5000, category: 'Shots', tags: '', spiceLevel: 0 },
  { name: 'Tequila Shot', description: '', price: 3000, category: 'Shots', tags: '', spiceLevel: 0 },
  { name: 'Vodka Shot', description: '', price: 2500, category: 'Shots', tags: '', spiceLevel: 0 },
  { name: 'Rum Shot', description: '', price: 3000, category: 'Shots', tags: '', spiceLevel: 0 },

  // ─── WHISKEYS ────────────────────────────────────────────────
  { name: 'Jameson Green', description: '', price: 45000, category: 'Whiskeys', tags: '', spiceLevel: 0 },
  { name: 'Jameson Stout Edition', description: '', price: 55000, category: 'Whiskeys', tags: '', spiceLevel: 0 },
  { name: 'Jameson Black Barrel', description: '', price: 70000, category: 'Whiskeys', tags: '', spiceLevel: 0 },
  { name: 'Monkey Shoulder', description: '', price: 85000, category: 'Whiskeys', tags: '', spiceLevel: 0 },
  { name: 'Glenmorangie 10 Years', description: '', price: 100000, category: 'Whiskeys', tags: '', spiceLevel: 0 },
  { name: 'Glenmorangie 12 Years', description: '', price: 110000, category: 'Whiskeys', tags: '', spiceLevel: 0 },
  { name: 'Glenmorangie 18 Years', description: '', price: 230000, category: 'Whiskeys', tags: '', spiceLevel: 0 },
  { name: 'Glenfiddich 12 Years', description: '', price: 120000, category: 'Whiskeys', tags: '', spiceLevel: 0 },
  { name: 'Glenfiddich 15 Years', description: '', price: 150000, category: 'Whiskeys', tags: '', spiceLevel: 0 },
  { name: 'Glenfiddich 18 Years', description: '', price: 230000, category: 'Whiskeys', tags: '', spiceLevel: 0 },
  { name: 'Glenfiddich 21 Years', description: '', price: 600000, category: 'Whiskeys', tags: 'premium', spiceLevel: 0 },
  { name: 'Green Label', description: '', price: 200000, category: 'Whiskeys', tags: '', spiceLevel: 0 },
  { name: 'Famous Grouse', description: '', price: 30000, category: 'Whiskeys', tags: '', spiceLevel: 0 },

  // ─── CHAMPAGNE ───────────────────────────────────────────────
  { name: 'Martini Rosé', description: '', price: 30000, category: 'Champagne', tags: '', spiceLevel: 0 },
  { name: 'Belaire Black', description: '', price: 110000, category: 'Champagne', tags: '', spiceLevel: 0 },
  { name: 'Moët & Chandon Brut', description: '', price: 160000, category: 'Champagne', tags: '', spiceLevel: 0 },
  { name: 'Moët & Chandon Rosé', description: '', price: 200000, category: 'Champagne', tags: '', spiceLevel: 0 },
  { name: 'Veuve Clicquot', description: '', price: 180000, category: 'Champagne', tags: 'premium', spiceLevel: 0 },

  // ─── COGNAC ──────────────────────────────────────────────────
  { name: 'Black Mustang', description: '', price: 60000, category: 'Cognac', tags: '', spiceLevel: 0 },
  { name: 'Martell VS', description: '', price: 100000, category: 'Cognac', tags: '', spiceLevel: 0 },
  { name: 'Martell Blue Swift', description: '', price: 150000, category: 'Cognac', tags: '', spiceLevel: 0 },
  { name: 'Hennessy VS', description: '', price: 110000, category: 'Cognac', tags: '', spiceLevel: 0 },
  { name: 'Hennessy VSOP', description: '', price: 160000, category: 'Cognac', tags: '', spiceLevel: 0 },
  { name: 'Rémy Martin VSOP', description: '', price: 150000, category: 'Cognac', tags: '', spiceLevel: 0 },
  { name: 'Rémy Martin 1738', description: '', price: 160000, category: 'Cognac', tags: '', spiceLevel: 0 },

  // ─── TEQUILA ─────────────────────────────────────────────────
  { name: 'Olmeca Silver', description: '', price: 50000, category: 'Tequila', tags: '', spiceLevel: 0 },
  { name: 'Casamigos White', description: '', price: 250000, category: 'Tequila', tags: '', spiceLevel: 0 },
  { name: 'Casamigos Gold', description: '', price: 250000, category: 'Tequila', tags: '', spiceLevel: 0 },
  { name: 'Don Julio 1942', description: '', price: 500000, category: 'Tequila', tags: 'premium', spiceLevel: 0 },

  // ─── VODKA ───────────────────────────────────────────────────
  { name: 'Absolut Vodka', description: '', price: 50000, category: 'Vodka', tags: '', spiceLevel: 0 },

  // ─── WINES ───────────────────────────────────────────────────
  { name: 'Agor Sweet Red', description: '', price: 20000, category: 'Wines', tags: '', spiceLevel: 0 },
  { name: 'Copper and Thief', description: '', price: 80000, category: 'Wines', tags: '', spiceLevel: 0 },
  { name: 'Escudo Rojo', description: '', price: 40000, category: 'Wines', tags: '', spiceLevel: 0 },
  { name: 'Nederburg', description: '', price: 40000, category: 'Wines', tags: '', spiceLevel: 0 },
  { name: 'Silk and Spice', description: '', price: 30000, category: 'Wines', tags: '', spiceLevel: 0 },
  { name: 'Lamonthe Parrot', description: '', price: 20000, category: 'Wines', tags: '', spiceLevel: 0 },
  { name: 'Sweet Lips Red', description: '', price: 20000, category: 'Wines', tags: '', spiceLevel: 0 },
  { name: 'Sweet Lips Rosé', description: '', price: 20000, category: 'Wines', tags: '', spiceLevel: 0 },
  { name: 'Sweet Lips White', description: '', price: 20000, category: 'Wines', tags: '', spiceLevel: 0 },
  { name: 'Grand Hill', description: '', price: 20000, category: 'Wines', tags: '', spiceLevel: 0 },
  { name: 'Bamoc', description: '', price: 15000, category: 'Wines', tags: '', spiceLevel: 0 },
  { name: 'Millium Wine Red', description: '', price: 25000, category: 'Wines', tags: '', spiceLevel: 0 },
  { name: 'Millium Wine White', description: '', price: 25000, category: 'Wines', tags: '', spiceLevel: 0 },
];
