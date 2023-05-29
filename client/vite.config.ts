import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import reactRefresh from '@vitejs/plugin-react-refresh'

const root =resolve(__dirname, 'src')
const outDir = resolve(__dirname,'dist')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(),react()], 
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'src/pages/Loginindex.html'),
      },
    },
  },
})
