#!/bin/bash

# ULTRA-SAFE Deploy script for GitHub Pages
# This script NEVER touches the main branch or deletes any source files

set -e  # Exit on any error

echo "🚀 Starting ULTRA-SAFE deployment to GitHub Pages..."

# Store current branch and directory
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
CURRENT_DIR=$(pwd)

echo "📍 Current branch: $CURRENT_BRANCH"
echo "📍 Current directory: $CURRENT_DIR"

# Verify we're on main branch
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ ERROR: Must be on main branch to deploy. Current branch: $CURRENT_BRANCH"
    echo "   Please run: git checkout main"
    exit 1
fi

# Verify we have a clean working directory
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ ERROR: Working directory is not clean. Please commit or stash changes first."
    echo "   Current status:"
    git status --short
    exit 1
fi

# Build the project
echo "📦 Building project..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Build failed - no build directory found"
    exit 1
fi

echo "✅ Build successful!"

# Create a completely separate temporary directory for deployment
echo "📁 Creating isolated deployment directory..."
TEMP_DIR=$(mktemp -d)
echo "📍 Temp directory: $TEMP_DIR"

# Copy ONLY the build files to temp directory
echo "📋 Copying build files to temp directory..."
cp -r build/* "$TEMP_DIR/"

# Verify temp directory has the right files
echo "🔍 Verifying temp directory contents..."
ls -la "$TEMP_DIR"

# Store current commit hash for reference
COMMIT_HASH=$(git rev-parse --short HEAD)
echo "📝 Current commit: $COMMIT_HASH"

# Remove old gh-pages branch locally if it exists
echo "🧹 Cleaning up old gh-pages branch..."
git branch -D gh-pages 2>/dev/null || true

# Create new gh-pages branch from an orphan branch (completely clean)
echo "🌿 Creating fresh gh-pages branch from orphan..."
git checkout --orphan gh-pages

# Remove all files from the new gh-pages branch (except .git)
echo "🗑️ Cleaning gh-pages branch (this is safe - it's a new branch)..."
git rm -rf . 2>/dev/null || true

# Copy the built files from temp directory to root of gh-pages
echo "📁 Moving build files to gh-pages root..."
cp -r "$TEMP_DIR"/* .

# Add all files to git
echo "📝 Adding files to git..."
git add .

# Commit the changes
echo "💾 Committing changes..."
git commit -m "Deploy to GitHub Pages - Commit $COMMIT_HASH - $(date)"

# Push to remote gh-pages branch
echo "🚀 Pushing to GitHub Pages..."
git push origin gh-pages --force

# Switch back to original branch
echo "🔄 Switching back to $CURRENT_BRANCH branch..."
git checkout "$CURRENT_BRANCH"

# Clean up temporary directory
echo "🧹 Cleaning up temporary directory..."
rm -rf "$TEMP_DIR"

# Verify we're back on main and everything is intact
echo "🔍 Verifying main branch integrity..."
if [ "$(git rev-parse --abbrev-ref HEAD)" != "main" ]; then
    echo "❌ ERROR: Not back on main branch!"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "❌ ERROR: node_modules missing from main branch!"
    exit 1
fi

if [ ! -d "src" ]; then
    echo "❌ ERROR: src directory missing from main branch!"
    exit 1
fi

echo "✅ Main branch integrity verified!"

echo ""
echo "🎉 ULTRA-SAFE Deployment complete!"
echo "   📊 Your app should be available at: https://hutizaki.github.io/gym/"
echo "   📝 Deployed commit: $COMMIT_HASH"
echo "   🔒 Main branch is completely untouched"
