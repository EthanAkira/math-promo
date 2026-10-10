#!/bin/bash
# usage: scripts/upload_assets.sh <sql dir>   (retries each file up to 3 times)
cd "$(dirname "$0")/.."
for f in "$1"/assets-*.sql; do
  for i in 1 2 3; do
    out=$(npx wrangler d1 execute math-promo-db --remote --file="$f" 2>&1)
    if echo "$out" | grep -q '"success": true'; then echo "ok $f"; break; fi
    echo "retry $i $f"
  done
done
echo DONE
