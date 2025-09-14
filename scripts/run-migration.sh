#!/bin/bash

# Load environment variables from .env.local
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Set AWS S3 bucket if not already set
export AWS_S3_BUCKET=${AWS_S3_BUCKET:-"imagegenfree-images"}
export AWS_REGION=${AWS_REGION:-"us-east-1"}

echo "🚀 Starting high-quality image migration to AWS S3..."
echo "📊 Quality settings:"
echo "   - Original: Lossless (PNG) / 98% (JPEG)"
echo "   - Large: 98% quality"
echo "   - Medium: 97% quality" 
echo "   - Thumbnail: 95% quality"
echo ""

# Run the migration
node scripts/migrate-to-s3.js 