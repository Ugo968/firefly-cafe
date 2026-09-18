import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUT = './download/firefly-assets'; // relative to project root

// Shared style vocabulary — Firefly's dusk-lit register from the proposal
const STYLE =
  'moody editorial food photography, dark espresso-brown background (#1C1410), warm amber and golden rim lighting, deep shadows, luxurious intimate fine-dining atmosphere, shallow depth of field, cinematic, high quality, photorealistic, no people, no text, no watermark';

const JOBS = [
  { file: 'hero-evening.png', size: '1408x704',
    prompt: `Elegant cafe lounge exterior at dusk in West Africa, warm golden light spilling from tall windows onto a dim street, subtle fireflies glowing in the evening air, deep blue-brown twilight sky, ${STYLE}` },
  { file: 'dish-suya.png', size: '1024x1024',
    prompt: `Nigerian suya beef skewers with charred edges on a dark slate plate, sliced red onion, yaji spice dust, wisps of smoke, ${STYLE}` },
  { file: 'dish-jollof.png', size: '1024x1024',
    prompt: `Smoky Nigerian party jollof rice plated elegantly on dark ceramic, grilled plantain, fried plantain crescents, garnish of fresh herbs, ${STYLE}` },
  { file: 'dish-pasta.png', size: '1024x1024',
    prompt: `Creamy penne pasta with sun-dried tomato and parmesan twirled in a dark ceramic bowl, steam rising, warm candlelight from the side, ${STYLE}` },
  { file: 'dish-smallchops.png', size: '1024x1024',
    prompt: `Nigerian small chops platter, golden spring rolls, samosas, puff puff, peppered gizzard, on a dark wooden board with dipping sauces, ${STYLE}` },
  { file: 'drink-cocktail.png', size: '1024x1024',
    prompt: `Amber-hued hibiscus cocktail (zobo) in crystal glass with orange peel and ice, backlit by warm golden bar light, condensation droplets, dark bar counter, ${STYLE}` },
  { file: 'dish-coffee.png', size: '1024x1024',
    prompt: `Cappuccino with delicate rosetta latte art in a matte ceramic cup on dark walnut table, warm side window light, coffee beans scattered, steam, ${STYLE}` },
  { file: 'dish-dessert.png', size: '1024x1024',
    prompt: `Molten chocolate lava cake with gold leaf, vanilla ice cream quenelle, raspberry, dusted cocoa on dark plate, warm candle glow, ${STYLE}` },
  { file: 'dish-grill.png', size: '1024x1024',
    prompt: `Whole grilled spiced tilapia fish with charred skin on dark slate, grilled plantain and pepper sauce, smoke rising, warm amber light, ${STYLE}` },
  { file: 'dish-shawarma.png', size: '1024x1024',
    prompt: `Grilled chicken shawarma wrap cut in half showing juicy filling, on dark parchment with pickles and garlic sauce, warm golden light, ${STYLE}` },
  { file: 'drink-smoothie.png', size: '1024x1024',
    prompt: `Tropical mango smoothie in tall glass with mint, backlit warm glow through the fruit, dark background with bokeh lights, ${STYLE} ` },
  { file: 'celebration-table.png', size: '1344x768',
    prompt: `Luxurious private celebration table setup in a dark lounge, gold-rimmed glassware, candles in amber glass, champagne bucket, rose petals, fairy light bokeh, elegant birthday evening, ${STYLE}` },
  { file: 'bar-glow.png', size: '1344x768',
    prompt: `Modern cafe bar counter at night with warm LED strip lighting lines on textured plaster wall, espresso machine glow, backlit bottle shelf, dark luxurious lounge ambience, ${STYLE}` },
  { file: 'interior-warm.png', size: '1344x768',
    prompt: `Cozy luxury cafe lounge interior at night, cream tufted leather sofas, textured grey plaster walls with warm golden LED accent lines, dark floor, intimate pool of light over each table, ${STYLE}` },
];

async function main() {
  const zai = await ZAI.create();
  const filter = process.argv[2] || '';
  const results = [];
  for (const job of JOBS) {
    if (filter && !job.file.includes(filter)) continue;
    const outPath = path.join(OUT, job.file);
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 30000) {
      console.log(`SKIP (exists): ${job.file}`);
      results.push({ file: job.file, skipped: true });
      continue;
    }
    let ok = false, attempt = 0;
    while (!ok && attempt < 3) {
      attempt++;
      try {
        const resp = await zai.images.generations.create({ prompt: job.prompt, size: job.size });
        const b64 = resp?.data?.[0]?.base64;
        if (!b64) throw new Error('empty base64');
        fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
        console.log(`OK: ${job.file} (${Math.round(fs.statSync(outPath).size / 1024)} KB)`);
        ok = true;
        results.push({ file: job.file, ok: true });
      } catch (e) {
        console.error(`FAIL ${job.file} attempt ${attempt}: ${e.message}`);
        if (attempt >= 3) results.push({ file: job.file, ok: false, error: e.message });
        await new Promise(r => setTimeout(r, 2500));
      }
    }
  }
  fs.writeFileSync(path.join(OUT, '_gen-results.json'), JSON.stringify(results, null, 2));
  const failed = results.filter(r => r.ok === false);
  console.log(`\nDONE. ${results.length - failed.length}/${results.length} succeeded.`);
  if (failed.length) console.log('Failed:', failed.map(f => f.file).join(', '));
}

main().catch(e => { console.error('FATAL', e); process.exit(1); });
