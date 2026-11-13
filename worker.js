// Cloudflare Worker: small CORS proxy for Yahoo Finance + NSE/Nifty index CSV lists.
// Deploy: Cloudflare dashboard -> Workers & Pages -> Create -> Hello World -> Edit code -> paste this -> Deploy.
const ALLOW = [
  'query1.finance.yahoo.com',
  'query2.finance.yahoo.com',
  'niftyindices.com',
  'www.niftyindices.com',
  'archives.nseindia.com',
  'nsearchives.nseindia.com',
];

export default {
  async fetch(request) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': '*',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    const target = new URL(request.url).searchParams.get('url');
    if (!target) return new Response('Pivot scanner proxy is running', { headers: cors });

    let t;
    try { t = new URL(target); } catch { return new Response('bad url', { status: 400, headers: cors }); }
    if (!ALLOW.includes(t.hostname)) return new Response('host not allowed', { status: 403, headers: cors });

    const intraday = /interval=(1m|2m|5m|15m|30m|60m|90m)/.test(t.search);
    const ttl = t.hostname.includes('yahoo') ? (intraday ? 30 : 300) : 86400;

    const r = await fetch(t.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36',
        'Accept': '*/*',
        'Referer': 'https://www.nseindia.com/',
      },
      cf: { cacheTtl: ttl, cacheEverything: true },
    });
    return new Response(r.body, {
      status: r.status,
      headers: { ...cors, 'Content-Type': r.headers.get('Content-Type') || 'text/plain' },
    });
  },
};
