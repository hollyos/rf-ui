// Lightweight production server: serves the pre-rendered, fully static
// output from `dist/client/`. Use `pnpm build` first, then `pnpm serve`.
import express from 'express';
import compression from 'compression';
import serveStatic from 'serve-static';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(compression());
app.use(serveStatic(path.resolve(__dirname, 'dist/client'), { index: ['index.html'] }));

const port = Number(process.env.PORT) || 5173;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Static server running at http://localhost:${port}`);
});
