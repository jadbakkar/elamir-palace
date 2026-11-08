/* Vercel Routing Middleware (runs before any file is served; no packages needed).
   The site moved to www.elamirpalace.com. Visitors who still arrive on the old domain
   (elamirpalace.online / www.elamirpalace.online) see moved.html instead: a short
   "we have a new address" note that then sends them to the same page on the .com.
   Every other host (the .com, Vercel previews) goes through untouched.
   Preview / test without the old domain: add ?_moved=1 to any page URL. */
export const config = {
  // pages only: images, fonts, scripts, the chat API and moved.html itself are never rewritten
  matcher: "/((?!assets/|img/|api/|favicon\\.ico|moved\\.html|robots\\.txt|site\\.webmanifest).*)",
};

export default function middleware(request) {
  const url = new URL(request.url);
  const host = (request.headers.get("host") || url.host).toLowerCase();
  if (/(^|\.)elamirpalace\.online$/.test(host) || url.searchParams.get("_moved") === "1") {
    // rewrite (not redirect): the visitor keeps the old URL, so the page can send them to the same path on the .com
    return new Response(null, { headers: { "x-middleware-rewrite": new URL("/moved.html", url).toString() } });
  }
  return new Response(null, { headers: { "x-middleware-next": "1" } });
}
