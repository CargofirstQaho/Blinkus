import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function versionPlugin() {
  return {
    name: 'blinkus-version',
    apply: 'build',
    buildStart() {
      const version = new Date().toISOString();
      const outPath = path.resolve(__dirname, 'public/version.json');
      fs.writeFileSync(outPath, JSON.stringify({ version }, null, 2));
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), versionPlugin()],
    resolve: {
      dedupe: ['react', 'react-dom', 'react-router-dom'],
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      allowedHosts: [
      'wormlike-magdalen-deductively.ngrok-free.dev',
      'good-emus-wait.loca.lt'
    ]
    },
  };
});
