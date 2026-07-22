import { contentApi } from '/src/lib/apiClient.js';
import { safeNumber } from '/src/lib/sortUtils.js';
const TYPE='team-members';
export const createTeamMember=async data=>(await contentApi.create(TYPE,data)).id;
export const getTeamMembers=async options=>{const includeAll=!options?.activeOnly;const rows=await contentApi.list(TYPE,includeAll);return rows.filter(m=>!options?.activeOnly||m.status==='Active').filter(m=>!options?.featuredOnly||m.isFeatured).sort((a,b)=>safeNumber(a.sortOrder)-safeNumber(b.sortOrder));};
export const updateTeamMember=async(id,updates)=>{await contentApi.update(TYPE,id,updates);};
export const deleteTeamMember=async id=>{await contentApi.remove(TYPE,id);};
export const toggleMemberStatus=async(id,current)=>updateTeamMember(id,{status:current==='Active'?'Inactive':'Active'});
export const toggleMemberFeatured=async(id,current)=>updateTeamMember(id,{isFeatured:!current});
