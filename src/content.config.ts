import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const works = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/works" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.date(),
    categories: z.array(
      z.enum(['interactive', 'webgl', 'game', 'mobile', 'vr', 'campaign'])
    ).min(1),
    summary: z.string().max(160),
    cover: image(),
    coverAlt: z.string(),
    video: z.object({
      mp4: z.string(),
      webm: z.string(),
      poster: z.string(),
    }).optional(),
    client: z.string().optional(),
    role: z.string().optional(),
    tech: z.array(z.string()).optional(),
    link: z.string().url().optional(),
    gallery: z.array(
      z.object({
        image: image(),
        alt: z.string()
      })
    ).optional(),
    featured: z.boolean().default(false),
    accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#7a5cff'),
  })
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    summary: z.string(),
    cover: image().optional()
  })
});

export const collections = { works, news };
