import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '/src/lib/firebase.js';
// ফিক্সড ডকুমেন্ট আইডি (যেহেতু পুরো ওয়েবসাইটের একটাই গ্লোবাল সেটিংস থাকবে)
const COLLECTION_NAME = 'websiteSettings';
const SETTINGS_DOC_ID = 'global';
/**
 * GET WEBSITE SETTINGS (Public/Admin)
 * যদি আগে থেকে কোনো সেটিংস না থাকে, তবে নাল (null) রিটার্ন করবে।
 */
export const getWebsiteSettings = async () => {
    try {
        const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    }
    catch (error) {
        console.error('Error fetching website settings:', error);
        throw error;
    }
};
/**
 * UPDATE OR CREATE WEBSITE SETTINGS (Admin Action)
 * setDoc(..., { merge: true }) ব্যবহার করা হয়েছে যাতে ডকুমেন্ট না থাকলে তৈরি হয়,
 * আর থাকলে শুধু আপডেট করা অংশটুকু চেঞ্জ হয়।
 */
export const updateWebsiteSettings = async (updates) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID);
        await setDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp()
        }, { merge: true });
    }
    catch (error) {
        console.error('Error updating website settings:', error);
        throw error;
    }
};
