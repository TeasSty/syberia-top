import { defineConfig } from 'vite';

export default defineConfig({
  base: '/syberia-top/',
  root: '.',
  publicDir: 'public',
  server: {
    port: 5173,
    open: false,
  },
});
