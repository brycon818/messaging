import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import reactRefresh from '@vitejs/plugin-react-refresh'



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], 
  
})
