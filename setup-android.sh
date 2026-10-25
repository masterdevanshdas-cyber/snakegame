#!/bin/bash

# 🐍 Snake Game - Android Setup Script
# Run this script to set up Capacitor for Android

echo "🐍 Snake Game - Android Setup"
echo "=============================="
echo ""

# Step 1: Build the web app
echo "📦 Step 1: Building web app..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Fix errors and try again."
    exit 1
fi
echo "✅ Web app built successfully!"
echo ""

# Step 2: Add Android platform (if not already added)
echo "📱 Step 2: Adding Android platform..."
if [ ! -d "android" ]; then
    npx cap add android
    if [ $? -ne 0 ]; then
        echo "❌ Failed to add Android platform!"
        exit 1
    fi
    echo "✅ Android platform added!"
else
    echo "ℹ️  Android platform already exists, skipping..."
fi
echo ""

# Step 3: Sync web assets
echo "🔄 Step 3: Syncing web assets to Android..."
npx cap sync android
if [ $? -ne 0 ]; then
    echo "❌ Sync failed!"
    exit 1
fi
echo "✅ Assets synced!"
echo ""

# Step 4: Open Android Studio
echo "🔧 Step 4: Opening Android Studio..."
echo "   (Make sure Android Studio is installed!)"
npx cap open android
echo ""

echo "=============================="
echo "✅ Setup complete!"
echo ""
echo "Next steps in Android Studio:"
echo "  1. Wait for Gradle sync to finish"
echo "  2. Build → Build Bundle(s) / APK(s) → Build APK"
echo "  3. Find APK at: android/app/build/outputs/apk/debug/"
echo ""
echo "For Play Store release:"
echo "  1. Generate signing key (see ANDROID_BUILD_GUIDE.md)"
echo "  2. Build → Build Bundle(s) / APK(s) → Build Bundle"
echo "  3. Upload AAB to Google Play Console"
echo ""
