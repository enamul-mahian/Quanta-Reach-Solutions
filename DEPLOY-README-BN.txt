QUANTA REACH SOLUTIONS — FINAL DELIVERY ও UPLOAD নির্দেশনা
===========================================================

এই repaired package-এ Quanta Reach Solutions-এর সম্পূর্ণ editable React/Vite
source code, আপনার দেওয়া logo, favicon/PWA assets, responsive public website,
admin/client routes, Firebase/Cloudinary integration hooks এবং shared-hosting SPA
route fallback রাখা হয়েছে।

সবচেয়ে সহজ Upload পদ্ধতি (Recommended)
---------------------------------------
1. "Quanta-Reach-Solutions-Upload-Ready.zip" ব্যবহার করুন।
2. Hosting File Manager থেকে domain-এর public_html folder খুলুন।
3. পুরোনো website-এর backup নিন।
4. ZIP-টি public_html-এ upload করে Extract করুন।
5. Extract হওয়ার পরে অবশ্যই নিচের structure সরাসরি public_html-এ থাকতে হবে:

   public_html/index.html
   public_html/.htaccess
   public_html/assets/
   public_html/src/
   public_html/runtime-config.js

6. public_html-এর ভিতরে আবার আলাদা dist বা Quanta-Reach-Solutions folder যেন
   তৈরি না থাকে। হয়ে থাকলে তার ভিতরের সব file public_html root-এ move করুন।
7. Browser cache/CDN cache clear করে website খুলুন।

Upload-ready package সম্পর্কে
-----------------------------
- এটি browser-ready ES module build; নতুন করে npm/Node build না করেও upload করা যাবে।
- React এবং অন্যান্য pinned frontend libraries esm.sh CDN থেকে load হয় এবং
  React Quill stylesheet jsDelivr থেকে load হয়। তাই visitor-এর internet/network
  থেকে এই CDN domain দুটো accessible থাকতে হবে।
- Website-এর public pages backend ছাড়াও load হবে।
- Firebase configure না থাকলে Contact/Quote form ভাঙবে না; pre-filled email
  compose fallback খুলবে।
- Admin login, CMS data, Firestore form storage এবং Firebase-backed client portal
  চালাতে নিজের Firebase Web App configuration দিতে হবে।

Runtime Firebase/Cloudinary Setup (Build ছাড়াই)
-----------------------------------------------
public_html/runtime-config.js edit করে আপনার public web values বসান:

- VITE_SITE_URL
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_MEASUREMENT_ID (optional)
- VITE_CLOUDINARY_CLOUD_NAME (optional)
- VITE_CLOUDINARY_UPLOAD_PRESET (optional, unsigned preset)

কখনো Firebase Admin credential, service-account JSON, private key,
Cloudinary API Secret বা অন্য server secret runtime-config.js-এ দেবেন না।

Editable Source থেকে Standard Vite Build
-----------------------------------------
1. "Quanta-Reach-Solutions-Fixed-Source.zip" Extract করুন।
2. Windows computer-এ Node.js LTS install করুন।
3. Project folder-এর BUILD-AND-PACK-WINDOWS.cmd Double Click করুন।
4. Script .env তৈরি, dependency install, typecheck, production build এবং
   Quanta-Reach-Solutions-Upload.zip তৈরি করবে।
5. তৈরি ZIP-এর ভিতরের files public_html root-এ upload করুন।

Manual commands:
  npm ci
  npm run typecheck
  npm run build

Vercel / Netlify
----------------
- Build command: npm run build
- Output directory: dist
- Node.js: current LTS
- SPA fallback-এর জন্য vercel.json এবং public/_redirects দেওয়া আছে।

গুরুত্বপূর্ণ পরীক্ষা
-------------------
- Home, About, Services, Portfolio, Blog, Contact, Quote এবং legal pages খুলুন।
- Mobile menu, bottom navigation, logo, animations এবং detail-page routes পরীক্ষা করুন।
- Firebase দিলে login/admin/Firestore rules এবং user roles পরীক্ষা করুন।
- Cloudinary unsigned preset ব্যবহার করলে allowed formats/size এবং folder policy দিন।
