# SCIENCE CENTRE SHOP — Setup (Hindi)

यह Shop आपकी मौजूदा GitHub Pages साइट के अंदर `/shop/` पर चलेगी। मौजूदा Home Page को बदले बिना अलग Affiliate Store बनाया गया है।

## अभी क्या तैयार है
- Mobile-first product catalogue, search, category filters और sorting
- Product detail share URL: `?product=PRODUCT_ID`
- Facebook और WhatsApp share
- Wishlist (इस browser/device में localStorage)
- Owner login via Firebase Authentication
- Product add/edit/delete, improved CSV import/export, downloadable CSV template
- CSV import में quoted commas/line breaks support, duplicate affiliate URL skip, invalid rows skip, 500 rows per upload and 2 MB file limit
- Affiliate platform labels: Amazon, Flipkart, Meesho, Myntra, AJIO, Croma, FirstCry and Other
- Outbound affiliate click event analytics (sales/conversions नहीं)
- Affiliate disclosure
- Exact affiliate URL preserve करके new tab में खोलना
- कोई sample/fake product या fabricated affiliate URL नहीं

## चरण 1 — Firebase project बनाएं (Free Spark plan)
1. https://console.firebase.google.com/ खोलें और Google account से sign in करें।
2. Add project → नाम रखें `science-centre-shop` → Google Analytics अभी बंद रख सकते हैं → Create project.
3. Project Overview में Web app (</>) जोड़ें; नाम `Science Centre Shop`.
4. Firebase आपको web config देगा। इसे अभी सुरक्षित रखें; यह browser config है, password नहीं।
5. Authentication → Get started → Sign-in method → Email/Password enable करें।
6. Authentication → Users → Add user से अपना owner email/password बनाएं।
7. बने हुए user का UID कॉपी करें।

## चरण 2 — Firestore बनाएं
1. Firestore Database → Create database → Start in production mode.
2. Region चुनें जो आपके users के लिए उपयुक्त हो; region बाद में बदलना आसान नहीं होता।
3. Firestore → Rules में इस repo के `shop/firestore.rules` का content paste करें।
4. Rules में `REPLACE_WITH_OWNER_UID` को अपने Authentication user UID से बदलें।
5. Publish करें।

## चरण 3 — वेबसाइट में Firebase config जोड़ें
1. GitHub में `shop/index.html` खोलें → Edit (pencil).
2. `const firebaseConfig = {` खोजें और Firebase Console के Web app config से ये values भरें:
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId
3. `const OWNER_UID = "PASTE_OWNER_UID";` में अपना Authentication UID डालें।
4. Commit changes करें।
5. ध्यान दें: Firebase web config सार्वजनिक होता है; सुरक्षा Firestore Rules और Authentication से आती है। कभी भी service-account private key या admin SDK credentials इस HTML में न डालें।

## चरण 4 — GitHub Pages
- Repository: https://github.com/VishwendraSir/Home-page
- Branch: main
- इस directory को publish करने के लिए अलग workflow नहीं चाहिए; existing GitHub Pages site में path उपलब्ध होगा।
- Shop URL: https://vishwendrasir.github.io/Home-page/shop/

## चरण 5 — पहला Product जोड़ें
1. Shop URL खोलें → Owner Login.
2. Firebase में बनाए email/password से sign in करें।
3. Add Product पर क्लिक करें।
4. Product image का direct HTTPS URL और exact affiliate URL डालें।
5. Save Product करें।

## महत्वपूर्ण Free-tier / security बातें
- Firebase Spark plan की quotas और feature limits लागू हैं; current limits Firebase Console में देखें।
- Firebase Storage पर निर्भर नहीं किया गया; image URLs या GitHub-hosted images उपयोग करें।
- Product click analytics outbound clicks गिनता है; Amazon/Flipkart sales या commission की पुष्टि नहीं करता।
- Public click events abuse से पूरी तरह सुरक्षित नहीं हैं; इसे basic directional analytics समझें।
- Affiliate network के नियमों के अनुसार disclosure और link-sharing policy का पालन करें।
- Facebook पर automatic posting शामिल नहीं है; Facebook Share dialog खुलता है।
- Product price/availability manually update करनी होगी; कोई unauthorized scraping नहीं की जाती।

## CSV format
Header:
`name,description,category,platform,price,originalPrice,image,affiliateUrl,featured,active`

हर product के लिए सही affiliateUrl अनिवार्य है। CSV import से पहले product data जांच लें।
