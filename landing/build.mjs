// Gera a página inicial a partir de App.jsx: HTML pré-renderizado + JS + CSS.
// Uso: cd landing && npm install && npm run build   (depois: cd .. && python3 build.py)
import { build } from "esbuild";
import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
mkdirSync("dist", { recursive: true });
const common = { bundle: true, jsx: "automatic", loader: { ".jsx": "jsx" }, define: { "process.env.NODE_ENV": '"production"' }, logLevel: "warning" };
await build({ ...common, entryPoints: ["client.jsx"], outfile: "../assets/landing.js", minify: true, format: "iife" });
await build({ ...common, entryPoints: ["server.jsx"], outfile: "dist/server.mjs", platform: "node", format: "esm", packages: "external" });
const { html } = await import("./dist/server.mjs?" + Date.now());
writeFileSync("body.html", html);
execSync("npx tailwindcss -i tw.css -o ../assets/landing.css --minify", { stdio: "inherit" });
console.log("landing ok:", html.length, "bytes de HTML");
