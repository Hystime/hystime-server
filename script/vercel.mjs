// use dist/main.js to overwrite /api/index.js
import * as fs from 'fs';

const src = fs.readFileSync('./dist/server.js', 'utf8');
fs.writeFileSync('./api/index.js', src);
console.info('server.js written to api/index.js');
