import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
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
