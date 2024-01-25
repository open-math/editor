import fs from "fs";

fs.rmSync('public/preview', { recursive: true, force: true });
fs.cpSync('node_modules/preview/.output/public', 'public/preview', { recursive: true });