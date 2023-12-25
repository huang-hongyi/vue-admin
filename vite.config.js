import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { ideConfigs } from './vite.config.ide'
const pathResolve = (dir) => {
  return resolve(__dirname, '.', dir);
};

const alias = {
  '/@': pathResolve('./src/'),
};

const viteConfig = defineConfig((mode) => {
  return {
    plugins: [vue(), ...ideConfigs],
    root: process.cwd(),
    resolve: { alias },
    base: './',
    server: {
      host: '0.0.0.0',
      port: 8888,
      open: true,
      hmr: true,
      proxy: {
        '/gitee': {
          target: 'https://gitee.com',
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/gitee/, ''),
        },
      },
    },
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 1500,
    },
    css: { preprocessorOptions: { css: { charset: false } } },
  };
});

export default viteConfig;
