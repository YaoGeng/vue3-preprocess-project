import { defineConfig } from 'vite'
import path from "path"
import vue from '@vitejs/plugin-vue'
import pluginPreprocess from "./plugins/preprocess-vue3/index"

const getMode = require(path.resolve(__dirname, "./build/getMode"))
let mode = getMode();
let getProjectConfig = require(path.resolve(__dirname, "./build/getConfig"));
let projectConfig = getProjectConfig(mode);
console.log("--mode=:" + mode + "\n↓↓↓");
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    pluginPreprocess({
      include: [
        '**/*.vue',
        '**/*.html'
      ],
      exclude: "mc-campus-config/**",
      context: {
        MAIN_CONFIG: projectConfig,
        DEBUG: true
      },
      options: {
        type: "js"
      }
    }),
  ]
})
