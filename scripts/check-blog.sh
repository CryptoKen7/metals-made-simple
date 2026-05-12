#!/bin/bash
# Check PostStream for new blog posts and auto-publish

cd "$(dirname "$0")/.."
export POSTSTREAM_API_KEY="${POSTSTREAM_API_KEY:-pb_844b55fe439174a6d8d04ec29a2fcf73b669854d}"

echo "🔍 Checking PostStream for posts tagged 'blogmms'..."
node scripts/sync-poststream-blog.js
