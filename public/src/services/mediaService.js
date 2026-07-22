import { contentApi } from '/src/lib/apiClient.js';
import { toMillis } from '/src/lib/sortUtils.js';
const TYPE='media';
export const saveMediaRecord=async data=>(await contentApi.create(TYPE,data)).id;
export const getAllMedia=async()=>{const rows=await contentApi.list(TYPE,true);return rows.sort((a,b)=>toMillis(b.createdAt)-toMillis(a.createdAt));};
export const updateMediaMetadata=async(id,updates)=>{await contentApi.update(TYPE,id,updates);};
export const checkMediaUsage=async()=>[];
export const deleteMediaRecord=async id=>{await contentApi.remove(TYPE,id);};
