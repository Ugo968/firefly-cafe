#!/usr/bin/env python3
"""Firefly Café — process uploaded gallery photos.
243px-wide chat thumbnails -> 3x Lanczos upscale + unsharp mask,
saved as optimized JPEGs in public/firefly/. Prints {name: (w,h)} JSON
for transcription into firefly-data.ts.
"""
import json
import os
from PIL import Image, ImageFilter

UPLOAD = './upload'
OUT = './public/firefly'
os.makedirs(OUT, exist_ok=True)

# canonical upload file -> descriptive site filename
MAP = {
    'pasted_image_1789372497975.png': 'real-room-main-hall.jpg',
    'pasted_image_1789372836591.png': 'real-room-entrance-blooms.jpg',
    'pasted_image_1789372668066.png': 'real-room-swing-daybeds.jpg',
    'pasted_image_1789372480468.png': 'real-kitchen-seafood-tower.jpg',
    'pasted_image_1789372640638.png': 'real-kitchen-riz-danana.jpg',
    'pasted_image_1789372678098.png': 'real-kitchen-grilled-prawns.jpg',
    'pasted_image_1789372888061.png': 'real-kitchen-rice-and-chicken.jpg',
    'pasted_image_1789372612059.png': 'real-kitchen-tacos.jpg',
    'pasted_image_1789372531881.png': 'real-bar-pinacolada.jpg',
    'pasted_image_1789372565923.png': 'real-bar-milkshake.jpg',
    'pasted_image_1789372546503.png': 'real-bar-asun-jameson.jpg',
    'pasted_image_1789372585510.png': 'real-moments-night-entrance.jpg',
    'pasted_image_1789372630705.png': 'real-moments-garden-evenings.jpg',
    'pasted_image_1789372816237.png': 'real-moments-dining-guest.jpg',
}

result = {}
for src, dst in MAP.items():
    im = Image.open(os.path.join(UPLOAD, src)).convert('RGB')
    w, h = im.size
    im = im.resize((w * 3, h * 3), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=2, percent=80, threshold=3))
    out_path = os.path.join(OUT, dst)
    im.save(out_path, 'JPEG', quality=88, optimize=True, progressive=True)
    cw, ch = im.size
    result[dst] = [cw, ch]
    print(f'{dst:42s} {cw}x{ch}  ar={cw/ch:.4f}  {os.path.getsize(out_path)//1024}KB')

print()
print(json.dumps(result, indent=1))
