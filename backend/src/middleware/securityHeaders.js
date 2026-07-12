/**
 * securityHeaders — adds HTTP response headers that tell browsers to
 * behave more safely. None of these require any configuration — they're
 * safe defaults for any web API.
 *
 * What each one does:
 *
 * X-Content-Type-Options: nosniff
 *   Stops browsers "guessing" a file's type from its contents. Without
 *   this, a browser might execute a text file as JavaScript if it looks
 *   like code.
 *
 * X-Frame-Options: DENY
 *   Stops your site being embedded in an <iframe> on another site, which
 *   is how clickjacking attacks work (overlaying invisible buttons over
 *   your UI to steal clicks).
 *
 * Referrer-Policy: strict-origin-when-cross-origin
 *   Limits how much of the current URL is sent to external sites when a
 *   user follows a link — prevents leaking paths that might contain
 *   sensitive info.
 *
 * X-XSS-Protection: 0
 *   Counterintuitively, setting this to 0 is the current recommendation.
 *   The old browser XSS filter it controlled caused more problems than it
 *   solved and has been removed from modern browsers.
 *
 * Permissions-Policy
 *   Disables browser features your API has no reason to use (camera,
 *   microphone, geolocation). Reduces attack surface.
 */
export function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
}
