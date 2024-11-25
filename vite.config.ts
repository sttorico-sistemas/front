import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'

// https://vitejs.dev/config/
export default defineConfig({
// for dev
  server: {
    port: 8080,
    host: '0.0.0.0',
  },
	css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [
    vue(),
		tsconfigPaths()
  ],
  resolve: {
    alias: [
			{ find: "@", replacement: path.resolve(__dirname, "./src") }
		]
  }
})
