import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  // `formik` is an optional peer — externalize it so it's never bundled and
  // consumers who don't use the Formik* fields tree-shake it away entirely.
  external: ["react", "react-dom", "react/jsx-runtime", "formik"],
  treeshake: true,
  splitting: false,
  minify: false,
  // Every component here is a client component (hooks, Radix, context). The whole
  // bundle is marked "use client" via a post-build step (scripts/add-use-client.mjs
  // in the build script) so it can be imported directly from a Next.js Server
  // Component — otherwise React resolves to the react-server condition and fails
  // with "createContext is not a function" during SSR/SSG. A tsup `banner` does
  // not survive bundling (esbuild strips module-level directives), hence the
  // post-build prepend.
});
