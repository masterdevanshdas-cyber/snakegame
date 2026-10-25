@echo off
REM 🐍 Snake Game - Android Setup Script (Windows)

echo.
echo  🐍 Snake Game - Android Setup
echo  ==============================
echo.

REM Step 1: Build the web app
echo  [Step 1/4] Building web app...
call npm run build
if %errorlevel% neq 0 (
    echo  ❌ Build failed! Fix errors and try again.
    pause
    exit /b 1
)
echo  ✅ Web app built successfully!
echo.

REM Step 2: Add Android platform
echo  [Step 2/4] Adding Android platform...
if not exist "android" (
    call npx cap add android
    if %errorlevel% neq 0 (
        echo  ❌ Failed to add Android platform!
        pause
        exit /b 1
    )
    echo  ✅ Android platform added!
) else (
    echo  ℹ️  Android platform already exists, skipping...
)
echo.

REM Step 3: Sync web assets
echo  [Step 3/4] Syncing web assets to Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo  ❌ Sync failed!
    pause
    exit /b 1
)
echo  ✅ Assets synced!
echo.

REM Step 4: Open Android Studio
echo  [Step 4/4] Opening Android Studio...
call npx cap open android
echo.

echo  ==============================
echo  ✅ Setup complete!
echo.
echo  Next steps in Android Studio:
echo    1. Wait for Gradle sync to finish
echo    2. Build → Build Bundle(s) / APK(s) → Build APK
echo    3. Find APK at: android\app\build\outputs\apk\debug\
echo.
echo  For Play Store release:
echo    1. Generate signing key (see ANDROID_BUILD_GUIDE.md)
echo    2. Build → Build Bundle(s) / APK(s) → Build Bundle
echo    3. Upload AAB to Google Play Console
echo.
pause
