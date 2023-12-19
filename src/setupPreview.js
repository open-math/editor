import fs from "fs";

fs.cpSync('node_modules/preview/.output/public', 'public/preview', { recursive: true });