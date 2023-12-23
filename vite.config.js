import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import * as fs from 'fs';
import * as path from 'path';
const pathResolve = (dir) => {
  return resolve(__dirname, '.', dir);
};

const alias = {
  '/@': pathResolve('./src/'),
};

const dragonflyUtil = () => {
  const packageTime = { begin: 0, end: 0 };
  const writeFile = (analyseResult) => {
    const folderPath = path.join(__dirname, '@webpack')
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath)
    }
    const filePath = path.join(folderPath, 'stats.json')
    fs.writeFileSync(filePath, JSON.stringify(analyseResult));
  }
  return {
    name: 'dragonfly-util',
    enforce: 'pre||post',
    apply: 'build',
    buildStart() {
      packageTime.begin = Math.floor(Date.now() / 1000)
    },
    buildEnd() {
      packageTime.end = Math.floor(Date.now() / 1000);

    },
    writeBundle(_, bundle) {
      const analyseResult = { packageTime: packageTime };
      const filesType = ['js', 'css', 'html', 'img']
      filesType.forEach(item => {
        analyseResult[item] = {
          fileNumber: 0,
          totalSize: 0
        }
      });
      Object.keys(bundle).forEach(item => {
        if (item.endsWith('.js')) {
          analyseResult.js.fileNumber++;
          analyseResult.js.totalSize += (bundle[item]?.code?.length || bundle[item]?.source?.length)
        }
        if (item.endsWith('.css')) {
          analyseResult.css.fileNumber++;
          analyseResult.css.totalSize += (bundle[item]?.code?.length || bundle[item]?.source?.length)
        }
        if (item.endsWith('.html')) {
          analyseResult.html.fileNumber++;
          analyseResult.html.totalSize += Buffer.byteLength(bundle[item]?.source, 'utf-8');
        }

        if (item.endsWith('.png') || item.endsWith('svg')) {
          analyseResult.img.fileNumber++;
          analyseResult.img.totalSize += (bundle[item]?.code?.length || bundle[item]?.source?.length)

        }
        writeFile(analyseResult)
      })
    }
  }
}

const viteConfig = defineConfig((mode) => {
  return {
    plugins: [vue(), dragonflyUtil(), visualizer({
      emitFile: false,
      filename: '@webpack/index.html',
      open: false,
    })],
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
