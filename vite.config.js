import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: `import { h, Fragment } from 'fre'`,
    target: 'es2020',
    format: 'esm'
  },
  server: {
    host: "127.0.0.1",
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    }
  },
})
