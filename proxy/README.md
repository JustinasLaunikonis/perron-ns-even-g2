# Perron-NS - NS API proxy (Cloudflare Worker)

It forwards any path/query straight through, so all the app's endpoints work:
`/v3/trips`, `/v2/stations`, `/v2/departures`, `/v3/disruptions/station/...`.

## Deploy

```bash
npm i -g wrangler
wrangler login
cd proxy
wrangler secret put NS_API_KEY    # paste your NS Primary key when prompted
wrangler deploy
```

`wrangler deploy` prints your public URL, e.g.
`https://perron-ns-proxy.<your-account>.workers.dev`.

## Wire the app to it

1. In `src/ns.ts`, set `BASE` to your Worker URL.
2. In `app.json`, set the network `whitelist` to that same URL.
3. Confirm the key is gone: `npm run build` then search `dist/` for
   `Ocp-Apim-Subscription-Key` — it must not appear.

## Test

```bash
curl "https://perron-ns-proxy.<your-account>.workers.dev/v2/stations"
```
