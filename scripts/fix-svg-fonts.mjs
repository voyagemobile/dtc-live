/**
 * fix-svg-fonts.mjs
 *
 * Post-processes Napkin-generated SVG diagrams to match dtc.live:
 * - Roboto regular -> Source Serif 4 (body)
 * - Roboto bold (>= 20px) -> Playfair Display
 * - Removes Napkin CDN font imports
 * - Updates Google Fonts import
 * - Remaps Napkin's loud palette to a subtle 2-3 tone editorial palette
 *
 * Usage: node scripts/fix-svg-fonts.mjs [filename.svg]
 *   - With no arg: processes every .svg in public/diagrams/
 *   - With arg: processes only that filename
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIAGRAMS_DIR = path.join(__dirname, "..", "public", "diagrams");

const FG = "#484848";
const FG_MUTED = "#969696";
const ACCENT = "#de8431";
const BG_SOFT = "#f5f1ea";

const COLOR_MAP = {
  "#886aff": ACCENT,
  "#bcabff": BG_SOFT,
  "#cd6afb": ACCENT,
  "#e4a9ff": BG_SOFT,
  "#f669be": ACCENT,
  "#ffa1da": BG_SOFT,
  "#fa963a": ACCENT,
  "#fd6a65": ACCENT,
  "#ffa6a3": BG_SOFT,
  "#ffc188": BG_SOFT,
  "#ffe714": ACCENT,
  "#fff282": BG_SOFT,
  "#f99539": ACCENT,
  "#ffbf84": BG_SOFT,
  "#e55753": ACCENT,
  "#e0cb15": ACCENT,
  "#ffe60a": ACCENT,
  "#ffef63": BG_SOFT,
  "#bcbcbc": FG_MUTED,
  "#1f1d1a": FG,
};

const arg = process.argv[2];
const files = arg
  ? [arg]
  : fs.readdirSync(DIAGRAMS_DIR).filter((f) => f.endsWith(".svg"));

let updated = 0;
for (const file of files) {
  const filePath = path.join(DIAGRAMS_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.log(`  Missing: ${file}`);
    continue;
  }
  const original = fs.readFileSync(filePath, "utf-8");
  let svg = original;

  svg = svg.replace(
    /<style class="text-font-style fontImports" data-font-family="Roboto">\s*@import url\([^)]+\);\s*<\/style>/,
    `<style class="text-font-style fontImports" data-font-family="Source Serif 4">\n@import url(https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&amp;family=Source+Serif+4:wght@400;700&amp;display=block);\n</style>`,
  );

  svg = svg.replace(
    /<style class="text-font-style">\s*(?:@import url\([^)]+\);\s*)+<\/style>/,
    "",
  );

  svg = svg.replace(
    /font-family:'Roboto', napkin-fallback, sans-serif/g,
    "font-family:'Source Serif 4', serif",
  );

  svg = svg.replace(
    /style="font-size:(\d+\.?\d*)px; font-family:'Source Serif 4', serif; font-weight:bold/g,
    (match, size) => {
      if (parseFloat(size) >= 20) {
        return match.replace(
          "font-family:'Source Serif 4', serif",
          "font-family:'Playfair Display', serif",
        );
      }
      return match;
    },
  );

  for (const [from, to] of Object.entries(COLOR_MAP)) {
    svg = svg.replaceAll(`fill="${from}"`, `fill="${to}"`);
    svg = svg.replaceAll(`stroke="${from}"`, `stroke="${to}"`);
    svg = svg.replaceAll(`stop-color="${from}"`, `stop-color="${to}"`);
    svg = svg.replaceAll(`fill:${from}`, `fill:${to}`);
    svg = svg.replaceAll(`stroke:${from}`, `stroke:${to}`);
    svg = svg.replaceAll(`stop-color:${from}`, `stop-color:${to}`);
  }

  if (svg !== original) {
    fs.writeFileSync(filePath, svg, "utf-8");
    updated++;
    console.log(`  Updated: ${file}`);
  } else {
    console.log(`  Skipped: ${file}`);
  }
}
console.log(`\nDone. Updated ${updated}/${files.length} SVG files.`);
