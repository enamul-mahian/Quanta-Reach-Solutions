import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { env, isFirebaseConfigured } from '/src/lib/env.js';
const firebaseConfig = {
    apiKey: env.firebaseApiKey,
    authDomain: env.firebaseAuthDomain,
    projectId: env.firebaseProjectId,
    storageBucket: env.firebaseStorageBucket,
    messagingSenderId: env.firebaseMessagingSenderId,
    appId: env.firebaseAppId,
    measurementId: env.firebaseMeasurementId,
};
let app = {};
let auth = {};
let db = {};
let firebaseReady = false;
let firebaseInitializationError = null;
if (isFirebaseConfigured()) {
    try {
        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        auth = getAuth(app);
        db = getFirestore(app);
        firebaseReady = true;
    }
    catch (error) {
        firebaseInitializationError = error;
        console.error('[Quanta Reach] Firebase initialization failed:', error);
    }
}
else {
    firebaseInitializationError = new Error('Firebase is not configured. Copy .env.example to .env and add the Quanta Reach Firebase credentials before building.');
    console.info('[Quanta Reach] Public website loaded without Firebase. CMS, login, and form storage require environment variables.');
}
export const isFirebaseReady = () => firebaseReady;
export const getFirebaseInitializationError = () => firebaseInitializationError;
export { app, auth, db };
