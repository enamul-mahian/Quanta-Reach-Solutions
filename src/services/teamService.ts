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
 * TEAM MEMBER TYPES & INTERFACES
 * মাস্টার প্রম্পটের সেকশন ১৭ অনুযায়ী বিস্তারিত ডাটা স্কিমা
 */
export interface TeamMember {
  id?: string;
  name: string;
  photo: string; // Cloudinary URL
  role: {
    en: string;
    bn: string;
  };
  department: string; // যেমন: Engineering, Design, Marketing
  skills: string[]; // স্কিল ট্যাগের লিস্ট
  experienceYears: number;
  languages: {
    english: string; // Level: Native, Professional, etc.
    bangla: string;
  };
  bio: {
    en: string;
    bn: string;
  };
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  emailVisibility: boolean;
  isFeatured: boolean;
  status: 'Active' | 'Inactive';
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const COLLECTION_NAME = 'teamMembers';

/**
 * ADD NEW TEAM MEMBER (Admin Action)
 */
export const createTeamMember = async (data: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const teamRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(teamRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding team member:', error);
    throw error;
  }
};

/**
 * GET TEAM MEMBERS (Public/Admin)
 * সর্টিং এবং একটিভ স্ট্যাটাস অনুযায়ী ফিল্টারিং
 */
export const getTeamMembers = async (options?: {
  activeOnly?: boolean;
  featuredOnly?: boolean;
}): Promise<TeamMember[]> => {
  try {
    const teamRef = collection(db, COLLECTION_NAME);
    let q = query(teamRef, orderBy('sortOrder', 'asc'));

    if (options?.activeOnly) {
      q = query(q, where('status', '==', 'Active'));
    }

    if (options?.featuredOnly) {
      q = query(q, where('isFeatured', '==', true));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TeamMember[];
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
};

/**
 * UPDATE TEAM MEMBER (Admin Action)
 */
export const updateTeamMember = async (id: string, updates: Partial<TeamMember>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    throw error;
  }
};

/**
 * DELETE TEAM MEMBER (Admin Action)
 */
export const deleteTeamMember = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting team member:', error);
    throw error;
  }
};

/**
 * QUICK STATUS TOGGLE
 */
export const toggleMemberStatus = async (id: string, currentStatus: 'Active' | 'Inactive') => {
  const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
  return updateTeamMember(id, { status: newStatus });
};

export const toggleMemberFeatured = async (id: string, currentFeatured: boolean) => {
  return updateTeamMember(id, { isFeatured: !currentFeatured });
};