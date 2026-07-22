import { contentApi } from '/src/lib/apiClient.js';
import { toMillis } from '/src/lib/sortUtils.js';
const TYPE='meetings';
export const createMeetingRequest=async data=>(await contentApi.publicCreate(TYPE,data)).id;
export const getAllMeetings=async()=>{const rows=await contentApi.list(TYPE,true);return rows.sort((a,b)=>toMillis(b.createdAt)-toMillis(a.createdAt));};
export const getMeetingById=async id=>{try{return await contentApi.show(TYPE,id);}catch{return null;}};
export const updateMeetingDetails=async(id,updates)=>{await contentApi.update(TYPE,id,updates);};
export const deleteMeetingRequest=async id=>{await contentApi.remove(TYPE,id);};
