import fs from 'fs';
import path from 'path';

const worksDir = path.join(process.cwd(), 'src', 'content', 'works');
const newsDir = path.join(process.cwd(), 'src', 'content', 'news');

fs.mkdirSync(worksDir, { recursive: true });
fs.mkdirSync(newsDir, { recursive: true });

const accentColors = [
  '#7a5cff', '#ff5c5c', '#5cff7a', '#ffb75c', '#5cbbff', '#ff5cfb',
  '#e5ff5c', '#5cffd6', '#5c63ff', '#ff5c96', '#935cff', '#5cff8f'
];
const categories = ['interactive', 'webgl', 'game', 'mobile', 'vr', 'campaign'];

for (let i = 0; i < 12; i++) {
  const isFeatured = i < 6;
  const content = `---
title: "Project ${i + 1}"
date: 2024-0${(i % 9) + 1}-01
categories: ["${categories[i % categories.length]}"]
summary: "This is a brief summary for project ${i + 1}. We built an interactive world."
cover: "../../assets/placeholders/work-${i + 1}.svg"
coverAlt: "Cover image for Project ${i + 1}"
client: "Client ${i + 1}"
role: "Development & Design"
featured: ${isFeatured}
accentColor: "${accentColors[i]}"
---

# Project ${i + 1}
This is the detailed markdown content for Project ${i + 1}.
`;
  fs.writeFileSync(path.join(worksDir, `project-${i + 1}.md`), content);
}

for (let i = 0; i < 6; i++) {
  const content = `---
title: "Studio News ${i + 1}"
date: 2024-0${(i % 9) + 1}-15
tags: ["update", "culture"]
summary: "Summary for studio news article number ${i + 1}."
cover: "../../assets/placeholders/news-${i + 1}.svg"
---

# Studio News ${i + 1}
Here is the full story about this news update.
`;
  fs.writeFileSync(path.join(newsDir, `news-${i + 1}.md`), content);
}

console.log('Seed content generated!');
