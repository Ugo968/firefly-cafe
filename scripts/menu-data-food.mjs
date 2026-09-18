// Firefly Café — ORIGINAL MENU (as provided by the café)
// The Kitchen: Breakfast → Grill Corner + Desserts
// Spelling of real brand names standardised for the website (e.g. Glenfiddich, Veuve Clicquot).

export const FOOD = [
  // ─── BREAKFAST ───────────────────────────────────────────────
  { name: 'English Breakfast', description: 'Sausage, poached eggs, toast bread and baked beans — with a cup of tea or a glass of fresh juice.', price: 13000, category: 'Breakfast', tags: '', spiceLevel: 0 },
  { name: 'American Breakfast', description: 'Omelette, waffles, baked beans, sausage, bacon and grilled tomatoes — with a cup of tea or a glass of fresh juice.', price: 13000, category: 'Breakfast', tags: '', spiceLevel: 0 },
  { name: 'Firefly Special Breakfast', description: 'Pancakes, omelette, baked beans and grilled tomatoes — with a cup of tea or a glass of juice.', price: 12000, category: 'Breakfast', tags: 'signature', spiceLevel: 0 },
  { name: "Mama's Morning Special", description: "Our homestyle morning favourite — ask your server what Mama is serving today.", price: 10000, category: 'Breakfast', tags: 'local', spiceLevel: 0 },
  { name: 'Street Morning Combo', description: 'A quick, filling street-style breakfast combo for mornings on the move.', price: 9000, category: 'Breakfast', tags: 'local', spiceLevel: 0 },

  // ─── DESSERTS ────────────────────────────────────────────────
  { name: 'Parfait', description: 'Layers of cream, fruit and crunch, chilled and served in a glass.', price: 10000, category: 'Desserts', tags: 'vegetarian', spiceLevel: 0 },
  { name: 'Cake Slice', description: "A slice of the day's bake — ask your server for today's flavour.", price: 5000, category: 'Desserts', tags: 'vegetarian', spiceLevel: 0 },

  // ─── APPETIZERS ──────────────────────────────────────────────
  { name: 'Spring Rolls', description: 'Crisp golden rolls with a sweet chilli dip.', price: 6000, category: 'Appetizers', tags: 'vegetarian', spiceLevel: 0 },
  { name: 'Samosa', description: 'Golden pastry pockets with a warmly spiced filling.', price: 7500, category: 'Appetizers', tags: '', spiceLevel: 0 },
  { name: 'Crispy Crabs', description: 'Whole crab, crisp-fried and seasoned.', price: 12000, category: 'Appetizers', tags: 'seafood', spiceLevel: 0 },
  { name: 'BBQ Chicken Wings', description: 'Sticky wings glazed in our smoky barbecue sauce.', price: 12000, category: 'Appetizers', tags: '', spiceLevel: 1 },
  { name: 'Buffalo Wings', description: 'Classic hot wings with a cool dip on the side.', price: 13000, category: 'Appetizers', tags: 'spicy', spiceLevel: 2 },
  { name: 'Calamari Rings', description: 'Tender squid rings in a light golden crumb.', price: 13000, category: 'Appetizers', tags: 'seafood', spiceLevel: 0 },
  { name: 'Shrimp Tempura', description: 'Plump prawns in the lightest tempura batter.', price: 20000, category: 'Appetizers', tags: 'seafood,chef', spiceLevel: 0 },

  // ─── PEPPERED CORNER ─────────────────────────────────────────
  { name: 'Peppered Wings', description: 'Wings tossed in scotch bonnet and pepper spice.', price: 11000, category: 'Peppered Corner', tags: 'spicy', spiceLevel: 2 },
  { name: 'Peppered Snail', description: 'Tender snails seared with pepper, garlic and onions.', price: 15000, category: 'Peppered Corner', tags: 'local,spicy', spiceLevel: 3 },
  { name: 'Peppered Goat Meat', description: 'Asun-style goat meat — smoky, fiery and irresistible.', price: 14000, category: 'Peppered Corner', tags: 'local,spicy', spiceLevel: 3 },
  { name: 'Peppered Chicken', description: 'Chicken tossed in our signature pepper glaze.', price: 11000, category: 'Peppered Corner', tags: 'spicy', spiceLevel: 2 },
  { name: 'Peppered Gizzard', description: 'Golden gizzard with peppers and onions.', price: 12000, category: 'Peppered Corner', tags: 'spicy', spiceLevel: 2 },
  { name: 'Peppered Turkey', description: 'Turkey wings in rich pepper spice.', price: 10000, category: 'Peppered Corner', tags: 'spicy', spiceLevel: 2 },
  { name: 'Small Peppered Turkey', description: 'The same fire, in a smaller portion.', price: 7000, category: 'Peppered Corner', tags: 'spicy', spiceLevel: 2 },

  // ─── SOUPS (all served with bread roll) ──────────────────────
  { name: 'Creamy Sweet Potato Soup', description: 'Velvet-smooth sweet potato in a warm creamy broth.', price: 13000, category: 'Soups', tags: 'vegetarian', spiceLevel: 0 },
  { name: 'Continental Spring Soup', description: 'A light garden soup in the continental style.', price: 12000, category: 'Soups', tags: '', spiceLevel: 0 },
  { name: 'Chicken Pepper Soup', description: 'The Nigerian classic, sharpened with pepper spice.', price: 10000, category: 'Soups', tags: 'spicy', spiceLevel: 2 },
  { name: 'Goat Meat Pepper Soup', description: 'Tender goat meat in a fiery, aromatic broth.', price: 15000, category: 'Soups', tags: 'local,spicy', spiceLevel: 3 },

  // ─── SALAD ───────────────────────────────────────────────────
  { name: 'Chicken Caesar Salad', description: 'Grilled chicken over crisp lettuce with parmesan and croutons.', price: 14000, category: 'Salads', tags: '', spiceLevel: 0 },
  { name: 'Shrimp Avocado Salad', description: 'Chilled shrimp and avocado on garden greens.', price: 19000, category: 'Salads', tags: 'seafood,chef', spiceLevel: 0 },
  { name: 'Russian Salad', description: 'The creamy continental classic, served chilled.', price: 12000, category: 'Salads', tags: 'vegetarian', spiceLevel: 0 },

  // ─── ITALIAN PASTA ───────────────────────────────────────────
  { name: 'Pasta de Mare', description: "Seafood — the day's catch tossed through pasta.", price: 20000, category: 'Italian Pasta', tags: 'seafood,chef', spiceLevel: 0 },
  { name: 'Spaghetti al Bolognese', description: 'Slow-simmered meat sauce over spaghetti.', price: 15000, category: 'Italian Pasta', tags: '', spiceLevel: 0 },
  { name: 'Polo Alfredo', description: 'Chicken folded through a silky Alfredo cream sauce.', price: 17000, category: 'Italian Pasta', tags: '', spiceLevel: 0 },
  { name: 'Penne Arrabbiata', description: 'Penne in a fiery tomato and garlic sauce.', price: 13000, category: 'Italian Pasta', tags: 'vegetarian,spicy', spiceLevel: 2 },

  // ─── MAIN COURSE (all served with choice of sides) ───────────
  { name: 'Norwegian Salmon Fillet', description: 'Pan-seared salmon, finished in the continental style.', price: 42000, category: 'Main Course', tags: 'seafood', spiceLevel: 0 },
  { name: 'Rib Eye Steak', description: 'Charred outside, blushing within.', price: 45000, category: 'Main Course', tags: 'chef', spiceLevel: 0 },
  { name: 'T-Bone Steak', description: 'Two cuts in one — sirloin and tenderloin.', price: 40000, category: 'Main Course', tags: '', spiceLevel: 0 },
  { name: 'Lamb Chops', description: 'Flame-grilled chops with rosemary and garlic.', price: 42000, category: 'Main Course', tags: 'chef', spiceLevel: 0 },
  { name: 'BBQ Prawns', description: 'Jumbo prawns glazed on the grill.', price: 25000, category: 'Main Course', tags: 'seafood', spiceLevel: 0 },
  { name: 'Amigo Fajitas', description: 'Sizzling strips with peppers and onions, served hot.', price: 20000, category: 'Main Course', tags: '', spiceLevel: 1 },
  { name: 'Chicken Escalope', description: 'Crumbed chicken breast — golden and light.', price: 20000, category: 'Main Course', tags: '', spiceLevel: 0 },
  { name: 'Tomahawk Steak', description: 'The showstopper — a long-bone ribeye, grilled to order.', price: 150000, category: 'Main Course', tags: 'premium,signature', spiceLevel: 0 },

  // ─── SIDE DISHES ─────────────────────────────────────────────
  { name: 'Coconut Rice', description: 'Rice simmered in coconut milk.', price: 5500, category: 'Side Dishes', tags: 'local', spiceLevel: 0 },
  { name: 'Jollof Rice', description: 'Party jollof — smoky, rich and proud of it.', price: 3500, category: 'Side Dishes', tags: 'local,bestseller', spiceLevel: 1 },
  { name: 'Fried Rice', description: 'Classic Nigerian fried rice.', price: 4000, category: 'Side Dishes', tags: '', spiceLevel: 0 },
  { name: 'Mashed Potatoes', description: 'Creamy and buttery.', price: 5000, category: 'Side Dishes', tags: 'vegetarian', spiceLevel: 0 },
  { name: 'French Fries', description: 'Golden and crisp.', price: 4000, category: 'Side Dishes', tags: 'vegetarian', spiceLevel: 0 },
  { name: 'Fried Yam', description: 'Golden yam chips.', price: 3500, category: 'Side Dishes', tags: 'vegetarian,local', spiceLevel: 0 },
  { name: 'Fried Plantain', description: 'Dodo, done right.', price: 3500, category: 'Side Dishes', tags: 'vegetarian,local', spiceLevel: 0 },
  { name: 'White Rice', description: 'Steamed and fluffy.', price: 3000, category: 'Side Dishes', tags: 'vegetarian', spiceLevel: 0 },

  // ─── SPECIAL SIDE DISHES ─────────────────────────────────────
  { name: 'Chinese Fried Rice', description: 'Wok-fried with vegetables and egg.', price: 10000, category: 'Special Side Dishes', tags: 'vegetarian', spiceLevel: 0 },
  { name: 'Special Caribbean Rice', description: 'Island-style rice with a tropical edge.', price: 9000, category: 'Special Side Dishes', tags: '', spiceLevel: 0 },
  { name: 'Seafood Rice', description: "Rice loaded with the day's catch.", price: 20000, category: 'Special Side Dishes', tags: 'seafood,chef', spiceLevel: 0 },
  { name: "Riz d'Ananas", description: 'Pineapple rice — sweet, fragrant and golden.', price: 25000, category: 'Special Side Dishes', tags: '', spiceLevel: 0 },
  { name: 'Special Asun Rice', description: 'Smoky peppered goat meat through rice.', price: 18000, category: 'Special Side Dishes', tags: 'local,spicy', spiceLevel: 3 },

  // ─── PIZZAS ──────────────────────────────────────────────────
  { name: 'Pizza di Mare', description: 'Seafood pizza on our house base.', price: 18000, category: 'Pizzas', tags: 'seafood', spiceLevel: 0 },
  { name: 'Margherita Pizza', description: 'Tomato, mozzarella and basil — the classic, done right.', price: 13000, category: 'Pizzas', tags: 'vegetarian', spiceLevel: 0 },
  { name: 'Pepperoni Pizza', description: 'Loaded with pepperoni and cheese.', price: 15000, category: 'Pizzas', tags: '', spiceLevel: 0 },
  { name: 'Al Polo Pizza', description: 'Chicken pizza on our house base.', price: 15000, category: 'Pizzas', tags: '', spiceLevel: 0 },

  // ─── BURGER AND WRAPS ────────────────────────────────────────
  { name: 'Firefly Signature Burger', description: 'Our signature stack — the burger that glows.', price: 17000, category: 'Burgers & Wraps', tags: 'signature', spiceLevel: 0 },
  { name: 'Crispo Chicken Burger', description: 'Crisp chicken fillet with house sauce.', price: 13500, category: 'Burgers & Wraps', tags: '', spiceLevel: 0 },
  { name: 'Tacos', description: 'Folded tortillas, loaded and grilled.', price: 14000, category: 'Burgers & Wraps', tags: '', spiceLevel: 1 },
  { name: 'Chicken Shawarma', description: 'Double-wrapped with garlic sauce and crunch.', price: 7000, category: 'Burgers & Wraps', tags: 'bestseller', spiceLevel: 0 },
  { name: 'Beef Shawarma', description: 'Seasoned beef, wrapped and toasted.', price: 6500, category: 'Burgers & Wraps', tags: '', spiceLevel: 0 },

  // ─── SIGNATURE PLATTERS ──────────────────────────────────────
  { name: 'Chicken Platter', description: 'Buffalo wings, peppered gizzard, peppered chicken, sausage, French fries, grilled veggies, jollof rice, yam, plantain and coleslaw.', price: 55000, category: 'Signature Platters', tags: 'signature,sharing', spiceLevel: 1 },
  { name: 'Seafood Platter', description: 'Prawns, peppered snail, crab, calamari, French fries, croaker fish, jollof rice, plantain and samosa.', price: 110000, category: 'Signature Platters', tags: 'signature,sharing,seafood,chef', spiceLevel: 1 },

  // ─── GRILL CORNER (all served with fries & coleslaw) ─────────
  { name: 'Croaker Fish', description: 'Whole grilled croaker with house pepper sauce.', price: 26000, category: 'Grill Corner', tags: 'seafood', spiceLevel: 1 },
  { name: 'Whole Grilled Chicken', description: 'A whole bird, charred outside and juicy within.', price: 23000, category: 'Grill Corner', tags: 'sharing', spiceLevel: 1 },
  { name: 'Half Grilled Chicken', description: 'Half the bird, all of the flavour.', price: 13000, category: 'Grill Corner', tags: 'bestseller', spiceLevel: 1 },
  { name: 'Prawn Shish Kebab', description: 'Jumbo prawns on the skewer, straight off the flame.', price: 23000, category: 'Grill Corner', tags: 'seafood', spiceLevel: 1 },
  { name: 'Chicken Shish Kebab', description: 'Skewered chicken, grilled over charcoal.', price: 18000, category: 'Grill Corner', tags: '', spiceLevel: 1 },
  { name: 'Pork Shish Kebab', description: 'Marinated pork on the skewer.', price: 19000, category: 'Grill Corner', tags: '', spiceLevel: 1 },
  { name: 'Suya Bite', description: 'Beef in yaji spice, charred over open flame.', price: 10000, category: 'Grill Corner', tags: 'local,spicy', spiceLevel: 3 },
];
