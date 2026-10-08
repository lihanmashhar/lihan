import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/fullstack-task2/',
  plugins: [react()],
});
