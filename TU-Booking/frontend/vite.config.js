import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // บอก Vite ว่า: ถ้ามีใครเรียก API ที่ขึ้นต้นด้วย '/api' ให้โยนไปหาพอร์ต 4000 นะ
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      }
    }
  }
})