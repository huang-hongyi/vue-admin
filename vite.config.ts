/// <reference types="vitest" />
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus';
import viteCompression from 'vite-plugin-compression';
import { buildConfig } from './src/utils/build';
import { visualizer } from 'rollup-plugin-visualizer'
const pathResolve = (dir: string) => {
	return resolve(__dirname, '.', dir);
};

const alias: Record<string, string> = {
	'/@': pathResolve('./src/'),
	'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
};

const dragonflyUtil = () => {
	const fs = require('fs');
	const path = require('path');
	const packageTime = { begin: 0, end: 0 };
	const writeFile = (analyseResult) => {
		const folderPath = path.join(__dirname, '@webpack')
		const filePath = path.join(folderPath, 'webpack.json')
		fs.writeFile(filePath, JSON.stringify(analyseResult), () => { })
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
			const analyseResult = { packageTime: packageTime } as any;
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

const viteConfig = defineConfig((mode: ConfigEnv) => {
	const env = loadEnv(mode.mode, process.cwd());
	return {
		plugins: [vue(), vueSetupExtend(), viteCompression(), JSON.parse(env.VITE_OPEN_CDN) ? buildConfig.cdn() : null,dragonflyUtil(), visualizer({
			emitFile: false,
			filename: '@webpack/static.html',
			open: false,
		})],
		root: process.cwd(),
		resolve: { alias },
		base: mode.command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
		optimizeDeps: { exclude: ['vue-demi'] },
		server: {
			host: '0.0.0.0',
			port: env.VITE_PORT as unknown as number,
			open: JSON.parse(env.VITE_OPEN),
			hmr: true,
			proxy: {
				'/gitee': {
					target: 'https://gitee.com',
					ws: true,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/gitee/, ''),
				},
				'/api': {
					target: 'http://localhost:3000',
					ws: true,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),

				}
			},
		},
		build: {
			outDir: 'dist',
			chunkSizeWarningLimit: 1500,
			rollupOptions: {
				output: {
					chunkFileNames: 'assets/js/[name]-[hash].js',
					entryFileNames: 'assets/js/[name]-[hash].js',
					assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
					manualChunks(id) {
						if (id.includes('node_modules')) {
							return id.toString().match(/\/node_modules\/(?!.pnpm)(?<moduleName>[^\/]*)\//) ?.groups!.moduleName ?? 'vender';
						}
					},
				},
				...(JSON.parse(env.VITE_OPEN_CDN) ? { external: buildConfig.external } : {}),
			},
		},
		css: { preprocessorOptions: { css: { charset: false } } },
		define: {
			__VUE_I18N_LEGACY_API__: JSON.stringify(false),
			__VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
			__INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
			__NEXT_VERSION__: JSON.stringify(process.env.npm_package_version),
			__NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
		},
		test: {
			environment: 'happy-dom',
			reporters: ['html'],
			outputFile: './@report/vitest/index.html',
			include: ['./src/components/**/*.{test,spec}.js'],
			open: false,
		}
	};
});

export default viteConfig;
