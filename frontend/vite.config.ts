import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/common/components'),
      '@elements': path.resolve(__dirname, './src/common/elements'),
      '@layouts': path.resolve(__dirname, './src/common/layouts'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@dummy-data': path.resolve(__dirname, './src/dummy-data'),
      '@interfaces': path.resolve(__dirname, './src/interfaces'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@state': path.resolve(__dirname, './src/state'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
});
