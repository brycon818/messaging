import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

const root =resolve(__dirname, 'index.html')

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'src/pages/Login.tsx'),
        logout: resolve(__dirname, 'src/pages/LogoutPage.tsx'),
      },
    },
  },
  plugins: [react()],
})
