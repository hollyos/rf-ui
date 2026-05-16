// Build-time pre-render (SSG): renders the React tree once and inlines
// the HTML into the client-built index.html. The result in `dist/client/`
// is a fully static site that can be served from any static host (or
// opened directly, with the caveat that file:// blocks module hydration
// in Chrome).
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { RenderResult } from './src/entry-server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p: string): string => path.resolve(__dirname, p);

async function prerender(): Promise<void> {
  const templatePath = toAbsolute('dist/client/index.html');
  const serverEntryPath = toAbsolute('dist/server/entry-server.js');

  const template = await fs.readFile(templatePath, 'utf-8');
  // Use file:// URL so Node's ESM loader can resolve the built server
  // bundle regardless of platform.
  const mod = (await import(pathToFileURL(serverEntryPath).href)) as {
    render: () => RenderResult;
  };

  const { html: appHtml } = mod.render();
  let html = template.replace('<!--app-html-->', appHtml);

  // Strip the `crossorigin` attribute from the stylesheet <link>. Vite
  // emits `<link rel="stylesheet" crossorigin href="…">` by default, but
  // when the page is opened directly via file:// the browser refuses to
  // load resources marked `crossorigin` because file:// has no real CORS
  // origin — the result is a fully unstyled page. Stripping the attribute
  // makes no difference when serving over http(s) and unblocks the
  // static-file preview from disk.
  //
  // We deliberately leave `crossorigin` on the module <script> and
  // modulepreload links: ES modules don't load from file:// in Chromium
  // browsers regardless of CORS, so there's nothing to gain by removing
  // it there.
  html = html.replace(
    /(<link\s+rel="stylesheet"[^>]*?)\s+crossorigin(="[^"]*")?/g,
    '$1',
  );

  // Rewrite absolute /assets/ URLs to relative ./assets/. The client
  // build respects `base: './'` and emits relative URLs in the HTML and
  // CSS that Vite generates directly, but the SSR bundle bakes asset
  // URLs at server-build time using an absolute leading slash (the
  // server can't know the eventual request URL). React's renderToString
  // then puts those absolute URLs into <img src="…"> in the final HTML.
  // From file:// an absolute /assets/foo.svg resolves to the *filesystem
  // root*, so every image breaks. Rewriting them to ./assets/foo.svg
  // makes the page render correctly whether served from / or from a
  // local file URL.
  html = html.replace(/(src|href)="\/assets\//g, '$1="./assets/');

  await fs.writeFile(templatePath, html);
  // eslint-disable-next-line no-console
  console.log(`✓ Pre-rendered ${path.relative(__dirname, templatePath)}`);
}

prerender().catch((err: unknown) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
