import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["app.ts"],
  format: ["esm"],
  noExternal: ["@cacta/db", "@cacta/email"],
  banner: {
    js: "const require = (await import('node:module')).createRequire(import.meta.url);const __filename = (await import('node:url')).fileURLToPath(import.meta.url);const __dirname = (await import('node:path')).dirname(__filename);",
  },
});
