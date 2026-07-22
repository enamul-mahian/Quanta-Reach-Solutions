import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '/src/lib/firebase.js';
import { safeNumber } from '/src/lib/sortUtils.js';
const COLLECTION_NAME = 'teamMembers';
/**
 * ADD NEW TEAM MEMBER (Admin Action)
 */
export const createTeamMember = async (data) => {
    try {
        const teamRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(teamRef, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    }
    catch (error) {
        console.error('Error adding team member:', error);
        throw error;
    }
};
/**
 * GET TEAM MEMBERS (Public/Admin)
 * সর্টিং এবং একটিভ স্ট্যাটাস অনুযায়ী ফিল্টারিং
 */
export const getTeamMembers = async (options) => {
    try {
        const teamRef = collection(db, COLLECTION_NAME);
        const teamQuery = options?.activeOnly
            ? query(teamRef, where('status', '==', 'Active'))
            : teamRef;
        const querySnapshot = await getDocs(teamQuery);
        const members = querySnapshot.docs.map(snapshot => ({
            id: snapshot.id,
            ...snapshot.data()
        }));
        return members
            .filter(member => !options?.activeOnly || member.status === 'Active')
            .filter(member => !options?.featuredOnly || member.isFeatured)
            .sort((a, b) => safeNumber(a.sortOrder) - safeNumber(b.sortOrder));
    }
    catch (error) {
        console.error('Error fetching team members:', error);
        throw error;
    }
};
/**
 * UPDATE TEAM MEMBER (Admin Action)
 */
export const updateTeamMember = async (id, updates) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    }
    catch (error) {
        console.error('Error updating team member:', error);
        throw error;
    }
};
/**
 * DELETE TEAM MEMBER (Admin Action)
 */
export const deleteTeamMember = async (id) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    }
    catch (error) {
        console.error('Error deleting team member:', error);
        throw error;
    }
};
/**
 * QUICK STATUS TOGGLE
 */
export const toggleMemberStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    return updateTeamMember(id, { status: newStatus });
};
export const toggleMemberFeatured = async (id, currentFeatured) => {
    return updateTeamMember(id, { isFeatured: !currentFeatured });
};
