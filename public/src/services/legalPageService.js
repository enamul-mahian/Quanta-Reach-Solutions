import { contentApi } from '/src/lib/apiClient.js';
const TYPE='legal-pages';
export const getLegalPage=async type=>{try{return await contentApi.show(TYPE,type);}catch{return null;}};
export const getAllLegalPages=async()=>contentApi.list(TYPE,true);
export const updateLegalPage=async(type,data)=>{const existing=await getLegalPage(type);if(existing?.id)await contentApi.update(TYPE,existing.id,{...data,type});else await contentApi.create(TYPE,{...data,type});};
