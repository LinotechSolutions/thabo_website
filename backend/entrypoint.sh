#!/bin/sh
set -e

echo "=== CBZ Holdings Backend Starting ==="

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate --noinput

# Seed master data if not already populated
echo "Seeding master CBZ data..."
python manage.py seed_cbz_data || true

# Collect static assets
echo "Collecting static files..."
python manage.py collectstatic --noinput || true

PORT_TO_USE="${PORT:-8000}"
echo "Starting Uvicorn ASGI server on port ${PORT_TO_USE}..."

exec uvicorn cbz_backend.asgi:application \
    --host 0.0.0.0 \
    --port "$PORT_TO_USE" \
    --workers 2 \
    --timeout-keep-alive 75 \
    --access-log \
    --log-level info
