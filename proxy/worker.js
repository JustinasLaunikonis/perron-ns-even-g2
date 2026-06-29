const NS_BASE = "https://gateway.apiportal.ns.nl/reisinformatie-api/api";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const PRIVACY_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Privacy Policy — Perron-NS</title>
<style>
  body { max-width: 720px; margin: 40px auto; padding: 0 20px;
    font: 16px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    color: #232323; }
  h1 { font-size: 28px; margin-bottom: 4px; }
  h2 { font-size: 20px; margin-top: 32px; }
  h3 { font-size: 17px; margin-top: 24px; }
  .updated { color: #7B7B7B; margin-top: 0; }
  code { background: #F6F6F6; padding: 1px 5px; border-radius: 4px; }
  a { color: #1a6dff; }
  hr { border: 0; border-top: 1px solid #E4E4E4; margin: 32px 0; }
</style>
</head>
<body>
<h1>Privacy Policy — Perron-NS</h1>
<p class="updated"><strong>Last updated: 28 June 2026</strong></p>

<p>Perron-NS ("the app") is a journey planner for Dutch Railways (NS) services,
built for Even Realities G2 glasses and the Even Hub platform. This policy
explains what data the app handles, why, and who it is shared with.</p>

<p>The app has <strong>no user accounts, no advertising, no analytics, and no
tracking.</strong> It does not sell or share personal data, and it collects no
more than is needed to plan a journey.</p>

<h2>Data stored on your device</h2>
<p>The following are saved <strong>locally on your device</strong> (via the
browser <code>localStorage</code> API) and are never uploaded to us:</p>
<ul>
  <li><strong>Favorite locations</strong> — stations you choose to save,
  including any custom label and icon you set.</li>
  <li><strong>Recent journeys</strong> — the "Plan again" history of from/to
  routes you have planned.</li>
</ul>
<p>This data stays on your device. Removing the app, clearing its storage, or
deleting individual favorites/routes inside the app erases it. We cannot see it
and have no copy of it.</p>

<h2>Data sent over the network</h2>
<p>To show live travel information, the app sends the following to our backend
proxy when you search or plan a journey:</p>
<ul>
  <li>The text you type to search for a station, and the station codes you
  select.</li>
  <li>The origin and destination station codes for a journey you plan.</li>
</ul>
<p>This data is used only to retrieve station lists, departure boards, and
journey options. It is <strong>not</strong> linked to your identity, stored by
the app's backend, or used for any other purpose.</p>

<h3>Why the app needs network access</h3>
<p>The app declares a single <strong>network</strong> permission. It is used
solely to fetch Dutch Railways (NS) station, departure, and journey-planning
data through the backend described below. The app makes no other network
connections.</p>

<h2>Third parties</h2>
<p>Network requests reach NS through one intermediary service that we operate:</p>
<ul>
  <li><strong>Backend proxy:</strong>
  <code>https://perron-ns-proxy.justinasla.workers.dev</code>. Operated by us
  and hosted on Cloudflare Workers. It forwards your requests to the NS
  Reisinformatie API and attaches the NS API key on the server side (the key is
  never included in the app). The proxy does not store the contents of your
  requests. As with any internet service, the hosting provider (Cloudflare) may
  process standard request metadata such as IP address transiently to deliver
  and protect the service. See
  <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare's privacy
  policy</a>.</li>
  <li><strong>NS Reisinformatie API</strong>
  (<code>gateway.apiportal.ns.nl</code>), operated by Nederlandse Spoorwegen
  (NS). The station codes for your query are sent here so NS can return the
  matching travel information. NS processes this data under its own
  <a href="https://www.ns.nl/en/privacy">privacy policy</a>.</li>
</ul>
<p>We do not share your data with anyone else.</p>

<h2>Data retention</h2>
<ul>
  <li>On-device data (favorites, recent journeys) is kept until you delete it or
  remove the app.</li>
  <li>The app's backend proxy does not retain the contents of your requests.</li>
</ul>

<h2>Children</h2>
<p>The app is a general-audience travel tool and is not directed at children. It
does not knowingly collect personal information from children.</p>

<h2>Changes to this policy</h2>
<p>If this policy changes, the "Last updated" date above will change and the
revised policy will be published at this same location.</p>

<h2>Contact</h2>
<p>Questions about this policy or your data:<br />
<strong>Justinas Launikonis</strong> — justinas.launikonis@gmail.com</p>
</body>
</html>`;

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }
    if (request.method !== "GET") {
      return new Response("Method Not Allowed", { status: 405, headers: CORS });
    }

    const url = new URL(request.url);

    if (url.pathname === "/privacy" || url.pathname === "/privacy/") {
      return new Response(PRIVACY_HTML, {
        status: 200,
        headers: {
          ...CORS,
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=3600",
        },
      });
    }

    const target = NS_BASE + url.pathname + url.search;

    let nsResp;
    try {
      nsResp = await fetch(target, {
        headers: { "Ocp-Apim-Subscription-Key": env.NS_API_KEY },
      });
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Upstream fetch failed", detail: String(e) }),
        { status: 502, headers: { ...CORS, "content-type": "application/json; charset=utf-8" } },
      );
    }

    const body = await nsResp.text();
    return new Response(body, {
      status: nsResp.status,
      headers: {
        ...CORS,
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  },
};
