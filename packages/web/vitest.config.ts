import { defineConfig } from 'vitest/config'
// import react from '@vitejs/plugin-react'
// import tsconfigPaths from 'vite-tsconfig-paths'
 
export default defineConfig({
  // plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'node',
    testTimeout: 5 * 60 * 1000,
    include: ['./tests/*.test.ts']
  }
})