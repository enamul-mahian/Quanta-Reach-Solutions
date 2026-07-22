import { contentApi } from '/src/lib/apiClient.js';
import { safeNumber, toMillis } from '/src/lib/sortUtils.js';
const TYPE='portfolios';
export const createProject=async data=>(await contentApi.create(TYPE,data)).id;
export const getProjects=async options=>{const includeAll=Boolean(options?.includeDrafts);const rows=await contentApi.list(TYPE,includeAll);let out=rows.filter(p=>includeAll||p.status==='Published').filter(p=>!options?.featuredOnly||p.isFeatured).sort((a,b)=>safeNumber(a.sortOrder)-safeNumber(b.sortOrder)||toMillis(b.createdAt)-toMillis(a.createdAt));return options?.limitCount?out.slice(0,Math.max(0,options.limitCount)):out;};
export const getProjectBySlug=async slug=>{try{return await contentApi.show(TYPE,slug);}catch{return null;}};
export const updateProject=async(id,updates)=>{await contentApi.update(TYPE,id,updates);};
export const deleteProject=async id=>{await contentApi.remove(TYPE,id);};
export const toggleProjectFeatured=async(id,current)=>updateProject(id,{isFeatured:!current});
