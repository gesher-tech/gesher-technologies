#!/usr/bin/env bash
# Serves the production build with Apache httpd 2.4 (AllowOverride All, like Hostinger)
# and verifies the rules in public/.htaccess. A broken .htaccess makes shared hosting
# answer every request with HTTP 500, so this runs in CI before any deployment.
#
# Usage: scripts/check-htaccess.sh [dist-dir]      (requires Docker and curl)
set -euo pipefail

DIST="${1:-dist}"
PORT="${PORT:-8088}"
NAME="gesher-htaccess-check"
BASE="http://localhost:${PORT}"


[ -f "$DIST/index.html" ] || { echo "No build found in $DIST — run 'npm run build' first." >&2; exit 1; }
[ -f "$DIST/.htaccess" ] || { echo "$DIST/.htaccess is missing." >&2; exit 1; }
DIST_ABS="$(cd "$DIST" && (pwd -W 2>/dev/null || pwd))"

cleanup() { docker rm -f "$NAME" >/dev/null 2>&1 || true; }
trap cleanup EXIT
cleanup

# MSYS_NO_PATHCONV keeps the container path intact under Git Bash on Windows (no effect elsewhere).
MSYS_NO_PATHCONV=1 docker run -d --name "$NAME" -p "${PORT}:80" -v "${DIST_ABS}:/usr/local/apache2/htdocs:ro" httpd:2.4 sh -c "
  sed -i \
    -e 's/^#LoadModule rewrite_module/LoadModule rewrite_module/' \
    -e 's/^#LoadModule headers_module/LoadModule headers_module/' \
    -e 's/^#LoadModule deflate_module/LoadModule deflate_module/' \
    -e 's/AllowOverride None/AllowOverride All/g' conf/httpd.conf && httpd-foreground" >/dev/null

for _ in $(seq 1 30); do curl -s -o /dev/null "$BASE/" && break; sleep 1; done

failures=0
pass() { printf '  \033[32mPASS\033[0m %s\n' "$1"; }
fail() { printf '  \033[31mFAIL\033[0m %s — %s\n' "$1" "$2"; failures=$((failures + 1)); }

# expect <description> <expected-status> <path> [extra curl args...]
expect_status() {
  local desc="$1" want="$2" path="$3"; shift 3
  local got
  got="$(curl -s -o /dev/null -w '%{http_code}' "$@" "$BASE$path")"
  if [ "$got" = "$want" ]; then pass "$desc ($got)"; else fail "$desc" "expected $want, got $got"; fi
}
# expect_header <description> <path> <header-regex>
expect_header() {
  local desc="$1" path="$2" pattern="$3"
  if curl -s -D - -o /dev/null -H 'X-Forwarded-Proto: https' "$BASE$path" | tr -d '\r' | grep -qiE "$pattern"; then pass "$desc"; else fail "$desc" "no header matching /$pattern/"; fi
}

HTTPS=(-H 'X-Forwarded-Proto: https')
ASSET="$(grep -oE '/assets/[^"]+\.js' "$DIST/index.html" | head -1)"

echo "Checking .htaccess against Apache httpd 2.4 at $BASE"
expect_status "home page loads" 200 / "${HTTPS[@]}"
expect_status "unknown path falls back to the app" 200 /about/team "${HTTPS[@]}"
if curl -s "${HTTPS[@]}" "$BASE/about/team" | grep -q 'id="root"'; then
  pass "fallback serves index.html"
else
  fail "fallback serves index.html" "body is not the app shell"
fi
expect_status "built asset is served" 200 "$ASSET" "${HTTPS[@]}"
expect_status "missing asset is a real 404" 404 /assets/missing-AbCdEf12.js "${HTTPS[@]}"
expect_status ".htaccess is not downloadable" 403 /.htaccess "${HTTPS[@]}"
expect_status "HTTP redirects to HTTPS" 301 /
expect_status "ACME challenge is not redirected" 404 /.well-known/acme-challenge/token
expect_header "Content-Security-Policy header" / "^content-security-policy: default-src 'self'"
expect_header "X-Frame-Options header" / '^x-frame-options: DENY'
expect_header "X-Content-Type-Options header" / '^x-content-type-options: nosniff'
expect_header "HTML is revalidated" /index.html '^cache-control: no-cache'
expect_header "hashed assets are immutable" "$ASSET" '^cache-control: .*immutable'
expect_header "JavaScript MIME type" "$ASSET" '^content-type: (text|application)/javascript'

if docker logs "$NAME" 2>&1 | grep -E 'Invalid command|\[core:alert\]|\.htaccess:' >/dev/null; then
  fail "Apache error log" "$(docker logs "$NAME" 2>&1 | grep -E 'Invalid command|\[core:alert\]|\.htaccess:' | head -3)"
else
  pass "no .htaccess errors in Apache log"
fi

if [ "$failures" -gt 0 ]; then
  echo "$failures check(s) failed." >&2
  exit 1
fi
echo "All .htaccess checks passed."
