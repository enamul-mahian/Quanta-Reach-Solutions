import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '/src/lib/firebase.js';
const COLLECTION_NAME = 'businessTargets';
/**
 * CREATE NEW TARGET (Admin/Management Action)
 */
export const createBusinessTarget = async (data) => {
    try {
        const targetRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(targetRef, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    }
    catch (error) {
        console.error('Error creating business target:', error);
        throw new Error('Failed to create target');
    }
};
/**
 * GET ALL TARGETS
 * পিরিয়ড বা স্ট্যাটাস অনুযায়ী ফিল্টার করার সুবিধা।
 */
export const getBusinessTargets = async (filters) => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const targets = querySnapshot.docs.map(snapshot => ({
            id: snapshot.id,
            ...snapshot.data()
        }));
        return targets
            .filter(target => !filters?.period || filters.period === 'All' || target.period === filters.period)
            .filter(target => !filters?.status || filters.status === 'All' || target.status === filters.status)
            .sort((a, b) => (a.deadline || '').localeCompare(b.deadline || ''));
    }
    catch (error) {
        console.error('Error fetching business targets:', error);
        throw error;
    }
};
/**
 * UPDATE TARGET PROGRESS
 * অ্যাচিভমেন্ট, স্ট্যাটাস এবং অ্যাকশন আইটেম আপডেট করার জন্য।
 */
export const updateBusinessTarget = async (id, updates) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    }
    catch (error) {
        console.error('Error updating business target:', error);
        throw error;
    }
};
/**
 * DELETE TARGET
 */
export const deleteBusinessTarget = async (id) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    }
    catch (error) {
        console.error('Error deleting business target:', error);
        throw error;
    }
};
/**
 * HELPER: CALCULATE PROGRESS PERCENTAGE
 * ফ্রন্টএন্ডে প্রগ্রেস বার দেখানোর জন্য গাণিতিক ফাংশন
 */
export const calculateTargetProgress = (achieved, target) => {
    if (target <= 0)
        return 0;
    const percentage = (achieved / target) * 100;
    return Math.min(Math.max(percentage, 0), 100); // 0 থেকে 100 এর মধ্যে সীমাবদ্ধ রাখা
};
