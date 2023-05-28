import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'src/pages/Login.tsx'),
        nested: resolve(__dirname, 'src/pages/LogoutPage.tsx'),
      },
    },
  },
  plugins: [react()],
})
