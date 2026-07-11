import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * LEGAL PAGE TYPES & INTERFACES
 * মাস্টার প্রম্পটের সেকশন ২৬ অনুযায়ী ডাটা স্ট্রাকচার
 */
export type LegalPageType = 
  | 'privacy-policy' 
  | 'terms-and-conditions' 
  | 'refund-policy' 
  | 'nda-and-confidentiality';

export interface LegalPageData {
  id?: string;
  type: LegalPageType;
  title: { en: string; bn: string };
  content: { en: string; bn: string }; // Rich Text HTML
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  status: 'Published' | 'Draft';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = 'legalPages';

/**
 * GET A SPECIFIC LEGAL PAGE (Public/Admin)
 * ইউজার যখন /legal/privacy-policy পেজে ভিজিট করবে, তখন এই ফাংশন কল হবে।
 */
export const getLegalPage = async (type: LegalPageType): Promise<LegalPageData | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, type);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as LegalPageData;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching legal page (${type}):`, error);
    throw error;
  }
};

/**
 * GET ALL LEGAL PAGES (Admin Action)
 * অ্যাডমিন প্যানেলে লিস্ট দেখানোর জন্য।
 */
export const getAllLegalPages = async (): Promise<LegalPageData[]> => {
  try {
    const pagesRef = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(pagesRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LegalPageData[];
  } catch (error) {
    console.error('Error fetching all legal pages:', error);
    throw error;
  }
};

/**
 * UPDATE OR CREATE LEGAL PAGE (Admin Action)
 * setDoc ব্যবহার করা হয়েছে কারণ ডকুমেন্ট আইডিগুলো (type) ফিক্সড।
 * ডকুমেন্ট না থাকলে নতুন করে তৈরি হবে, থাকলে আপডেট হবে।
 */
export const updateLegalPage = async (
  type: LegalPageType, 
  data: Partial<Omit<LegalPageData, 'id' | 'type' | 'updatedAt'>>
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, type);
    
    // পেজটি আগে থেকে আছে কি না চেক করা
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // যদি থাকে, শুধু আপডেট করা
      await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } else {
      // যদি না থাকে, নতুন করে তৈরি করা
      await setDoc(docRef, {
        ...data,
        type, // ডকুমেন্ট আইডেন্টিফায়ার
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error(`Error updating legal page (${type}):`, error);
    throw error;
  }
};