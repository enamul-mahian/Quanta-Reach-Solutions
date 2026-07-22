import { contentApi } from '/src/lib/apiClient.js';
import { toMillis } from '/src/lib/sortUtils.js';
const TYPE='blog-posts';
export const createBlogPost=async data=>(await contentApi.create(TYPE,data)).id;
export const updateBlogPost=async(id,updates)=>{await contentApi.update(TYPE,id,{...updates,...(updates.status==='Published'?{publishedAt:new Date().toISOString()}:{})});};
export const getBlogPosts=async(options)=>{const requestedStatus=options?.status??'Published';const posts=await contentApi.list(TYPE,requestedStatus==='All');const filtered=posts.filter(p=>requestedStatus==='All'||p.status===requestedStatus).filter(p=>!options?.category||p.category===options.category).filter(p=>!options?.featuredOnly||p.isFeatured).sort((a,b)=>toMillis(b.createdAt)-toMillis(a.createdAt));return options?.limitCount?filtered.slice(0,Math.max(0,options.limitCount)):filtered;};
export const getBlogPostBySlug=async slug=>{try{return await contentApi.show(TYPE,slug);}catch{return null;}};
export const deleteBlogPost=async id=>{await contentApi.remove(TYPE,id);};
export const getBlogCategories=async()=>{try{return Array.from(new Set((await getBlogPosts({status:'Published'})).map(p=>p.category).filter(Boolean)));}catch{return[];}};
