import os
from pathlib import Path

folder = Path(r'c:/Users/USER/Desktop/Bellamay-Cream/img/Select')
files = sorted([f for f in os.listdir(folder) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
tracks = ['music/track1.mp3', 'music/track3.mp3', 'music/track5.mp3', 'music/track7.mp3', 'music/track9.mp3']
lines = ['const images = [']
for i, name in enumerate(files, 1):
    track = tracks[(i - 1) % len(tracks)]
    lines.append(f"  {{ name: '{name}', path: 'img/Select/{name}', number: {i}, music: '{track}' }},")
lines.append('];')
out_path = Path(r'c:/Users/USER/Desktop/Bellamay-Cream/images.js')
out_path.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print(f'wrote {len(files)} entries to {out_path}')
