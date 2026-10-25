# 🐍 Snake Game - Android Build Guide (Capacitor)

## 📋 Prerequisites

Before building, install these on your computer:

1. **Node.js** (v18+) — [Download](https://nodejs.org)
2. **Android Studio** — [Download](https://developer.android.com/studio)
3. **Java JDK 17** — (comes with Android Studio)
4. **Android SDK** — (installed via Android Studio)

## 🚀 Quick Setup Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build the Web App
```bash
npm run build
```

### Step 3: Add Android Platform
```bash
npx cap add android
```

### Step 4: Sync Web Assets to Android
```bash
npx cap sync android
```

### Step 5: Open in Android Studio
```bash
npx cap open android
```

## 📱 Building the APK/AAB

### Option A: Build Debug APK (for testing)
1. Open Android Studio (from Step 5)
2. Wait for Gradle sync to complete
3. Go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**
4. Find the APK at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Option B: Build Signed Release AAB (for Play Store)
1. Generate a keystore:
```bash
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-alias
```

2. Create `android/key.properties`:
```
storePassword=YOUR_PASSWORD
keyPassword=YOUR_PASSWORD
keyAlias=my-alias
storeFile=../my-release-key.jks
```

3. Edit `android/app/build.gradle` and add signing config:
```gradle
def keystorePropertiesFile = rootProject.file("key.properties")
def keystoreProperties = new Properties()
keystoreProperties.load(new FileInputStream(keystorePropertiesFile))

android {
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

4. Build the AAB:
   - **Build → Build Bundle(s) / APK(s) → Build Bundle(s)**
   - Find at: `android/app/build/outputs/bundle/release/app-release.aab`

## 🎮 Publishing to Google Play Store

### Requirements:
- Google Play Developer Account ($25 one-time fee) — [Register](https://play.google.com/console)
- App icon: 512x512 PNG
- Feature graphic: 1024x500 PNG
- At least 2 screenshots (phone)
- Privacy Policy URL
- Content rating questionnaire

### Steps:
1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new app
3. Fill in store listing details
4. Upload your AAB file
5. Complete content rating
6. Set pricing & distribution
7. Submit for review (takes 1-7 days)

## 🔄 Updating the App

After making changes to the game:
```bash
npm run build
npx cap sync android
```
Then rebuild in Android Studio.

## 📁 Project Structure
```
├── android/              # Android native project (generated)
├── dist/                 # Built web app
├── src/                  # Source code
├── capacitor.config.ts   # Capacitor configuration
└── package.json
```

## 🐛 Troubleshooting

- **Gradle sync fails**: Make sure Java JDK 17 is installed and JAVA_HOME is set
- **Build fails**: Run `npx cap sync android` again
- **App crashes on launch**: Check `adb logcat` for errors
- **White screen**: Make sure you ran `npm run build` before `npx cap sync`

## 📞 Useful Commands

```bash
# Build web app
npm run build

# Sync to Android
npx cap sync android

# Open Android Studio
npx cap open android

# Run on connected device
npx cap run android

# Copy web assets only
npx cap copy android
```

## 🎉 You're Ready!

Your Snake Game is now configured for Android deployment. Follow the steps above to build and publish!
