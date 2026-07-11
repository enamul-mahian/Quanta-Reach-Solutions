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
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * TESTIMONIAL TYPES & INTERFACES
 * মাস্টার প্রম্পটের সেকশন ২২ অনুযায়ী বিস্তারিত ডাটা স্ট্রাকচার
 */
export interface Testimonial {
  id?: string;
  clientName: string;
  company: string;
  country: string;
  clientType: 'Local' | 'Global';
  photo?: string; // Cloudinary URL
  companyLogo?: string; // Cloudinary URL
  rating: number; // ১ থেকে ৫ এর মধ্যে
  content: {
    en: string;
    bn: string;
  };
  serviceName: string; // যে সার্ভিসের জন্য রিভিউ দিয়েছেন
  projectLink?: string; // সম্পন্ন হওয়া প্রজেক্টের লিঙ্ক
  videoUrl?: string; // ভিডিও টেস্টিমোনিয়াল থাকলে তার লিঙ্ক
  isFeatured: boolean;
  isVerified: boolean; // মেটাফোর কর্তৃক ভেরিফাইড রিভিউ কি না
  status: 'Published' | 'Draft';
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const COLLECTION_NAME = 'testimonials';

/**
 * CREATE NEW TESTIMONIAL (Admin Action)
 */
export const createTestimonial = async (data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const testimonialRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(testimonialRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
};

/**
 * GET TESTIMONIALS (Public/Admin)
 * সর্টিং এবং স্ট্যাটাস অনুযায়ী ডাটা ফিল্টার করার ব্যবস্থা
 */
export const getTestimonials = async (options?: {
  featuredOnly?: boolean;
  includeDrafts?: boolean;
  limitCount?: number;
}): Promise<Testimonial[]> => {
  try {
    const testimonialRef = collection(db, COLLECTION_NAME);
    let q = query(testimonialRef, orderBy('sortOrder', 'asc'), orderBy('createdAt', 'desc'));

    if (options?.featuredOnly) {
      q = query(q, where('isFeatured', '==', true));
    }

    if (!options?.includeDrafts) {
      q = query(q, where('status', '==', 'Published'));
    }

    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Testimonial[];

    return options?.limitCount ? results.slice(0, options.limitCount) : results;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
};

/**
 * UPDATE TESTIMONIAL (Admin Action)
 */
export const updateTestimonial = async (id: string, updates: Partial<Testimonial>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
};

/**
 * DELETE TESTIMONIAL (Admin Action)
 */
export const deleteTestimonial = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
};

/**
 * QUICK TOGGLE ACTIONS
 */
export const toggleTestimonialFeatured = async (id: string, current: boolean) => {
  return updateTestimonial(id, { isFeatured: !current });
};

export const toggleTestimonialVerified = async (id: string, current: boolean) => {
  return updateTestimonial(id, { isVerified: !current });
};