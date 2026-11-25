# Firebase Owner Lock System — Setup (Hindi)

## क्या जोड़ा गया
- Firebase Email/Password Owner Login.
- Firestore siteControl/global, sitePages और siteModules switches.
- Owner audit trail: siteAudit.
- protectedContent और courseContent collections पर Firestore server-side read rules.
- मौजूदा students, attempts, batchRequests और videos rules संरक्षित.

## Firebase Console में एक बार setup
1. Firebase Console → Authentication → Sign-in method → Email/Password enable करें.
2. Authentication → Users → Add user से Owner email/password बनाएं.
3. Owner user का UID कॉपी करें.
4. Firestore Database में admins collection बनाएं; document ID वही Owner UID रखें. Fields: role = owner, active = true.
5. Repository की firestore.rules को Firestore Rules में paste करके Publish करें.
6. CLI से deploy करने के लिए project root में firebase deploy --only firestore:rules चलाएं. firebase.json में rules file पहले से mapped है.
7. Owner Control Centre खोलें: https://vishwendrasir.github.io/Home-page/owner-dashboard.html
8. Owner email/password से login करें. पहली बार मौजूदा homepage के 70 links के page switches seed होंगे.

## Module-level server-side protection
- Admin panel में Module Controls से module बनाएं.
- UI section पर data-lock-module="module-id" लगाएं.
- Sensitive records को Firestore protectedContent या courseContent में रखें. हर document में string pageId और moduleId fields अनिवार्य हैं.
- Firestore rules content तभी पढ़ने देंगे जब Master, Page और Module तीनों ON हों, या reader Owner Admin हो.

## महत्वपूर्ण सीमा
GitHub Pages की HTML, JS, images और PDFs public static assets हैं. Firebase Rules उन्हें direct GitHub Pages URL से block नहीं कर सकते. site-lock.js केवल browser UI gate देता है; इसे bypass किया जा सकता है. Confidential answer keys, paid files या secrets public repo में न रखें. पूर्ण private page/file delivery के लिए files को authenticated server-side hosting/proxy पर migrate करना होगा.

## Owner bootstrap सुरक्षा
admins/{uid} document client से create नहीं हो सकता. इसे Firebase Console से manually बनाएं. Firebase Web API key public client config होती है; वास्तविक access control Authentication और Firestore Rules लागू करते हैं.
