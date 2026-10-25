# 🐍 Snake Game ko Wix Subdomain Par Kaise Lagayein

## 📋 3 Tarike Hain - Apni Zaroorat Ke Hisaab Se Choose Karo:

---

## 🟢 TARIKA 1: Wix HTML Embed (Sabse Aasan) ⭐ RECOMMENDED

### Step 1: Wix Editor Kholo
1. https://www.wix.com par jao
2. Login karo ya account banao
3. Apni website ka editor kholo

### Step 2: HTML Embed Add Karo
1. Editor mein **"+" (Add Elements)** button par click karo
2. **"Embed Code"** ya **"HTML iframe"** dhundo
3. Usko drag karke page par rakho

### Step 3: Code Paste Karo
1. Embed component par click karo
2. **"Enter Code"** ya **"Edit Code"** par click karo
3. `wix-snake-game.html` file ka **poora code copy karo**
4. Wix editor mein paste karo
5. **"Update"** par click karo

### Step 4: Size Set Karo
- Width: **100%** ya **600px** (jo bhi achha lage)
- Height: **800px** ya **900px** (game ke liye)

### Step 5: Publish Karo
- **"Publish"** button par click karo
- Done! ✅

---

## 🟢 TARIKA 2: External Hosting + Wix Embed

### Step 1: Game ko Host Karo (Free)

#### Option A: GitHub Pages (Recommended - Free)
```bash
# 1. GitHub par account banao: https://github.com
# 2. New repository banao: "snake-game"
# 3. wix-snake-game.html ko rename karke "index.html" rakh do
# 4. Repository mein upload karo
# 5. Settings → Pages → Source: "main" branch select karo
# 6. URL milega: https://YOUR-USERNAME.github.io/snake-game/
```

#### Option B: Netlify (Free - Drag & Drop)
```bash
# 1. https://www.netlify.com par jao
# 2. "Deploy manually" par click karo
# 3. wix-snake-game.html ko rename karke "index.html" rako
# 4. File ko drag & drop karo
# 5. URL milega: https://random-name.netlify.app
```

#### Option C: Vercel (Free)
```bash
# 1. https://vercel.com par jao
# 2. "New Project" → Import karo
# 3. Deploy karo
# 4. URL milega: https://snake-game.vercel.app
```

### Step 2: Wix Mein Embed Karo
1. Wix Editor mein **"+" → Embed Code → "Embed a Website"**
2. Apna hosted URL paste karo
   Example: `https://YOUR-USERNAME.github.io/snake-game/`
3. Size set karo (Width: 100%, Height: 800px)
4. Publish karo ✅

---

## 🟢 TARIKA 3: Wix Velo (Advanced Users)

### Step 1: Wix Editor Mein Velo Enable Karo
1. Editor mein **"Dev Mode"** toggle on karo
2. New page banao: "snake-game"

### Step 2: HTML Component Add Karo
```javascript
// Page code mein:
import wixWindow from 'wix-window';

$w.onReady(function () {
    // HTML component ko configure karo
    const htmlCode = `
        <!-- Yahan poora game code paste karo -->
    `;
    
    $w('#html1').src = 'data:text/html,' + encodeURIComponent(htmlCode);
});
```

---

## 📱 Mobile Par Kaise Kaam Karega

Wix automatically mobile version banata hai. Game responsive hai, toh:
- ✅ Phone par swipe controls kaam karenge
- ✅ D-pad buttons dikhai denge
- ✅ Touch-friendly hai

---

## ⚠️ Important Tips

### 1. File Size
- `wix-snake-game.html` ek standalone file hai
- Koi external dependency nahi (sirf Tailwind CDN)
- Size: ~15KB (bahut lightweight)

### 2. Loading Speed
- Tailwind CDN pehli baar mein load hoga (~30KB)
- Baad mein cache ho jayega
- Game instantly playable hoga

### 3. SEO
- Game embed hai, toh SEO par asar nahi hoga
- Agar chahiye toh alag page banao

### 4. Analytics
- Wix analytics automatically track karega
- Game events track karne ke liye custom code add karna padega

---

## 🎯 Quick Checklist

- [ ] `wix-snake-game.html` file download ki
- [ ] Wix account hai
- [ ] Editor khol ke HTML embed add kiya
- [ ] Code paste kiya
- [ ] Size set kiya (100% x 800px)
- [ ] Test kiya (desktop + mobile)
- [ ] Publish kiya ✅

---

## 🆘常见问题 (Common Issues)

| Problem | Solution |
|---------|----------|
| Game dikhai nahi de raha | HTML embed ka size check karo, height kam se kam 700px rakho |
| Controls kaam nahi kar rahe | Browser console check karo, JavaScript error ho sakta hai |
| Mobile par touch nahi ho raha | `touch-action: none` CSS mein hai, Wix iframe settings check karo |
| Slow load ho raha | Tailwind CDN pehli baar load hota hai, baad mein fast hoga |
| Full screen nahi ho raha | Wix embed settings mein "scroll" off karo |

---

## 📞 Need Help?

Agar koi problem aaye toh:
1. Browser console (F12) check karo
2. Wix support se contact karo
3. File ko Netlify/GitHub Pages par host karo (TARIKA 2)

---

## 🎮 Game Features

- ✅ Keyboard controls (Arrow keys / WASD)
- ✅ Touch controls (Swipe + D-pad)
- ✅ Pause/Resume (Space key)
- ✅ Restart (R key)
- ✅ 3 Difficulty levels (Easy/Medium/Hard)
- ✅ Score tracking
- ✅ High score (localStorage mein save hota hai)
- ✅ Responsive design (Desktop + Mobile)
- ✅ Smooth animations
- ✅ Dark theme with neon effects

---

**Bas itna karna hai! Enjoy your Snake Game on Wix! 🐍🎉**
