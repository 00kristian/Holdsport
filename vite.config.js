import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Set this to your GitHub repo name, e.g. '/holdet-vue/'
  // Leave as '/' if using a custom domain
  base: '/Holdsport/',
})
