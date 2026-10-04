// Generates SILENT placeholder audio so the example lints, previews and renders before real
// music/SFX exist. Replace the files with your real assets (keep the names, or update index.html).
// Run: node assets/make-placeholders.mjs
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
function silentWav(seconds, rate = 8000) {
  const n = seconds * rate, data = n * 2, buf = Buffer.alloc(44 + data);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + data, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(rate, 24); buf.writeUInt32LE(rate * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(data, 40);
  return buf;
}
writeFileSync(join(here, "music.wav"), silentWav(15));
writeFileSync(join(here, "whoosh.wav"), silentWav(1));
console.log("wrote assets/music.wav (15 s, silent) and assets/whoosh.wav (1 s, silent)");
