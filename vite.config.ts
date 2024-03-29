import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'


export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    extensions: ['.tsx', '.ts', '.vue'],
  },
  build: {
    minify: false,
    lib: {
      entry: {
        // core: 'packages/core/index.ts',
        // plugin: 'packages/plugins/auxiliaryLine/index.tsx',
        mouseFollow: 'packages/plugins/mouseFollow/index.tsx',
        // shared: 'packages/shared/index.ts'
      },
      name: 'core-dnd'// window.core-dnd
    },
    rollupOptions: {
      external: 'vue',
      output: {
        // 强制 shared 包不打包出单独的 chunk
        manualChunks(id) {
          return 'mouseFollow'
          // RollupError: Invalid value for option "output.manualChunks" - this option is not supported for "output.inlineDynamicImports".
          // if (id.includes('/packages/shared/')) {
          //   return 'shared'
          // }
        }
      }
    }
  }
})
