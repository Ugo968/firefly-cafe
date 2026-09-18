// One-time backfill: house price snapshot for every existing menu item.
// Rows created before the basePrice column existed carry 0 — set it to the
// current price so admins can always "restore house price".
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const n = await db.$executeRawUnsafe('UPDATE MenuItem SET basePrice = price WHERE basePrice = 0');
const remaining = await db.menuItem.count({ where: { basePrice: 0 } });
console.log(`Backfilled ${n} items; rows still missing basePrice: ${remaining}`);
