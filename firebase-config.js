/* ======================================================
   FIREBASE CONFIG
   ======================================================
   1. Go to https://console.firebase.google.com → create (or open) a project.
   2. Project settings (gear icon) → General → "Your apps" → Web app (</>).
      Copy the config object it gives you and paste the values below.
   3. In the left sidebar go to Build → Authentication → Get started →
      Sign-in method → enable "Email/Password".
   That's it — main.js already has the sign in / sign up / sign out logic
   wired up to this config.
   ====================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyASxNF8Xm5LTj0GkJV6b9a7yGGZ2_DImO4",
  authDomain: "food-website-49e5e.firebaseapp.com",
  projectId: "food-website-49e5e",
  storageBucket: "food-website-49e5e.firebasestorage.app",
  messagingSenderId: "855923115264",
  appId: "1:855923115264:web:a295f493912b8ffcf79fe5",
};

// Lets main.js show a friendly message instead of crashing if the
// placeholder values above haven't been replaced yet.
window.firebaseIsConfigured = firebaseConfig.apiKey !== "your-api-key" ;

firebase.initializeApp(firebaseConfig);
