import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseReady } from '/src/lib/firebase.js';
const COLLECTION_NAME = 'projectInquiries';
/**
 * SUBMIT INQUIRY (Public Action)
 * ব্যবহারকারী যখন কন্টাক্ট বা কোটেশন ফর্ম সাবমিট করবেন।
 */
export const submitInquiry = async (data) => {
    if (!isFirebaseReady()) {
        throw new Error('Firebase is not configured for inquiry storage.');
    }
    try {
        const inquiryRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(inquiryRef, {
            ...data,
            status: 'New',
            priority: 'Medium',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    }
    catch (error) {
        console.error('Error submitting inquiry:', error);
        throw new Error('Failed to submit inquiry. Please try again later.');
    }
};
/**
 * GET ALL INQUIRIES (Admin Action)
 * অ্যাডমিন প্যানেলের লিড টেবিলের জন্য সব ইনকোয়ারি রিট্রিভ করা।
 */
export const getAllInquiries = async () => {
    try {
        const inquiryRef = collection(db, COLLECTION_NAME);
        const q = query(inquiryRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }
    catch (error) {
        console.error('Error fetching inquiries:', error);
        throw error;
    }
};
/**
 * UPDATE INQUIRY STATUS (Admin Action)
 * লিডের স্ট্যাটাস পরিবর্তন করা (যেমন: New -> Contacted)।
 */
export const updateInquiryStatus = async (id, status) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            status,
            updatedAt: serverTimestamp()
        });
    }
    catch (error) {
        console.error('Error updating inquiry status:', error);
        throw error;
    }
};
/**
 * ADD ADMIN NOTES (Admin Action)
 * নির্দিষ্ট লিড সম্পর্কে অ্যাডমিনের ব্যক্তিগত নোট রাখা।
 */
export const updateInquiryDetails = async (id, updates) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    }
    catch (error) {
        console.error('Error updating inquiry details:', error);
        throw error;
    }
};
/**
 * DELETE INQUIRY (Admin Action)
 * ডাটাবেস থেকে ইনকোয়ারি রিমুভ করা।
 */
export const deleteInquiry = async (id) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    }
    catch (error) {
        console.error('Error deleting inquiry:', error);
        throw error;
    }
};
/**
 * GET INQUIRY BY ID
 * নির্দিষ্ট কোনো লিডের বিস্তারিত দেখার জন্য।
 */
export const getInquiryById = async (id) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    }
    catch (error) {
        console.error('Error fetching inquiry by ID:', error);
        throw error;
    }
};
