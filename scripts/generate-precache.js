import { readdirSync, writeFileSync } from "node:fs";

const files = readdirSync("dist/assets");

const assets = files
  .filter((file) => /\.(js|css)$/.test(file))
  .map((file) => `assets/${file}`);

writeFileSync(
  "dist/precache-assets.json",
  JSON.stringify(assets),
);