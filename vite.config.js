import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        installation: 'installation.html',
        features: 'features.html',
        sources: 'sources.html',
        faq: 'faq.html',
        changelog: 'changelog.html',
      }
    }
  }
})
