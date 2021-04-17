import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  define: {
    'process.env': process.env
  },
  server: {
    open: true,
    https: {
      key: fs.readFileSync('localhost-key.pem'),
      cert: fs.readFileSync('localhost.pem'),
    },
  },
})
