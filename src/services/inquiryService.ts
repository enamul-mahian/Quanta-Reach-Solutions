import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * INQUIRY TYPES & INTERFACES
 * মাস্টার প্রম্পটের রিকোয়ারমেন্ট অনুযায়ী সব ফিল্ড এখানে সংজ্ঞায়িত করা হয়েছে।
 */
export type InquiryStatus = 
  | 'New' 
  | 'Contacted' 
  | 'Qualified' 
  | 'Proposal Sent' 
  | 'Negotiation' 
  | 'Won' 
  | 'Lost' 
  | 'Archived';

export interface ProjectInquiry {
  id?: string;
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  country: string;
  clientType: 'Local' | 'Global';
  preferredLanguage: 'en' | 'bn';
  preferredContactMethod: 'Email' | 'WhatsApp' | 'Phone';
  requiredServices: string[]; // মাল্টিপল সার্ভিস সিলেক্ট করার অপশন
  projectType: string;
  estimatedBudget: string;
  currency: 'BDT' | 'USD';
  expectedTimeline: string;
  projectDescription: string;
  referenceLinks?: string;
  fileUrl?: string; // Cloudinary থেকে প্রাপ্ত URL
  ndaRequired: boolean;
  meetingRequired: boolean;
  consent: boolean;
  status: InquiryStatus;
  adminNotes?: string;
  priority: 'Low' | 'Medium' | 'High';
  assignedTo?: string;
  followUpDate?: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const COLLECTION_NAME = 'projectInquiries';

/**
 * SUBMIT INQUIRY (Public Action)
 * ব্যবহারকারী যখন কন্টাক্ট বা কোটেশন ফর্ম সাবমিট করবেন।
 */
export const submitInquiry = async (data: Omit<ProjectInquiry, 'id' | 'status' | 'priority' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const inquiryRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(inquiryRef, {
      ...data,
      status: 'New',
      priority: 'Medium',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    throw new Error('Failed to submit inquiry. Please try again later.');
  }
};

/**
 * GET ALL INQUIRIES (Admin Action)
 * অ্যাডমিন প্যানেলের লিড টেবিলের জন্য সব ইনকোয়ারি রিট্রিভ করা।
 */
export const getAllInquiries = async (): Promise<ProjectInquiry[]> => {
  try {
    const inquiryRef = collection(db, COLLECTION_NAME);
    const q = query(inquiryRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ProjectInquiry[];
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    throw error;
  }
};

/**
 * UPDATE INQUIRY STATUS (Admin Action)
 * লিডের স্ট্যাটাস পরিবর্তন করা (যেমন: New -> Contacted)।
 */
export const updateInquiryStatus = async (id: string, status: InquiryStatus): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    throw error;
  }
};

/**
 * ADD ADMIN NOTES (Admin Action)
 * নির্দিষ্ট লিড সম্পর্কে অ্যাডমিনের ব্যক্তিগত নোট রাখা।
 */
export const updateInquiryDetails = async (id: string, updates: Partial<ProjectInquiry>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating inquiry details:', error);
    throw error;
  }
};

/**
 * DELETE INQUIRY (Admin Action)
 * ডাটাবেস থেকে ইনকোয়ারি রিমুভ করা।
 */
export const deleteInquiry = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    throw error;
  }
};

/**
 * GET INQUIRY BY ID
 * নির্দিষ্ট কোনো লিডের বিস্তারিত দেখার জন্য।
 */
export const getInquiryById = async (id: string): Promise<ProjectInquiry | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ProjectInquiry;
    }
    return null;
  } catch (error) {
    console.error('Error fetching inquiry by ID:', error);
    throw error;
  }
};