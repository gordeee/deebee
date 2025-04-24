#!/usr/bin/env bash
# cursor-bootstrap.sh — ensure env & build integrity before each Cursor run
set -euo pipefail

echo "🔍 validating environment …"
missing=0
for v in SUPABASE_URL SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY JWT_SECRET; do
  if [ -z "${!v:-}" ]; then
    echo "❌  $v is not set"
    missing=1
  fi
done
if [ "$missing" = 1 ]; then
  echo "Aborting – fix the variables above before retrying."; exit 1
fi
echo "✅  environment looks good"

echo "🔄 installing deps & generating types"
pnpm install --frozen-lockfile
pnpm supabase gen types typescript --project-id "$(pnpm supabase projects list --json | jq -r '.[0].id')" \
  > src/types/supabase.ts

echo "🚀 building"
pnpm build
