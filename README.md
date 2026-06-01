# K12 Study Buddy

This repo now uses a GitHub Pages frontend plus a separate Cloudflare Worker chat backend instead of Base44.

## Frontend setup

1. Install dependencies:
   `npm.cmd install`
2. Start the frontend:
   `npm.cmd run dev`
3. Set your deployed backend URL in [config.js](C:\Users\Brittany\OneDrive\Documents\K12\config.js).

## Why this changed

GitHub Pages is static hosting. That means the browser app needs a separate backend endpoint for model calls. The frontend now calls a worker URL defined in `config.js`.

## Included backend example

This repo includes a Cloudflare Worker example in [worker/src/index.js](C:\Users\Brittany\OneDrive\Documents\K12\worker\src\index.js). It accepts the chat history from the frontend and sends it to Cloudflare Workers AI using an open model.

### Worker setup

1. Go to [worker/wrangler.toml](C:\Users\Brittany\OneDrive\Documents\K12\worker\wrangler.toml) and update `ALLOWED_ORIGIN` if needed.
2. From [worker](C:\Users\Brittany\OneDrive\Documents\K12\worker), install worker dependencies:
   `npm.cmd install`
3. Deploy the worker:
   `npx wrangler deploy`
4. Paste the deployed worker URL into [config.js](C:\Users\Brittany\OneDrive\Documents\K12\config.js) as `chatApiUrl`.

### Model choice

The default worker model is `@cf/meta/llama-3.1-8b-instruct-fast`, configured in [worker/wrangler.toml](C:\Users\Brittany\OneDrive\Documents\K12\worker\wrangler.toml). You can swap this to another Workers AI open model later if you want.

## GitHub Pages flow

- `app.html` is the Vite source entry for local development and builds.
- `index.html`, `404.html`, and `/assets` are the published static files used by GitHub Pages.
- After frontend changes, rebuild and republish the root Pages files.
