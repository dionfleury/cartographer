import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig( {
  plugins: [ react() ],
  base: "/cartographer",
  server: {
    https: {
      cert: process.env.CERT_FILE,
      key: process.env.CERTKEY_FILE
    }
  }
} )
