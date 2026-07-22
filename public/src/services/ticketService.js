import { api, contentApi } from '/src/lib/apiClient.js';
import { toMillis } from '/src/lib/sortUtils.js';
const TYPE='tickets';
export const createSupportTicket=async data=>(await contentApi.create(TYPE,{...data,status:'Open',replies:[]})).id;
export const getTicketsByClient=async()=>{const rows=await contentApi.list(TYPE,false);return rows.sort((a,b)=>toMillis(b.createdAt)-toMillis(a.createdAt));};
export const getAllSupportTickets=async statusFilter=>{let rows=await contentApi.list(TYPE,true);if(statusFilter&&statusFilter!=='All')rows=rows.filter(x=>x.status===statusFilter);return rows.sort((a,b)=>toMillis(b.createdAt)-toMillis(a.createdAt));};
export const addTicketReply=async(ticketId,reply)=>{await api.post(`/tickets/${encodeURIComponent(ticketId)}/replies`,{reply});};
export const updateTicketStatus=async(ticketId,status)=>{await contentApi.update(TYPE,ticketId,{status});};
