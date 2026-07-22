// =========================================================================
// Quanta Reach Solutions - Blog Service (Enterprise-Grade Safe-Type)
// =========================================================================
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '/src/lib/firebase.js';
import { toMillis } from '/src/lib/sortUtils.js';
const COLLECTION_NAME = 'blogPosts';
/**
 * CREATE NEW BLOG POST (Admin Action)
 * ইনপুট হিসেবে সুনির্দিষ্টভাবে BlogFormInput টাইপ গ্রহণ করবে।
 */
export const createBlogPost = async (data) => {
    try {
        const blogRef = collection(db, COLLECTION_NAME);
        // ডাটাবেসে সেভ করার আগে অটোমেটেড ফিল্ডগুলো এখানে যোগ করা হচ্ছে
        const finalData = {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            publishedAt: data.status === 'Published' ? serverTimestamp() : null
        };
        const docRef = await addDoc(blogRef, finalData);
        return docRef.id;
    }
    catch (error) {
        console.error('Error creating blog post:', error);
        throw error;
    }
};
/**
 * UPDATE BLOG POST (Admin Action)
 * এটি পার্শিয়াল ইনপুট হিসেবে Partial<BlogFormInput> গ্রহণ করবে।
 */
export const updateBlogPost = async (id, updates) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const finalUpdates = {
            ...updates,
            updatedAt: serverTimestamp()
        };
        // যদি স্ট্যাটাস পরিবর্তন করে Published করা হয়, তবেই publishedAt আপডেট হবে
        if (updates.status === 'Published') {
            finalUpdates.publishedAt = serverTimestamp();
        }
        await updateDoc(docRef, finalUpdates);
    }
    catch (error) {
        console.error('Error updating blog post:', error);
        throw error;
    }
};
/**
 * GET ALL BLOG POSTS (Public/Admin)
 */
export const getBlogPosts = async (options) => {
    try {
        const blogRef = collection(db, COLLECTION_NAME);
        const requestedStatus = options?.status ?? 'Published';
        const postsQuery = requestedStatus === 'All'
            ? blogRef
            : query(blogRef, where('status', '==', requestedStatus));
        const querySnapshot = await getDocs(postsQuery);
        const posts = querySnapshot.docs.map(snapshot => ({
            id: snapshot.id,
            ...snapshot.data()
        }));
        const filtered = posts
            .filter(post => requestedStatus === 'All' || post.status === requestedStatus)
            .filter(post => !options?.category || post.category === options.category)
            .filter(post => !options?.featuredOnly || post.isFeatured)
            .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
        return options?.limitCount ? filtered.slice(0, Math.max(0, options.limitCount)) : filtered;
    }
    catch (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
    }
};
/**
 * GET BLOG POST BY SLUG
 */
export const getBlogPostBySlug = async (slug) => {
    try {
        const blogRef = collection(db, COLLECTION_NAME);
        const q = query(blogRef, where('status', '==', 'Published'));
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
        console.error('Error fetching blog post by slug:', error);
        throw error;
    }
};
/**
 * DELETE BLOG POST
 */
export const deleteBlogPost = async (id) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    }
    catch (error) {
        console.error('Error deleting blog post:', error);
        throw error;
    }
};
/**
 * GET CATEGORIES (Helper)
 */
export const getBlogCategories = async () => {
    try {
        const posts = await getBlogPosts({ status: 'Published' });
        const categories = Array.from(new Set(posts.map(p => p.category)));
        return categories;
    }
    catch (error) {
        return [];
    }
};
