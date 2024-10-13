// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        secure: false,
        changeOrigin: true, // إضافة هذا الخيار
        // إذا كنتِ تحتاجين إلى إعادة كتابة المسار:
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
  plugins: [react()],
});
