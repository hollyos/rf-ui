// Dev SSR server (pnpm dev).
// Boots Vite in middleware mode so HMR works, then renders the React tree
// per-request via the SSR entry. For production builds, see prerender.ts
// (build-time SSG) and serve.ts (static file server).
import express, { type NextFunction, type Request, type Response } from 'express';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import type { RenderResult } from './src/entry-server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer(): Promise<void> {
  const app = express();

  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  app.use(vite.middlewares);

  app.use('*', async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;
    try {
      let template = await fs.readFile(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      const mod = (await vite.ssrLoadModule('/src/entry-server.tsx')) as {
        render: () => RenderResult;
      };
      const { html: appHtml } = mod.render();
      const html = template.replace('<!--app-html-->', appHtml);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  const port = Number(process.env.PORT) || 5173;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Dev SSR server running at http://localhost:${port}`);
  });
}

void createServer();
