import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '/src/lib/firebase.js';
import { safeNumber, toMillis } from '/src/lib/sortUtils.js';
const COLLECTION_NAME = 'testimonials';
/**
 * CREATE NEW TESTIMONIAL (Admin Action)
 */
export const createTestimonial = async (data) => {
    try {
        const testimonialRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(testimonialRef, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    }
    catch (error) {
        console.error('Error creating testimonial:', error);
        throw error;
    }
};
/**
 * GET TESTIMONIALS (Public/Admin)
 * সর্টিং এবং স্ট্যাটাস অনুযায়ী ডাটা ফিল্টার করার ব্যবস্থা
 */
export const getTestimonials = async (options) => {
    try {
        const testimonialRef = collection(db, COLLECTION_NAME);
        const testimonialQuery = options?.includeDrafts
            ? testimonialRef
            : query(testimonialRef, where('status', '==', 'Published'));
        const querySnapshot = await getDocs(testimonialQuery);
        const results = querySnapshot.docs.map(snapshot => ({
            id: snapshot.id,
            ...snapshot.data()
        }));
        const filtered = results
            .filter(item => !options?.featuredOnly || item.isFeatured)
            .filter(item => options?.includeDrafts || item.status === 'Published')
            .sort((a, b) => {
            const sortDifference = safeNumber(a.sortOrder) - safeNumber(b.sortOrder);
            return sortDifference !== 0 ? sortDifference : toMillis(b.createdAt) - toMillis(a.createdAt);
        });
        return options?.limitCount ? filtered.slice(0, Math.max(0, options.limitCount)) : filtered;
    }
    catch (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
    }
};
/**
 * UPDATE TESTIMONIAL (Admin Action)
 */
export const updateTestimonial = async (id, updates) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    }
    catch (error) {
        console.error('Error updating testimonial:', error);
        throw error;
    }
};
/**
 * DELETE TESTIMONIAL (Admin Action)
 */
export const deleteTestimonial = async (id) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    }
    catch (error) {
        console.error('Error deleting testimonial:', error);
        throw error;
    }
};
/**
 * QUICK TOGGLE ACTIONS
 */
export const toggleTestimonialFeatured = async (id, current) => {
    return updateTestimonial(id, { isFeatured: !current });
};
export const toggleTestimonialVerified = async (id, current) => {
    return updateTestimonial(id, { isVerified: !current });
};
