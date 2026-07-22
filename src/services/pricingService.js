import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '/src/lib/firebase.js';
import { safeNumber } from '/src/lib/sortUtils.js';
const COLLECTION_NAME = 'pricingPackages';
/**
 * CREATE NEW PRICING PACKAGE (Admin Action)
 */
export const createPricingPackage = async (data) => {
    try {
        const pricingRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(pricingRef, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    }
    catch (error) {
        console.error('Error creating pricing package:', error);
        throw error;
    }
};
/**
 * GET PRICING PACKAGES (Public/Admin)
 * কারেন্সি এবং মার্কেট টাইপ অনুযায়ী ফিল্টার করার সুবিধা
 */
export const getPricingPackages = async (options) => {
    try {
        const pricingRef = collection(db, COLLECTION_NAME);
        const pricingQuery = options?.includeInactive
            ? pricingRef
            : query(pricingRef, where('status', '==', 'Active'));
        const querySnapshot = await getDocs(pricingQuery);
        const results = querySnapshot.docs.map(snapshot => ({
            id: snapshot.id,
            ...snapshot.data()
        }));
        return results
            .filter(pkg => options?.includeInactive || pkg.status === 'Active')
            .filter(pkg => !options?.market || pkg.availability === options.market || pkg.availability === 'Both')
            .sort((a, b) => safeNumber(a.sortOrder) - safeNumber(b.sortOrder));
    }
    catch (error) {
        console.error('Error fetching pricing packages:', error);
        throw error;
    }
};
/**
 * UPDATE PRICING PACKAGE (Admin Action)
 */
export const updatePricingPackage = async (id, updates) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    }
    catch (error) {
        console.error('Error updating pricing package:', error);
        throw error;
    }
};
/**
 * DELETE PRICING PACKAGE (Admin Action)
 */
export const deletePricingPackage = async (id) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    }
    catch (error) {
        console.error('Error deleting pricing package:', error);
        throw error;
    }
};
/**
 * QUICK STATUS & RECOMMENDATION TOGGLE
 */
export const togglePackageStatus = async (id, currentStatus) => {
    return updatePricingPackage(id, { status: currentStatus === 'Active' ? 'Inactive' : 'Active' });
};
export const togglePackageRecommended = async (id, currentStatus) => {
    return updatePricingPackage(id, { isRecommended: !currentStatus });
};
