/// <reference types="vite/client" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      exclude: ["fs"], // Exclui o polyfill para `fs` e `node:fs`.
      globals: {
        Buffer: true, // pode também ser 'build', 'dev', ou false
        global: true,
        process: true
      },
      protocolImports: true
    })
  ],
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
    jsxInject: `import React from 'react'`
  },
  compilerOptions: {
    target: "esnext",
    module: "commonjs",
    types: ["vite/client"],
    jsx: "react-jsx"
  },
});

