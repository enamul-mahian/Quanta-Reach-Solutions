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
 * PORTFOLIO TYPES & INTERFACES
 * মাস্টার প্রম্পটের সেকশন ১৫ অনুযায়ী বিস্তারিত আর্কিটেকচার
 */
export interface ProjectMetric {
  label: { en: string; bn: string };
  value: string; // যেমন: "১১০% বৃদ্ধি" বা "110% Growth"
}

export interface PortfolioProject {
  id?: string;
  projectName: { en: string; bn: string };
  slug: string;
  clientName: string;
  clientLogo?: string; // Cloudinary URL
  country: string;
  projectType: 'Local' | 'Global';
  industry: string; // যেমন: E-commerce, Finance, Health
  serviceCategory: string; // যেমন: Web Development, UI/UX
  projectDuration: string;
  teamSize: number;
  
  // কেস স্টাডি কন্টেন্ট (Bilingual)
  overview: { en: string; bn: string };
  challenge: { en: string; bn: string };
  solution: { en: string; bn: string };
  process: { en: string[]; bn: string[] };
  technologies: string[]; // টেক স্ট্যাক লিস্ট
  keyFeatures: { en: string[]; bn: string[] };
  
  // রেজাল্ট এবং টেস্টিমোনিয়াল
  results: { en: string; bn: string };
  metrics: ProjectMetric[];
  clientTestimonial?: {
    name: string;
    role: string;
    feedback: { en: string; bn: string };
    photo?: string;
  };

  // মিডিয়া
  coverImage: string; // Cloudinary URL
  gallery: string[]; // Cloudinary URLs
  videoUrl?: string;
  liveUrl?: string;
  completionDate: string;

  // সেটিংস এবং এসইও
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  status: 'Published' | 'Draft';
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const COLLECTION_NAME = 'portfolioProjects';

/**
 * CREATE NEW PORTFOLIO PROJECT (Admin Action)
 */
export const createProject = async (data: Omit<PortfolioProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const projectRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(projectRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

/**
 * GET PROJECTS (Public/Admin)
 * ফিল্টার এবং সর্টিং সাপোর্ট করে
 */
export const getProjects = async (filters?: {
  type?: 'Local' | 'Global';
  category?: string;
  includeDrafts?: boolean;
}): Promise<PortfolioProject[]> => {
  try {
    const projectsRef = collection(db, COLLECTION_NAME);
    let q = query(projectsRef, orderBy('sortOrder', 'asc'));

    if (filters?.type) {
      q = query(q, where('projectType', '==', filters.type));
    }
    
    if (filters?.category) {
      q = query(q, where('serviceCategory', '==', filters.category));
    }

    if (!filters?.includeDrafts) {
      q = query(q, where('status', '==', 'Published'));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PortfolioProject[];
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

/**
 * GET PROJECT BY SLUG
 */
export const getProjectBySlug = async (slug: string): Promise<PortfolioProject | null> => {
  try {
    const projectsRef = collection(db, COLLECTION_NAME);
    const q = query(projectsRef, where('slug', '==', slug), where('status', '==', 'Published'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as PortfolioProject;
    }
    return null;
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    throw error;
  }
};

/**
 * UPDATE PROJECT (Admin Action)
 */
export const updateProject = async (id: string, updates: Partial<PortfolioProject>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

/**
 * DELETE PROJECT (Admin Action)
 */
export const deleteProject = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

/**
 * TOGGLE FEATURED PROJECT
 */
export const toggleProjectFeatured = async (id: string, currentStatus: boolean): Promise<void> => {
  return updateProject(id, { isFeatured: !currentStatus });
};