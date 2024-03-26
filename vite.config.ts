import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    extensions: ['.tsx', '.ts', '.vue'],
  },
  build: {
    minify: false,
    lib: {
      entry: {
        shared: 'packages/shared/index.ts',
        core: 'packages/core/index.ts',
        plugin: 'packages/plugins/auxiliaryLine/index.tsx',
      },
      name: 'core-dnd'// window.core-dnd
    },
    rollupOptions: {
      external: 'vue',
      output: {
        // 强制 shared 包不打包出单独的 chunk
        manualChunks(id) {
          if (id.includes('/packages/shared/')) {
            return 'shared'
          }
        }
      }
    }
  }
})
