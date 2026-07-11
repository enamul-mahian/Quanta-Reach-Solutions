import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * WEBSITE SETTINGS TYPES & INTERFACES
 * মাস্টার প্রম্পটের সেকশন ৩১ অনুযায়ী সম্পূর্ণ সেটিংস আর্কিটেকচার
 */

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  officeAddress: { en: string; bn: string };
  googleMapUrl: string;
  businessHours: { en: string; bn: string };
}

export interface SocialLinks {
  facebook: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  youtube: string;
}

export interface AgencyStats {
  yearsOfExperience: number;
  teamSize: number;
  projectsCompleted: number;
  clientsServed: number;
  countriesServed: number;
}

export interface AnnouncementBar {
  isActive: boolean;
  text: { en: string; bn: string };
  link: string;
}

export interface WebsiteSettingsData {
  // গ্লোবাল আইডেন্টিটি
  agencyName: string;
  tagline: { en: string; bn: string };
  websiteUrl: string;
  logo: string; // Cloudinary URL
  favicon: string; // Cloudinary URL
  
  // কন্টাক্ট এবং সোশ্যাল
  contact: ContactInfo;
  social: SocialLinks;
  
  // পরিসংখ্যান
  stats: AgencyStats;
  
  // প্রেফারেন্স ও ভিজিবিলিটি
  defaultLanguage: 'en' | 'bn';
  defaultCurrency: 'USD' | 'BDT';
  globalAvailability: boolean;
  localMeetingAvailability: boolean;
  
  // অন্যান্য
  footerContent: { en: string; bn: string };
  announcement: AnnouncementBar;
  maintenanceMode: boolean; // পুরো ওয়েবসাইট মেইনটেন্যান্স মোডে নেওয়ার জন্য
  
  updatedAt?: Timestamp;
}

// ফিক্সড ডকুমেন্ট আইডি (যেহেতু পুরো ওয়েবসাইটের একটাই গ্লোবাল সেটিংস থাকবে)
const COLLECTION_NAME = 'websiteSettings';
const SETTINGS_DOC_ID = 'global';

/**
 * GET WEBSITE SETTINGS (Public/Admin)
 * যদি আগে থেকে কোনো সেটিংস না থাকে, তবে নাল (null) রিটার্ন করবে।
 */
export const getWebsiteSettings = async (): Promise<WebsiteSettingsData | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as WebsiteSettingsData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching website settings:', error);
    throw error;
  }
};

/**
 * UPDATE OR CREATE WEBSITE SETTINGS (Admin Action)
 * setDoc(..., { merge: true }) ব্যবহার করা হয়েছে যাতে ডকুমেন্ট না থাকলে তৈরি হয়, 
 * আর থাকলে শুধু আপডেট করা অংশটুকু চেঞ্জ হয়।
 */
export const updateWebsiteSettings = async (updates: Partial<WebsiteSettingsData>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID);
    await setDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating website settings:', error);
    throw error;
  }
};