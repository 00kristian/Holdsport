import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Set this to your GitHub repo name, e.g. '/holdet-vue/'
  // Leave as '/' if using a custom domain
  base: '/Holdsport/',
  server: {
    // The repo lives on a Windows drive (/mnt/c) under WSL2, where native file
    // events don't cross the filesystem boundary — poll so HMR actually fires.
    watch: { usePolling: true, interval: 100 },
  },
})
