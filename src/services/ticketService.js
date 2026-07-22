// =========================================================================
// Quanta Reach Solutions - Ticket Service (Index-Free Client-Side Sorted)
// =========================================================================
import { collection, addDoc, getDocs, doc, updateDoc, query, where, arrayUnion, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '/src/lib/firebase.js';
const COLLECTION_NAME = 'supportTickets';
/**
 * CREATE NEW TICKET (Client Action)
 */
export const createSupportTicket = async (data) => {
    try {
        const ticketRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(ticketRef, {
            ...data,
            status: 'Open',
            replies: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    }
    catch (error) {
        console.error('Error creating support ticket:', error);
        throw new Error('Failed to submit ticket. Please try again.');
    }
};
/**
 * GET CLIENT-SPECIFIC TICKETS (Client Action)
 * ফায়ারস্টোর ইনডেক্স এরর এড়াতে 'orderBy' রিমুভ করে জাভাস্ক্রিপ্ট সর্টিং যুক্ত করা হয়েছে।
 */
export const getTicketsByClient = async (clientUid) => {
    try {
        const ticketRef = collection(db, COLLECTION_NAME);
        // কম্পাউন্ড ইনডেক্সিং এরর এড়াতে শুধু clientUid ফিল্টার করা হচ্ছে
        const q = query(ticketRef, where('clientUid', '==', clientUid));
        const querySnapshot = await getDocs(q);
        const tickets = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        // ব্রাউজারের মেমরিতে (Client-side) টাইমস্ট্যাম্প অনুযায়ী অবরোহী (Latest First) সর্ট করা হচ্ছে
        return tickets.sort((a, b) => {
            const dateA = a.createdAt?.toDate()?.getTime() || 0;
            const dateB = b.createdAt?.toDate()?.getTime() || 0;
            return dateB - dateA;
        });
    }
    catch (error) {
        console.error('Error fetching client tickets:', error);
        throw error;
    }
};
/**
 * GET ALL TICKETS (Admin Action)
 * অ্যাডমিন প্যানেলে ফিল্টার করার সময়ও যেন ইনডেক্স এরর না আসে, তাই এখানেও জেএস সর্টিং ব্যবহার করা হয়েছে।
 */
export const getAllSupportTickets = async (statusFilter) => {
    try {
        const ticketRef = collection(db, COLLECTION_NAME);
        let q = query(ticketRef);
        if (statusFilter && statusFilter !== 'All') {
            q = query(q, where('status', '==', statusFilter));
        }
        const querySnapshot = await getDocs(q);
        const tickets = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        // টাইমস্ট্যাম্প অনুযায়ী অবরোহী (Latest First) সর্টিং
        return tickets.sort((a, b) => {
            const dateA = a.createdAt?.toDate()?.getTime() || 0;
            const dateB = b.createdAt?.toDate()?.getTime() || 0;
            return dateB - dateA;
        });
    }
    catch (error) {
        console.error('Error fetching all tickets:', error);
        throw error;
    }
};
/**
 * ADD REPLY TO TICKET (Admin & Client Action)
 */
export const addTicketReply = async (ticketId, reply) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, ticketId);
        const newReply = {
            ...reply,
            createdAt: Timestamp.now()
        };
        await updateDoc(docRef, {
            replies: arrayUnion(newReply),
            updatedAt: serverTimestamp()
        });
    }
    catch (error) {
        console.error('Error adding reply to ticket:', error);
        throw error;
    }
};
/**
 * UPDATE TICKET STATUS
 */
export const updateTicketStatus = async (ticketId, status) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, ticketId);
        await updateDoc(docRef, {
            status,
            updatedAt: serverTimestamp()
        });
    }
    catch (error) {
        console.error('Error updating ticket status:', error);
        throw error;
    }
};
