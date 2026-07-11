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
 * PRICING TYPES & INTERFACES
 * মাস্টার প্রম্পটের সেকশন ১৮ অনুযায়ী বিস্তারিত কাঠামো
 */
export interface PricingFeature {
  text: { en: string; bn: string };
  included: boolean;
}

export interface PricingPackage {
  id?: string;
  name: { en: string; bn: string };
  description: { en: string; bn: string };
  priceBDT: number;
  priceUSD: number;
  pricingType: 'Fixed' | 'Starting From' | 'Custom' | 'Monthly Retainer';
  
  // সুবিধাসমূহ (Bilingual List)
  features: PricingFeature[];
  
  // ডেলিভারি এবং সাপোর্ট প্যারামিটার
  deliveryTime: { en: string; bn: string };
  revisionLimit: string; // যেমন: "Unlimited" বা "5 Times"
  supportPeriod: { en: string; bn: string };
  
  // এভেইলঅ্যাবিলিটি এবং ব্যাজ
  availability: 'Local' | 'Global' | 'Both';
  isRecommended: boolean;
  ctaLabel: { en: string; bn: string };
  
  // মেটা এবং স্ট্যাটাস
  status: 'Active' | 'Inactive';
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const COLLECTION_NAME = 'pricingPackages';

/**
 * CREATE NEW PRICING PACKAGE (Admin Action)
 */
export const createPricingPackage = async (data: Omit<PricingPackage, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const pricingRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(pricingRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating pricing package:', error);
    throw error;
  }
};

/**
 * GET PRICING PACKAGES (Public/Admin)
 * কারেন্সি এবং মার্কেট টাইপ অনুযায়ী ফিল্টার করার সুবিধা
 */
export const getPricingPackages = async (options?: {
  market?: 'Local' | 'Global';
  includeInactive?: boolean;
}): Promise<PricingPackage[]> => {
  try {
    const pricingRef = collection(db, COLLECTION_NAME);
    let q = query(pricingRef, orderBy('sortOrder', 'asc'));

    // যদি শুধু একটিভ প্যাকেজ প্রয়োজন হয়
    if (!options?.includeInactive) {
      q = query(q, where('status', '==', 'Active'));
    }

    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PricingPackage[];

    // মার্কেট ফিল্টারিং (Local, Global বা Both)
    if (options?.market) {
      return results.filter(pkg => 
        pkg.availability === options.market || pkg.availability === 'Both'
      );
    }

    return results;
  } catch (error) {
    console.error('Error fetching pricing packages:', error);
    throw error;
  }
};

/**
 * UPDATE PRICING PACKAGE (Admin Action)
 */
export const updatePricingPackage = async (id: string, updates: Partial<PricingPackage>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating pricing package:', error);
    throw error;
  }
};

/**
 * DELETE PRICING PACKAGE (Admin Action)
 */
export const deletePricingPackage = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting pricing package:', error);
    throw error;
  }
};

/**
 * QUICK STATUS & RECOMMENDATION TOGGLE
 */
export const togglePackageStatus = async (id: string, currentStatus: 'Active' | 'Inactive') => {
  return updatePricingPackage(id, { status: currentStatus === 'Active' ? 'Inactive' : 'Active' });
};

export const togglePackageRecommended = async (id: string, currentStatus: boolean) => {
  return updatePricingPackage(id, { isRecommended: !currentStatus });
};