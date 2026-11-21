// Before each build: download the website text published from the dashboard, so the built page
// (which Google reads) has the latest wording. If it can't be fetched, the build keeps the last copy.
import fs from "node:fs";
const URL = "https://ocdfjuvesnkimqiexqyw.supabase.co/storage/v1/object/public/public-media/site-text.json";
const OUT = new globalThis.URL("../src/content.published.js", import.meta.url);
try {
  const res = await fetch(`${URL}?t=${Date.now()}`, { cache: "no-store", signal: AbortSignal.timeout(15000) });
  if (res.status === 404 || res.status === 400) { fs.writeFileSync(OUT, "// Written by scripts/fetch-content.mjs before each build (text published from the dashboard). Do not edit by hand.\nexport default {};\n"); console.log("site text: none published yet, using the built-in text"); }
  else if (!res.ok) throw new Error(`HTTP ${res.status}`);
  else {
    const j = await res.json();
    const content = j && typeof j === "object" && j.content && typeof j.content === "object" ? j.content : {};
    // JSON.stringify output is plain data: nothing in the file can run as code
    fs.writeFileSync(OUT, `// Written by scripts/fetch-content.mjs before each build (text published from the dashboard). Do not edit by hand.\n// Published ${String(j.updatedAt || "").slice(0, 40)}\nexport default ${JSON.stringify(content, null, 2)};\n`);
    console.log(`site text: published version from ${j.updatedAt || "unknown date"}`);
  }
} catch (e) { console.warn(`site text: couldn't fetch (${e.message}); keeping the last copy`); }
