import { cp, readdir } from 'node:fs/promises';
for (const item of await readdir('dist')) await cp(`dist/${item}`, item, { recursive: true });
