import { contentApi } from '/src/lib/apiClient.js';
import { toMillis } from '/src/lib/sortUtils.js';
const TYPE='targets';
export const createBusinessTarget=async data=>(await contentApi.create(TYPE,data)).id;
export const getBusinessTargets=async()=>{const rows=await contentApi.list(TYPE,true);return rows.sort((a,b)=>toMillis(b.createdAt)-toMillis(a.createdAt));};
export const updateBusinessTarget=async(id,updates)=>{await contentApi.update(TYPE,id,updates);};
export const deleteBusinessTarget=async id=>{await contentApi.remove(TYPE,id);};
export const calculateTargetProgress=(current,target)=>!target?0:Math.min(100,Math.max(0,Math.round((Number(current||0)/Number(target))*100)));
