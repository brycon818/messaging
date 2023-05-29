import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import reactRefresh from '@vitejs/plugin-react-refresh'

const root =resolve(__dirname, '.')
const outDir = resolve(__dirname,'dist')

// https://vitejs.dev/config/
export default defineConfig({
  root,
  plugins: [reactRefresh()],
  build: {
    rollupOptions: {  
      outDir,
      emptyOutDir: true,
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'src/pages/Login.tsx'),
        logout: resolve(__dirname, 'src/pages/LogoutPage.tsx'),
      },
    },
  },
  plugins: [react()],
})
