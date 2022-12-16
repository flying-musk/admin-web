import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    plugins: [
      vue(),
      visualizer(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: '@import "./src/assets/style/global-variables.scss";',
          additionalData: `@use "./src/assets/style/global-variables.scss" as *;`,
        },
      },
    },
    proxy: {
      '/api': {
        target: process.env.VITE_APP_WEB_URL,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
    base: process.env.VITE_OUTPUT_URL,
    build: {
      outDir: `pub_html${process.env.VITE_OUTPUT_URL}`,
      minify: 'terser',
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: true,
        },
      },
      brotliSize: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'element-plus': ['element-plus'],
          },
        },
      },
    },
  })
}
