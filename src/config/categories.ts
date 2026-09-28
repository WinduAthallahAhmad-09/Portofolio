export const categories = [
  { slug: 'interactive', label: 'Interactive' },
  { slug: 'webgl', label: 'WebGL' },
  { slug: 'game', label: 'Game' },
  { slug: 'mobile', label: 'Mobile' },
  { slug: 'vr', label: 'VR' },
  { slug: 'campaign', label: 'Campaign' }
] as const;

export type CategorySlug = typeof categories[number]['slug'];
