import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  
  // Use VITE_BASE_PATH from environment, default to '/' for local dev
  const basePath = process.env.VITE_BASE_PATH || env.VITE_BASE_PATH || '/';
  
  console.log('Building with base path:', basePath);
  
  return {
    base: basePath,
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
