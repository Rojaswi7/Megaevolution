import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Multi-page: home, blog listing, article
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        blog: 'blog/index.html',
        post: 'blog/post/index.html',
      },
    },
  },
})
