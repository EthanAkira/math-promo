#!/usr/bin/env bash
# Push the cropped question/solution images into production D1 (table jjang_calc1_assets, ids mp-q-/mp-s-).
# Usage: bash scripts/marple/load_assets.sh [sql_dir]   (default C:/Users/akihi/marple_cache/sql)
# Each file is atomic (wrangler rolls the file back on failure) and idempotent (INSERT OR REPLACE first),
# so a failed file is simply retried.
DIR="${1:-C:/Users/akihi/marple_cache/sql}"
fail=0
for f in "$DIR"/assets_*.sql; do
  ok=0
  for attempt in 1 2 3 4; do
    if npx wrangler d1 execute math-promo-db --remote --yes --file="$f" > /tmp/marple_d1.log 2>&1; then ok=1; break; fi
    echo "retry $attempt: $(basename "$f") $(grep -o 'ERROR.*' /tmp/marple_d1.log | head -1)"
    sleep 5
  done
  if [ "$ok" = 1 ]; then echo "ok $(basename "$f")"; else echo "FAILED $(basename "$f")"; fail=1; fi
done
echo "done fail=$fail"
