// firebase.js (BROWSER VERSION — REQUIRED)

import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getAuth } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { getFirestore } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBAdbChWe9UfMXoLilIMvEdzrjoDsuO2WY",
    authDomain: "tcare-6a1bd.firebaseapp.com",
    projectId: "tcare-6a1bd",
    storageBucket: "tcare-6a1bd.firebasestorage.app",
    messagingSenderId: "734658745627",
    appId: "1:734658745627:web:ce246959cecc025a586fbe",
    measurementId: "G-KVBLLWQ7GK"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
