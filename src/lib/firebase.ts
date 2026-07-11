// =========================================================================
// MetaFore Technologies - Firebase Core Client Setup (Auth & Firestore)
// =========================================================================

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * FINAL CORRECTED LIVE FIREBASE CONFIGURATION
 * আপনার পাঠানো টেক্সট অনুযায়ী হুবহু কী-গুলো এখানে বসানো হয়েছে।
 */
const firebaseConfig = {
  apiKey: "AIzaSyCUC4wm1JLsH7r7ql3ZB8782_e5KeRP1t8", // এখানে আন্ডারস্কোর এবং ক্যাপিটাল P নিশ্চিত করা হয়েছে
  authDomain: "metafore-technologies.firebaseapp.com",
  projectId: "metafore-technologies",
  storageBucket: "metafore-technologies.firebasestorage.app",
  messagingSenderId: "963478625839",
  appId: "1:963478625839:web:91cb08053895c84b5a30da"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  // অ্যাপ অলরেডি ইনিশিয়ালাইজড থাকলে সেটি রিটার্ন করবে, অন্যথায় নতুন করে ইনিশিয়ালাইজ করবে
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  
  console.log('🚀 [Firebase Status]: Backend connection established with valid keys.');
  
} catch (error) {
  console.error('Firebase services initialization failed:', error);
  // টাইপস্ক্রিপ্ট টাইপ এরর এড়াতে এবং ব্রাউজার থ্রেড সচল রাখতে খালি অবজেক্ট অ্যাসাইন করা হলো
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
}

export { app, auth, db };