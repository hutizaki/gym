import { defineConfig } from 'vite';

export default defineConfig({
  // Prevent vite from clearing the screen during dev
  clearScreen: false,
  
  // Configure the dev server for Tauri
  server: {
    port: 1420,
    strictPort: true,
    host: 'localhost',
    hmr: {
      port: 1421,
    },
    watch: {
      // Tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  
  // Configure environment variables prefix
  envPrefix: ['VITE_', 'TAURI_'],
  
  // Configure build options for Tauri
  build: {
    // Use index.html as entry point (standard)
    rollupOptions: {
      input: 'index.html'
    },
    // Tauri supports es2021
    target: process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
    // Don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    // Produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
});
