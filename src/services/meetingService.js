import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '/src/lib/firebase.js';
import { toMillis } from '/src/lib/sortUtils.js';
const COLLECTION_NAME = 'meetingRequests';
/**
 * BOOK NEW MEETING (Public Action)
 * ক্লায়েন্ট যখন ওয়েবসাইট থেকে মিটিং বুক করবে।
 */
export const createMeetingRequest = async (data) => {
    try {
        const meetingRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(meetingRef, {
            ...data,
            status: 'Pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    }
    catch (error) {
        console.error('Error booking meeting:', error);
        throw new Error('Failed to book meeting. Please try again.');
    }
};
/**
 * GET ALL MEETINGS (Admin Action)
 * অ্যাডমিন ড্যাশবোর্ডে দেখানোর জন্য। স্ট্যাটাস দিয়ে ফিল্টার করা যাবে।
 */
export const getAllMeetings = async (statusFilter) => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const meetings = querySnapshot.docs.map(snapshot => ({
            id: snapshot.id,
            ...snapshot.data()
        }));
        return meetings
            .filter(meeting => !statusFilter || statusFilter === 'All' || meeting.status === statusFilter)
            .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
    }
    catch (error) {
        console.error('Error fetching meetings:', error);
        throw error;
    }
};
/**
 * GET MEETING BY ID (Admin/Public Tracker)
 */
export const getMeetingById = async (id) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    }
    catch (error) {
        console.error('Error fetching meeting details:', error);
        throw error;
    }
};
/**
 * UPDATE MEETING STATUS & DETAILS (Admin Action)
 * মিটিং অ্যাপ্রুভ করা, রিস্কিডিউল করা বা লিংক প্রোভাইড করার জন্য।
 */
export const updateMeetingDetails = async (id, updates) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    }
    catch (error) {
        console.error('Error updating meeting:', error);
        throw error;
    }
};
/**
 * DELETE MEETING REQUEST (Admin Action)
 */
export const deleteMeetingRequest = async (id) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    }
    catch (error) {
        console.error('Error deleting meeting:', error);
        throw error;
    }
};
