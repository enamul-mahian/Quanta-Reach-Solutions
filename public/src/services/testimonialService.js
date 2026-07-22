import { contentApi } from '/src/lib/apiClient.js';
import { safeNumber, toMillis } from '/src/lib/sortUtils.js';
const TYPE='testimonials';
export const createTestimonial=async data=>(await contentApi.create(TYPE,data)).id;
export const getTestimonials=async options=>{const include=Boolean(options?.includeDrafts);const rows=await contentApi.list(TYPE,include);let out=rows.filter(x=>include||x.status==='Published').filter(x=>!options?.featuredOnly||x.isFeatured).sort((a,b)=>safeNumber(a.sortOrder)-safeNumber(b.sortOrder)||toMillis(b.createdAt)-toMillis(a.createdAt));return options?.limitCount?out.slice(0,Math.max(0,options.limitCount)):out;};
export const updateTestimonial=async(id,updates)=>{await contentApi.update(TYPE,id,updates);};
export const deleteTestimonial=async id=>{await contentApi.remove(TYPE,id);};
export const toggleTestimonialFeatured=async(id,current)=>updateTestimonial(id,{isFeatured:!current});
export const toggleTestimonialVerified=async(id,current)=>updateTestimonial(id,{isVerified:!current});
