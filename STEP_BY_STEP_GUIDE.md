# 🐍 Snake Game → Google Play Store
# Complete Step-by-Step Procedure

---

## 📋 TABLE OF CONTENTS
1. [Install Prerequisites](#phase-1-install-prerequisites)
2. [Set Up the Project](#phase-2-set-up-the-project)
3. [Test on Your Phone](#phase-3-test-on-your-phone)
4. [Create Signed Release Build](#phase-4-create-signed-release-build)
5. [Prepare Store Assets](#phase-5-prepare-store-assets)
6. [Publish to Google Play](#phase-6-publish-to-google-play)

---

## 🟢 PHASE 1: Install Prerequisites

### Step 1.1 — Install Node.js
1. Go to https://nodejs.org
2. Download the **LTS version** (v18 or newer)
3. Run the installer → click Next through everything
4. Verify installation:
   ```
   Open Terminal/Command Prompt
   Type: node --version
   Should show: v18.x.x or higher
   ```

### Step 1.2 — Install Android Studio
1. Go to https://developer.android.com/studio
2. Click **Download Android Studio**
3. Run the installer → accept defaults
4. On first launch, choose **Standard** install type
5. Let it download the Android SDK (this takes 10-20 minutes)
6. Once done, click **Finish**

### Step 1.3 — Set Up Environment Variables

**On Windows:**
1. Open **System Properties → Environment Variables**
2. Under System Variables, click **New**:
   - Variable: `ANDROID_HOME`
   - Value: `C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk`
3. Edit the `Path` variable, add these:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`
4. Restart your terminal

**On Mac/Linux:**
1. Open `~/.bashrc` or `~/.zshrc`
2. Add these lines:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk   # Mac
   # OR
   export ANDROID_HOME=$HOME/Android/Sdk           # Linux
   
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   ```
3. Save and run: `source ~/.bashrc`

### Step 1.4 — Enable USB Debugging on Your Phone
1. On your Android phone, go to **Settings → About Phone**
2. Tap **Build Number** 7 times → Developer mode enabled!
3. Go to **Settings → Developer Options**
4. Enable **USB Debugging**

---

## 🟢 PHASE 2: Set Up the Project

### Step 2.1 — Get the Project Files
```bash
# Download/clone the project to your computer
# Then navigate to the project folder:
cd path/to/snake-game
```

### Step 2.2 — Install Dependencies
```bash
npm install
```
Wait for it to finish (downloads all packages).

### Step 2.3 — Build the Web App
```bash
npm run build
```
This creates the `dist/` folder with your game.

### Step 2.4 — Add Android Platform
```bash
npx cap add android
```
This creates the `android/` folder with native Android project.

### Step 2.5 — Sync Web Assets to Android
```bash
npx cap sync android
```
This copies your built web app into the Android project.

### Step 2.6 — Open in Android Studio
```bash
npx cap open android
```
Android Studio opens with your project loaded.

---

## 🟢 PHASE 3: Test on Your Phone

### Step 3.1 — Wait for Gradle Sync
- Android Studio will show a progress bar at the bottom
- First sync takes 2-5 minutes (downloading dependencies)
- Wait until it says **"BUILD SUCCESSFUL"**

### Step 3.2 — Connect Your Phone
1. Connect phone to computer via USB cable
2. On phone, allow the USB debugging prompt
3. In Android Studio, you should see your device in the top toolbar

### Step 3.3 — Run the App
1. Click the green **▶ Run** button in Android Studio
2. Select your phone as the target
3. The app installs and launches on your phone!
4. Test all features: controls, pause, difficulty, scores

### Step 3.4 — Alternative: Build APK to Install Manually
1. In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Find the APK at:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```
3. Transfer to your phone and install

---

## 🟢 PHASE 4: Create Signed Release Build

### Step 4.1 — Generate a Signing Key
Open terminal and run:
```bash
keytool -genkey -v -keystore snake-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias snake-key
```
You'll be prompted for:
- Password (remember this!): `********`
- Name, Organization, etc. (fill in anything)

**⚠️ SAVE THIS KEY FILE! You need it for every future update.**

### Step 4.2 — Move the Key File
Move `snake-release-key.jks` into the `android/` folder.

### Step 4.3 — Create key.properties
Create a file at `android/key.properties`:
```
storePassword=YOUR_PASSWORD_HERE
keyPassword=YOUR_PASSWORD_HERE
keyAlias=snake-key
storeFile=snake-release-key.jks
```

### Step 4.4 — Configure Build.gradle
Open `android/app/build.gradle` and add this **above** the `android {` line:

```gradle
def keystorePropertiesFile = rootProject.file("key.properties")
def keystoreProperties = new Properties()
keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
```

Then inside the `android {` block, add:

```gradle
android {
    // ... existing code ...
    
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
        }
    }
}
```

### Step 4.5 — Build the Signed AAB
1. In Android Studio: **Build → Generate Signed Bundle / APK**
2. Choose **Android App Bundle**
3. Select your keystore file and enter passwords
4. Choose **release** build variant
5. Click **Finish**
6. Find the AAB at:
   ```
   android/app/release/app-release.aab
   ```

---

## 🟢 PHASE 5: Prepare Store Assets

### Step 5.1 — App Icon (512x512 PNG)
- Create a high-quality icon
- Must be 512x512 pixels, PNG format
- No transparency, no rounded corners (Google adds them)

### Step 5.2 — Feature Graphic (1024x500 PNG)
- Banner shown at the top of your store listing
- Must be exactly 1024x500 pixels

### Step 5.3 — Screenshots (at least 2)
- Take screenshots of your game on a phone
- Minimum 2, maximum 8
- JPEG or 24-bit PNG (no alpha)
- Min size: 320px, Max size: 3840px
- Aspect ratio: up to 16:9

### Step 5.4 — Privacy Policy
- Host a privacy policy page online (use a free generator)
- Must be accessible via URL
- Required even for simple games

### Step 5.5 — Store Listing Text
Prepare these:
- **App Name** (30 chars max): "Snake Game - Classic Arcade"
- **Short Description** (80 chars): "Classic snake game with modern controls. Easy to learn, hard to master!"
- **Full Description** (4000 chars): Detailed description of features

---

## 🟢 PHASE 6: Publish to Google Play

### Step 6.1 — Create Developer Account
1. Go to https://play.google.com/console
2. Sign in with Google account
3. Pay the **$25 one-time registration fee**
4. Accept the Developer Distribution Agreement

### Step 6.2 — Create the App
1. Click **Create App**
2. Fill in:
   - App name: "Snake Game"
   - Default language: English
   - App or game: **Game**
   - Free or paid: **Free**
3. Click **Create App**

### Step 6.3 — Complete Store Listing
1. Go to **Main store listing**
2. Upload:
   - App icon (512x512)
   - Feature graphic (1024x500)
   - Screenshots (at least 2)
3. Fill in:
   - Short description
   - Full description
4. Click **Save**

### Step 6.4 — Complete App Content
1. Go to **App content** in the left menu
2. Complete each section:
   - ✅ Privacy policy (enter your URL)
   - ✅ Ads (select "No" if no ads)
   - ✅ Content rating (fill questionnaire → likely "Everyone")
   - ✅ Target audience (select "Children" or "Older users")
   - ✅ News apps (select "No")

### Step 6.5 — Upload Your AAB
1. Go to **Production** (or Testing → Internal testing)
2. Click **Create new release**
3. Upload your `app-release.aab` file
4. Enter release notes: "Initial release of Snake Game"
5. Click **Next** → **Save**

### Step 6.6 — Set Pricing & Distribution
1. Go to **Pricing & distribution**
2. Select **Free**
3. Select countries to distribute in (or "All")
4. Confirm content guidelines

### Step 6.7 — Submit for Review
1. Go back to **Production**
2. Click **Review release**
3. Click **Send changes for review**
4. Wait 1-7 days for Google to review

### 🎉 Congratulations!
Once approved, your Snake Game will be live on the Google Play Store!

---

## 🔄 HOW TO UPDATE YOUR APP LATER

```bash
# 1. Make changes to your code
# 2. Rebuild:
npm run build

# 3. Sync to Android:
npx cap sync android

# 4. In Android Studio:
#    - Increment versionCode in build.gradle (e.g., 1 → 2)
#    - Build → Generate Signed Bundle
# 5. Upload new AAB to Play Console
```

---

## 🆘 COMMON ISSUES & FIXES

| Problem | Solution |
|---------|----------|
| Gradle sync fails | Check JAVA_HOME is set, restart Android Studio |
| "SDK location not found" | Set ANDROID_HOME environment variable |
| App shows white screen | Run `npm run build` then `npx cap sync android` |
| Can't find device | Enable USB debugging, install phone's USB drivers |
| Build failed: duplicate files | Run `npx cap sync android` again |
| Signing error | Check key.properties passwords match |

---

## 📞 USEFUL LINKS

- Android Studio: https://developer.android.com/studio
- Play Console: https://play.google.com/console
- Capacitor Docs: https://capacitorjs.com/docs
- Icon Generator: https://icon.kitchen
- Privacy Policy Generator: https://www.privacypolicygenerator.info

---

**Estimated Time: 2-4 hours for first-time setup**
**Cost: $25 (one-time Google Play fee)**

Good luck! 🐍🎮
