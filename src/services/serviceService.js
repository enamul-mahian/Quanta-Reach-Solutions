import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '/src/lib/firebase.js';
import { safeNumber } from '/src/lib/sortUtils.js';
const COLLECTION_NAME = 'services';
/**
 * CREATE NEW SERVICE (Admin Action)
 */
export const createService = async (data) => {
    try {
        const serviceRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(serviceRef, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    }
    catch (error) {
        console.error('Error creating service:', error);
        throw error;
    }
};
/**
 * GET ALL SERVICES (Public/Admin)
 * sorting এবং status ফিল্টার করার ব্যবস্থা রাখা হয়েছে।
 */
export const getServices = async (includeDrafts = false) => {
    try {
        const servicesRef = collection(db, COLLECTION_NAME);
        const servicesQuery = includeDrafts
            ? servicesRef
            : query(servicesRef, where('status', '==', 'Published'));
        const querySnapshot = await getDocs(servicesQuery);
        const services = querySnapshot.docs.map(snapshot => ({
            id: snapshot.id,
            ...snapshot.data()
        }));
        return services
            .filter(service => includeDrafts || service.status === 'Published')
            .sort((a, b) => safeNumber(a.sortOrder) - safeNumber(b.sortOrder));
    }
    catch (error) {
        console.error('Error fetching services:', error);
        throw error;
    }
};
/**
 * GET SERVICE BY SLUG (Public Action)
 * ইউজার যখন ডিটেইলস পেজে ভিজিট করবে।
 */
export const getServiceBySlug = async (slug) => {
    try {
        const servicesRef = collection(db, COLLECTION_NAME);
        const q = query(servicesRef, where('status', '==', 'Published'));
        const querySnapshot = await getDocs(q);
        const match = querySnapshot.docs.find(snapshot => {
            const data = snapshot.data();
            return data.status === 'Published' && data.slug === slug;
        });
        if (match) {
            return { id: match.id, ...match.data() };
        }
        return null;
    }
    catch (error) {
        console.error('Error fetching service by slug:', error);
        throw error;
    }
};
/**
 * UPDATE SERVICE (Admin Action)
 */
export const updateService = async (id, updates) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    }
    catch (error) {
        console.error('Error updating service:', error);
        throw error;
    }
};
/**
 * DELETE SERVICE (Admin Action)
 */
export const deleteService = async (id) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    }
    catch (error) {
        console.error('Error deleting service:', error);
        throw error;
    }
};
/**
 * TOGGLE FEATURED STATUS
 */
export const toggleFeatured = async (id, currentStatus) => {
    return updateService(id, { isFeatured: !currentStatus });
};
