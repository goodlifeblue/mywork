// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // 固定使用 4321 埠；若被占用會直接報錯（不會偷偷跳到 4322 造成混淆）
  server: {
    port: 4321,
    host: false,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      strictPort: true,
    },
  },
});
