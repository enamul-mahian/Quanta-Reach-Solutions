const runtime=globalThis.__QRS_ENV__||{};
export const env={siteUrl:runtime.SITE_URL||window.location.origin,apiBase:runtime.API_BASE||'/api'};
export const isFirebaseConfigured=()=>false;
