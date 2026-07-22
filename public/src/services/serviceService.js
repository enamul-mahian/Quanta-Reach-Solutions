import { contentApi } from '/src/lib/apiClient.js';
import { safeNumber, toMillis } from '/src/lib/sortUtils.js';
const TYPE='services';
export const createService=async data=>(await contentApi.create(TYPE,data)).id;
export const getServices=async options=>{const include=Boolean(options?.includeDrafts);const rows=await contentApi.list(TYPE,include);let out=rows.filter(x=>include||x.status==='Published').filter(x=>!options?.featuredOnly||x.isFeatured).sort((a,b)=>safeNumber(a.sortOrder)-safeNumber(b.sortOrder)||toMillis(b.createdAt)-toMillis(a.createdAt));return options?.limitCount?out.slice(0,Math.max(0,options.limitCount)):out;};
export const getServiceBySlug=async slug=>{try{return await contentApi.show(TYPE,slug);}catch{return null;}};
export const updateService=async(id,updates)=>{await contentApi.update(TYPE,id,updates);};
export const deleteService=async id=>{await contentApi.remove(TYPE,id);};
export const toggleFeatured=async(id,current)=>updateService(id,{isFeatured:!current});
