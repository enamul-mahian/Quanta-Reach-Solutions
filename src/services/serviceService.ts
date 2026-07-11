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
 * SERVICE TYPES & INTERFACES
 * মাস্টার প্রম্পটের রিকোয়ারমেন্ট অনুযায়ী বিস্তারিত স্কিমা
 */
export interface ServiceFAQ {
  question: { en: string; bn: string };
  answer: { en: string; bn: string };
}

export interface ServiceData {
  id?: string;
  title: { en: string; bn: string };
  slug: string; // URL ফ্রেন্ডলি ইউনিক আইডি
  shortDescription: { en: string; bn: string };
  fullContent: { en: string; bn: string };
  icon: string; // Lucide আইকন নাম
  coverImage: string; // Cloudinary URL
  gallery: string[]; // Cloudinary URLs
  keyBenefits: { en: string[]; bn: string[] };
  deliverables: { en: string[]; bn: string[] };
  process: { en: string[]; bn: string[] };
  timeline: string;
  startingPriceBDT: number;
  startingPriceUSD: number;
  pricingType: 'Fixed' | 'Starting From' | 'Custom Quote' | 'Monthly Retainer';
  faqs: ServiceFAQ[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  status: 'Published' | 'Draft';
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const COLLECTION_NAME = 'services';

/**
 * CREATE NEW SERVICE (Admin Action)
 */
export const createService = async (data: Omit<ServiceData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const serviceRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(serviceRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

/**
 * GET ALL SERVICES (Public/Admin)
 * sorting এবং status ফিল্টার করার ব্যবস্থা রাখা হয়েছে।
 */
export const getServices = async (includeDrafts = false): Promise<ServiceData[]> => {
  try {
    const servicesRef = collection(db, COLLECTION_NAME);
    let q;
    
    if (includeDrafts) {
      q = query(servicesRef, orderBy('sortOrder', 'asc'));
    } else {
      q = query(
        servicesRef, 
        where('status', '==', 'Published'),
        orderBy('sortOrder', 'asc')
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ServiceData[];
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

/**
 * GET SERVICE BY SLUG (Public Action)
 * ইউজার যখন ডিটেইলস পেজে ভিজিট করবে।
 */
export const getServiceBySlug = async (slug: string): Promise<ServiceData | null> => {
  try {
    const servicesRef = collection(db, COLLECTION_NAME);
    const q = query(servicesRef, where('slug', '==', slug), where('status', '==', 'Published'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as ServiceData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching service by slug:', error);
    throw error;
  }
};

/**
 * UPDATE SERVICE (Admin Action)
 */
export const updateService = async (id: string, updates: Partial<ServiceData>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

/**
 * DELETE SERVICE (Admin Action)
 */
export const deleteService = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

/**
 * TOGGLE FEATURED STATUS
 */
export const toggleFeatured = async (id: string, currentStatus: boolean): Promise<void> => {
  return updateService(id, { isFeatured: !currentStatus });
};