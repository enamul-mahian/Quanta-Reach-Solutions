import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '/src/lib/firebase.js';
import { safeNumber } from '/src/lib/sortUtils.js';
const COLLECTION_NAME = 'portfolioProjects';
/**
 * CREATE NEW PORTFOLIO PROJECT (Admin Action)
 */
export const createProject = async (data) => {
    try {
        const projectRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(projectRef, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    }
    catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
};
/**
 * GET PROJECTS (Public/Admin)
 * ফিল্টার এবং সর্টিং সাপোর্ট করে
 */
export const getProjects = async (filters) => {
    try {
        const projectsRef = collection(db, COLLECTION_NAME);
        const projectsQuery = filters?.includeDrafts
            ? projectsRef
            : query(projectsRef, where('status', '==', 'Published'));
        const querySnapshot = await getDocs(projectsQuery);
        const projects = querySnapshot.docs.map(snapshot => ({
            id: snapshot.id,
            ...snapshot.data()
        }));
        return projects
            .filter(project => !filters?.type || project.projectType === filters.type)
            .filter(project => !filters?.category || project.serviceCategory === filters.category)
            .filter(project => filters?.includeDrafts || project.status === 'Published')
            .sort((a, b) => safeNumber(a.sortOrder) - safeNumber(b.sortOrder));
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};
/**
 * GET PROJECT BY SLUG
 */
export const getProjectBySlug = async (slug) => {
    try {
        const projectsRef = collection(db, COLLECTION_NAME);
        const q = query(projectsRef, where('status', '==', 'Published'));
        const querySnapshot = await getDocs(q);
        const match = querySnapshot.docs.find(snapshot => {
            const data = snapshot.data();
            return data.status === 'Published' && data.slug === slug;
        });
        if (match) {
            return { id: match.id, ...match.data() };
        }
        return null;
    }
    catch (error) {
        console.error('Error fetching project by slug:', error);
        throw error;
    }
};
/**
 * UPDATE PROJECT (Admin Action)
 */
export const updateProject = async (id, updates) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    }
    catch (error) {
        console.error('Error updating project:', error);
        throw error;
    }
};
/**
 * DELETE PROJECT (Admin Action)
 */
export const deleteProject = async (id) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    }
    catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
};
/**
 * TOGGLE FEATURED PROJECT
 */
export const toggleProjectFeatured = async (id, currentStatus) => {
    return updateProject(id, { isFeatured: !currentStatus });
};
