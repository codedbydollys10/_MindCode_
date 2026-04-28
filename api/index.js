import app from '../backend/server.js';

export default function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const forwardedPath = url.searchParams.get('__path');

  if (forwardedPath) {
    url.searchParams.delete('__path');
    const query = url.searchParams.toString();
    req.url = query ? `${forwardedPath}?${query}` : forwardedPath;
  }

  return app(req, res);
}
