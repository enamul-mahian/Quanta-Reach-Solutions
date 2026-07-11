// =========================================================================
// MetaFore Technologies - Blog Service (Enterprise-Grade Safe-Type)
// =========================================================================

import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  limit
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * 01. BLOG FORM INPUT INTERFACE
 * এটি সরাসরি ফর্ম থেকে ইনপুট নেওয়ার জন্য তৈরি টাইপ।
 * এখানে ডাটাবেসের নিজস্ব টাইমস্ট্যাম্প বা আইডি থাকবে না, যার ফলে টাইপ এরর হওয়ার সুযোগ থাকবে না।
 */
export interface BlogFormInput {
  title: { en: string; bn: string };
  slug: string;
  excerpt: { en: string; bn: string };
  content: { en: string; bn: string };
  coverImage: string;
  author: {
    name: string;
    photo?: string;
    id: string;
  };
  category: string;
  tags: string[];
  readingTime: { en: string; bn: string };
  isFeatured: boolean;
  relatedPostIds: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  status: 'Published' | 'Draft';
}

/**
 * 02. DATABASE BLOG POST INTERFACE
 * ডাটাবেস থেকে ডাটা পড়ার সময় এই ইন্টারফেস ব্যবহৃত হবে (এটি ইনপুট ইন্টারফেসকে এক্সটেন্ড করে)।
 */
export interface BlogPost extends BlogFormInput {
  id?: string;
  publishedAt?: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const COLLECTION_NAME = 'blogPosts';

/**
 * CREATE NEW BLOG POST (Admin Action)
 * ইনপুট হিসেবে সুনির্দিষ্টভাবে BlogFormInput টাইপ গ্রহণ করবে।
 */
export const createBlogPost = async (data: BlogFormInput): Promise<string> => {
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
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

/**
 * UPDATE BLOG POST (Admin Action)
 * এটি পার্শিয়াল ইনপুট হিসেবে Partial<BlogFormInput> গ্রহণ করবে।
 */
export const updateBlogPost = async (id: string, updates: Partial<BlogFormInput>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    
    const finalUpdates: any = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    // যদি স্ট্যাটাস পরিবর্তন করে Published করা হয়, তবেই publishedAt আপডেট হবে
    if (updates.status === 'Published') {
      finalUpdates.publishedAt = serverTimestamp();
    }

    await updateDoc(docRef, finalUpdates);
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

/**
 * GET ALL BLOG POSTS (Public/Admin)
 */
export const getBlogPosts = async (options?: {
  status?: 'Published' | 'Draft' | 'All';
  category?: string;
  featuredOnly?: boolean;
  limitCount?: number;
}): Promise<BlogPost[]> => {
  try {
    const blogRef = collection(db, COLLECTION_NAME);
    let q = query(blogRef, orderBy('createdAt', 'desc'));

    if (options?.status && options.status !== 'All') {
      q = query(q, where('status', '==', options.status));
    } else if (!options?.status) {
      q = query(q, where('status', '==', 'Published'));
    }

    if (options?.category) {
      q = query(q, where('category', '==', options.category));
    }

    if (options?.featuredOnly) {
      q = query(q, where('isFeatured', '==', true));
    }

    if (options?.limitCount) {
      q = query(q, limit(options.limitCount));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BlogPost[];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
};

/**
 * GET BLOG POST BY SLUG
 */
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const blogRef = collection(db, COLLECTION_NAME);
    const q = query(blogRef, where('slug', '==', slug), where('status', '==', 'Published'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as BlogPost;
    }
    return null;
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    throw error;
  }
};

/**
 * DELETE BLOG POST
 */
export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

/**
 * GET CATEGORIES (Helper)
 */
export const getBlogCategories = async (): Promise<string[]> => {
  try {
    const posts = await getBlogPosts({ status: 'Published' });
    const categories = Array.from(new Set(posts.map(p => p.category)));
    return categories;
  } catch (error) {
    return [];
  }
};