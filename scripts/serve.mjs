import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve(import.meta.dirname, '../docs');
const args = process.argv.slice(2);
const option = args.indexOf('--port');
const port = Number(option >= 0 ? args[option + 1] : process.env.LOGIC_PREVIEW_PORT || 4173);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('유효한 --port 값을 지정하세요.');
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain', '.md': 'text/plain' };
const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return; }
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    const pathname = decodeURIComponent(url.pathname);
    let target = resolve(root, '.' + pathname);
    if (target !== root && !target.startsWith(root + sep)) { response.writeHead(403); response.end(); return; }
    const info = await stat(target);
    if (info.isDirectory()) {
      if (!url.pathname.endsWith('/')) { response.writeHead(301, { Location: url.pathname + '/' + url.search }); response.end(); return; }
      target = resolve(target, 'index.html');
    }
    const content = await readFile(target);
    response.writeHead(200, { 'Content-Type': `${mime[extname(target)] || 'application/octet-stream'}; charset=utf-8`, 'Content-Length': content.length, 'Cache-Control': 'no-cache' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : await readFile(resolve(root, '404.html')));
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Logic HTML preview: http://127.0.0.1:${port}/`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
