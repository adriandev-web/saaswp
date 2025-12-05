#!/bin/bash

# Database Setup Script for WooLanding Backend
# This script creates the database and runs the schema

set -e  # Exit on error

echo "╔═══════════════════════════════════════════════════════╗"
echo "║   WooLanding Database Setup                           ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Load environment variables
if [ -f ../.env ]; then
    echo "Loading environment variables from .env..."
    export $(cat ../.env | grep -v '^#' | xargs)
else
    echo "Warning: .env file not found. Using default values."
    DB_HOST="${DB_HOST:-localhost}"
    DB_PORT="${DB_PORT:-5432}"
    DB_NAME="${DB_NAME:-woolanding_db}"
    DB_USER="${DB_USER:-postgres}"
fi

echo "Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Check if PostgreSQL is running
echo "Checking PostgreSQL connection..."
if ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER > /dev/null 2>&1; then
    echo "Error: Cannot connect to PostgreSQL server."
    echo "Please ensure PostgreSQL is running and credentials are correct."
    exit 1
fi
echo "✓ PostgreSQL is running"
echo ""

# Check if database exists
echo "Checking if database exists..."
DB_EXISTS=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -w $DB_NAME | wc -l)

if [ $DB_EXISTS -eq 0 ]; then
    echo "Database '$DB_NAME' does not exist. Creating..."
    createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
    echo "✓ Database created"
else
    echo "✓ Database '$DB_NAME' already exists"
fi
echo ""

# Ask for confirmation before running schema
read -p "Run database schema? This will create all tables. Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Schema creation cancelled."
    exit 0
fi

# Run schema
echo "Running database schema..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f schema.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Database schema created successfully!"
    echo ""
    echo "Database '$DB_NAME' is ready to use."
    echo ""
    echo "Tables created:"
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dt" | grep public
    echo ""
    echo "Next steps:"
    echo "  1. Update your .env file with database credentials"
    echo "  2. Run 'npm run dev' to start the server"
    echo "  3. Test the connection at http://localhost:3000/health"
else
    echo ""
    echo "✗ Error creating database schema"
    exit 1
fi
