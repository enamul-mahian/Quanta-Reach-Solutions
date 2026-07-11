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
 * BUSINESS TARGET TYPES & INTERFACES
 * মাস্টার প্রম্পটের সেকশন ১২ অনুযায়ী ইন্টারনাল ডাটা স্ট্রাকচার
 */

export type TargetPeriod = 'Monthly' | 'Quarterly' | 'Yearly';
export type TargetStatus = 'On Track' | 'At Risk' | 'Achieved' | 'Missed';
export type TargetCategory = 'Revenue' | 'Lead Generation' | 'Project Completion' | 'Client Retention' | 'Team Growth';

export interface BusinessTarget {
  id?: string;
  title: string;
  category: TargetCategory;
  period: TargetPeriod;
  
  // Numerical Metrics
  targetAmount: number;
  achievedAmount: number;
  
  // Logistics
  deadline: string; // YYYY-MM-DD
  responsibleTeam: string;
  
  // Evaluation
  status: TargetStatus;
  notes?: string;
  actionItems: string[]; // টার্গেট অর্জনের জন্য কী কী পদক্ষেপ নেওয়া হচ্ছে
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const COLLECTION_NAME = 'businessTargets';

/**
 * CREATE NEW TARGET (Admin/Management Action)
 */
export const createBusinessTarget = async (
  data: Omit<BusinessTarget, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const targetRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(targetRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating business target:', error);
    throw new Error('Failed to create target');
  }
};

/**
 * GET ALL TARGETS
 * পিরিয়ড বা স্ট্যাটাস অনুযায়ী ফিল্টার করার সুবিধা।
 */
export const getBusinessTargets = async (filters?: {
  period?: TargetPeriod | 'All';
  status?: TargetStatus | 'All';
}): Promise<BusinessTarget[]> => {
  try {
    const targetRef = collection(db, COLLECTION_NAME);
    let q = query(targetRef, orderBy('deadline', 'asc')); // নিকটবর্তী ডেডলাইনগুলো আগে দেখাবে

    if (filters?.period && filters.period !== 'All') {
      q = query(q, where('period', '==', filters.period));
    }

    if (filters?.status && filters.status !== 'All') {
      q = query(q, where('status', '==', filters.status));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BusinessTarget[];
  } catch (error) {
    console.error('Error fetching business targets:', error);
    throw error;
  }
};

/**
 * UPDATE TARGET PROGRESS
 * অ্যাচিভমেন্ট, স্ট্যাটাস এবং অ্যাকশন আইটেম আপডেট করার জন্য।
 */
export const updateBusinessTarget = async (
  id: string, 
  updates: Partial<Omit<BusinessTarget, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating business target:', error);
    throw error;
  }
};

/**
 * DELETE TARGET
 */
export const deleteBusinessTarget = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting business target:', error);
    throw error;
  }
};

/**
 * HELPER: CALCULATE PROGRESS PERCENTAGE
 * ফ্রন্টএন্ডে প্রগ্রেস বার দেখানোর জন্য গাণিতিক ফাংশন
 */
export const calculateTargetProgress = (achieved: number, target: number): number => {
  if (target <= 0) return 0;
  const percentage = (achieved / target) * 100;
  return Math.min(Math.max(percentage, 0), 100); // 0 থেকে 100 এর মধ্যে সীমাবদ্ধ রাখা
};