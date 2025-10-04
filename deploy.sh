#!/bin/bash

# Deploy script for GitHub Pages
echo "🚀 Starting deployment to GitHub Pages..."

# Build the project
echo "📦 Building project..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Build failed - no build directory found"
    exit 1
fi

# Remove old gh-pages branch locally if it exists
echo "🧹 Cleaning up old gh-pages branch..."
git branch -D gh-pages 2>/dev/null || true

# Create new gh-pages branch from main
echo "🌿 Creating fresh gh-pages branch..."
git checkout -b gh-pages

# Remove everything except build files
echo "🗑️ Cleaning up unnecessary files..."
find . -maxdepth 1 -not -name 'build' -not -name '.git' -not -name '.' -exec rm -rf {} +

# Move build files to root
echo "📁 Moving build files to root..."
cp -r build/* .
rm -rf build

# Add all files to git
echo "📝 Adding files to git..."
git add .

# Commit the changes
echo "💾 Committing changes..."
git commit -m "Deploy to GitHub Pages - $(date)"

# Push to remote gh-pages branch
echo "🚀 Pushing to GitHub Pages..."
git push origin gh-pages --force

# Switch back to main branch
echo "🔄 Switching back to main branch..."
git checkout main

echo "✅ Deployment complete! Your app should be available at:"
echo "   https://hutizaki.github.io/gym/"
