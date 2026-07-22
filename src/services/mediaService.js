import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '/src/lib/firebase.js';
import { toMillis } from '/src/lib/sortUtils.js';
const COLLECTION_NAME = 'mediaLibrary';
/**
 * SAVE MEDIA RECORD TO FIRESTORE
 * ক্লাউডিনারিতে আপলোড হওয়ার পর তার রেফারেন্স ফায়ারস্টোরে সেভ করা।
 */
export const saveMediaRecord = async (data) => {
    try {
        const mediaRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(mediaRef, {
            ...data,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    }
    catch (error) {
        console.error('Error saving media record:', error);
        throw error;
    }
};
/**
 * GET ALL MEDIA FILES
 * ফাইল টাইপ বা ফোল্ডার অনুযায়ী ফিল্টার করার সুবিধা।
 */
export const getAllMedia = async (filters) => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const files = querySnapshot.docs.map(snapshot => ({
            id: snapshot.id,
            ...snapshot.data()
        }));
        return files
            .filter(file => !filters?.resourceType || filters.resourceType === 'All' || file.resourceType === filters.resourceType)
            .filter(file => !filters?.folder || file.folder === filters.folder)
            .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
    }
    catch (error) {
        console.error('Error fetching media library:', error);
        throw error;
    }
};
/**
 * UPDATE MEDIA METADATA
 * Title এবং Alt Text আপডেট করার জন্য।
 */
export const updateMediaMetadata = async (id, updates) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, updates);
    }
    catch (error) {
        console.error('Error updating media metadata:', error);
        throw error;
    }
};
/**
 * CHECK MEDIA USAGE (Reference Warning System)
 * মাস্টার প্রম্পটের সেকশন ২৯ অনুযায়ী, কোনো ছবি ডিলিট করার আগে
 * সেটি ব্লগ, পোর্টফোলিও বা সার্ভিসে ব্যবহৃত হচ্ছে কি না তা চেক করা।
 */
export const checkMediaUsage = async (url) => {
    try {
        const collectionsToCheck = [
            { name: 'blogPosts', field: 'coverImage' },
            { name: 'services', field: 'coverImage' },
            { name: 'portfolioProjects', field: 'coverImage' },
            { name: 'teamMembers', field: 'photo' }
        ];
        for (const coll of collectionsToCheck) {
            const q = query(collection(db, coll.name), where(coll.field, '==', url));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                return true; // Used somewhere
            }
        }
        return false; // Safe to delete
    }
    catch (error) {
        console.error('Error checking media usage:', error);
        return false; // Fallback
    }
};
/**
 * DELETE MEDIA RECORD
 * ফায়ারস্টোর থেকে রেকর্ড মুছে ফেলা।
 * (নোট: ক্লাউডিনারি সার্ভার থেকে ফিজিক্যালি ডিলিট করতে হলে Cloudinary Admin API প্রয়োজন,
 * তাই আমরা শুধুমাত্র ডাটাবেসের ক্যাটালগ থেকে এটি রিমুভ করব)।
 */
export const deleteMediaRecord = async (id, url) => {
    try {
        // ডিলিট করার আগে রেফারেন্স চেক
        const isUsed = await checkMediaUsage(url);
        if (isUsed) {
            throw new Error('USAGE_WARNING: This media is currently linked to an active content (Blog/Service/Portfolio). Please remove it from there before deleting.');
        }
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    }
    catch (error) {
        console.error('Error deleting media:', error);
        throw error;
    }
};
