import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vitest/config'

const repositoryBase = '/password-generator/'

function redirectRootToBase(): Plugin {
  return {
    name: 'redirect-root-to-base',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/' || req.url === '') {
          res.writeHead(302, { Location: repositoryBase })
          res.end()
          return
        }
        next()
      })
    },
  }
}

export default defineConfig({
  base: repositoryBase,
  plugins: [react(), tailwindcss(), redirectRootToBase()],
  server: {
    port: 5173,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
