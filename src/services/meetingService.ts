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
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * MEETING BOOKING TYPES & INTERFACES
 * মাস্টার প্রম্পটের সেকশন ২০ অনুযায়ী সম্পূর্ণ ডাটা স্ট্রাকচার
 */

export type MeetingStatus = 'Pending' | 'Approved' | 'Rescheduled' | 'Rejected' | 'Completed';
export type MeetingType = 'Online' | 'Office';

export interface MeetingRequest {
  id?: string;
  clientName: string;
  companyName?: string;
  email: string;
  phone: string;
  clientType: 'Local' | 'Global';
  preferredLanguage: 'en' | 'bn';
  meetingType: MeetingType;
  preferredDate: string; // ISO Date String or Formatted Date
  preferredTime: string; // Formatted Time
  timeZone: string;
  meetingTopic: string;
  projectSummary: string;
  
  // Admin Controls
  status: MeetingStatus;
  meetingLink?: string; // অনলাইন মিটিংয়ের জন্য (Google Meet / Zoom)
  officeInstructions?: string; // অফিস মিটিংয়ের জন্য ঠিকানা বা ইনস্ট্রাকশন
  adminNotes?: string; // ইন্টারনাল নোটস
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const COLLECTION_NAME = 'meetingRequests';

/**
 * BOOK NEW MEETING (Public Action)
 * ক্লায়েন্ট যখন ওয়েবসাইট থেকে মিটিং বুক করবে।
 */
export const createMeetingRequest = async (
  data: Omit<MeetingRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const meetingRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(meetingRef, {
      ...data,
      status: 'Pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error booking meeting:', error);
    throw new Error('Failed to book meeting. Please try again.');
  }
};

/**
 * GET ALL MEETINGS (Admin Action)
 * অ্যাডমিন ড্যাশবোর্ডে দেখানোর জন্য। স্ট্যাটাস দিয়ে ফিল্টার করা যাবে।
 */
export const getAllMeetings = async (statusFilter?: MeetingStatus | 'All'): Promise<MeetingRequest[]> => {
  try {
    const meetingRef = collection(db, COLLECTION_NAME);
    let q = query(meetingRef, orderBy('createdAt', 'desc'));

    if (statusFilter && statusFilter !== 'All') {
      q = query(q, where('status', '==', statusFilter));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MeetingRequest[];
  } catch (error) {
    console.error('Error fetching meetings:', error);
    throw error;
  }
};

/**
 * GET MEETING BY ID (Admin/Public Tracker)
 */
export const getMeetingById = async (id: string): Promise<MeetingRequest | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as MeetingRequest;
    }
    return null;
  } catch (error) {
    console.error('Error fetching meeting details:', error);
    throw error;
  }
};

/**
 * UPDATE MEETING STATUS & DETAILS (Admin Action)
 * মিটিং অ্যাপ্রুভ করা, রিস্কিডিউল করা বা লিংক প্রোভাইড করার জন্য।
 */
export const updateMeetingDetails = async (
  id: string, 
  updates: Partial<Omit<MeetingRequest, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating meeting:', error);
    throw error;
  }
};

/**
 * DELETE MEETING REQUEST (Admin Action)
 */
export const deleteMeetingRequest = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting meeting:', error);
    throw error;
  }
};