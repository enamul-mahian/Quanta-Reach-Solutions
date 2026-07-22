import { contentApi } from '/src/lib/apiClient.js';
import { safeNumber } from '/src/lib/sortUtils.js';
const TYPE='pricing-packages';
export const createPricingPackage=async data=>(await contentApi.create(TYPE,data)).id;
export const getPricingPackages=async options=>{const includeInactive=Boolean(options?.includeInactive);const rows=await contentApi.list(TYPE,includeInactive);return rows.filter(p=>includeInactive||p.status==='Active').sort((a,b)=>safeNumber(a.sortOrder)-safeNumber(b.sortOrder));};
export const updatePricingPackage=async(id,updates)=>{await contentApi.update(TYPE,id,updates);};
export const deletePricingPackage=async id=>{await contentApi.remove(TYPE,id);};
export const togglePackageStatus=async(id,current)=>updatePricingPackage(id,{status:current==='Active'?'Inactive':'Active'});
export const togglePackageRecommended=async(id,current)=>updatePricingPackage(id,{isRecommended:!current});
