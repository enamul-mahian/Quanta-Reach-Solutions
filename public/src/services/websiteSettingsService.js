import { api } from '/src/lib/apiClient.js';
export const getWebsiteSettings=async()=>api.get('/settings');
export const updateWebsiteSettings=async updates=>{await api.put('/settings',{data:updates});};
