import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import fs from 'fs'

let server = {}

// Add HTTPS if available for localhost testing
if(fs.existsSync('localhost-key.pem') && fs.existsSync('localhost.pem')) {
  server = {
    open: true,
    https: {
      key: fs.readFileSync('localhost-key.pem'),
      cert: fs.readFileSync('localhost.pem'),
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  define: {
    'process.env': process.env
  },
  server
})
