#!/bin/bash
# Script to load database schema to Railway

echo "🚀 Loading WooLanding database schema..."
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed."
    echo ""
    echo "Please install it first:"
    echo "  npm install -g @railway/cli"
    echo ""
    echo "Or use the Railway Query Editor:"
    echo "  1. Open your PostgreSQL service in Railway"
    echo "  2. Go to 'Query' tab"
    echo "  3. Copy and paste the content of scripts/schema.sql"
    echo "  4. Click 'Run'"
    exit 1
fi

# Load schema
railway run psql < scripts/schema.sql

echo ""
echo "✅ Schema loaded successfully!"
echo ""
echo "Verify with:"
echo "  railway run psql -c \"\\dt\""
