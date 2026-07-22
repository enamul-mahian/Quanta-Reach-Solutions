import { contentApi } from '/src/lib/apiClient.js';
const TYPE='inquiries';
export const submitInquiry=async data=>(await contentApi.publicCreate(TYPE,data)).id;
export const getAllInquiries=async()=>contentApi.list(TYPE,true);
export const updateInquiryStatus=async(id,status)=>{await contentApi.update(TYPE,id,{status});};
export const updateInquiryDetails=async(id,updates)=>{await contentApi.update(TYPE,id,updates);};
export const deleteInquiry=async id=>{await contentApi.remove(TYPE,id);};
export const getInquiryById=async id=>{try{return await contentApi.show(TYPE,id);}catch{return null;}};
