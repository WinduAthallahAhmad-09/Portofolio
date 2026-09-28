import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'src', 'assets', 'placeholders');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const accentColors = [
  '#7a5cff', '#ff5c5c', '#5cff7a', '#ffb75c', '#5cbbff', '#ff5cfb',
  '#e5ff5c', '#5cffd6', '#5c63ff', '#ff5c96', '#935cff', '#5cff8f'
];

// Generate work placeholders
for (let i = 0; i < 12; i++) {
  const color = accentColors[i];
  const svg = `<svg width="1600" height="1000" viewBox="0 0 1600 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="grad${i}" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="${color}" />
      <stop offset="100%" stop-color="#101013" />
    </radialGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#grad${i})" />
  <text x="800" y="500" font-family="sans-serif" font-size="48" font-weight="bold" fill="#ffffff" opacity="0.5" text-anchor="middle" dominant-baseline="middle">Project ${i + 1}</text>
</svg>`;
  
  fs.writeFileSync(path.join(outDir, `work-${i + 1}.svg`), svg);
}

// Generate news placeholders
for (let i = 0; i < 6; i++) {
  const color = '#333333';
  const svg = `<svg width="1600" height="1000" viewBox="0 0 1600 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="1600" height="1000" fill="${color}" />
  <text x="800" y="500" font-family="sans-serif" font-size="48" font-weight="bold" fill="#ffffff" opacity="0.5" text-anchor="middle" dominant-baseline="middle">News ${i + 1}</text>
</svg>`;
  
  fs.writeFileSync(path.join(outDir, `news-${i + 1}.svg`), svg);
}

console.log('Placeholders generated at src/assets/placeholders');
