#!/bin/bash

# Pegas Website - Quick Deployment Script
# This script helps you deploy your website with proper cache clearing

echo "🚀 Pegas Website Deployment"
echo "=============================="
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository"
    echo "Please initialize git first: git init"
    exit 1
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "📝 Uncommitted changes detected"
    echo ""
    
    # Show status
    git status -s
    echo ""
    
    read -p "Commit these changes? (y/n): " commit_choice
    if [ "$commit_choice" == "y" ] || [ "$commit_choice" == "Y" ]; then
        read -p "Enter commit message: " commit_msg
        
        # Add all files
        git add .
        
        # Commit
        git commit -m "$commit_msg"
        echo "✅ Changes committed"
    else
        echo "❌ Deployment cancelled - please commit changes first"
        exit 1
    fi
fi

echo ""
echo "🔄 Pushing to repository..."
git push origin main

echo ""
echo "✅ Code pushed successfully!"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo "1. Go to Netlify Dashboard: https://app.netlify.com"
echo "2. Navigate to your Pegas website"
echo "3. Click 'Deploys' tab"
echo "4. Click 'Trigger deploy' > 'Clear cache and deploy site'"
echo ""
echo "After Netlify deployment completes:"
echo "5. Open pegas.lk in incognito/private mode to verify"
echo "6. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
