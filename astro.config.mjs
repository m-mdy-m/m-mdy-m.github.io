import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://m-mdy-m.github.io',
  base: '/',
  integrations: [tailwind()],
});
