import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Em dev o front fala com o servidor do mesmo slot (PORT) pelo proxy, então cookie e Origin
// ficam no mesmo host. WEB_PORT separa os slots da wave.
const servidor = `http://localhost:${process.env.PORT ?? 3000}`;

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.WEB_PORT ?? 5173),
    strictPort: true,
    proxy: { '/health': servidor, '/api': servidor },
  },
});
