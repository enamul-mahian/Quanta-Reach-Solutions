export const isLaravelReady = () => Boolean(globalThis.__QRS_ENV__?.LARAVEL_BACKEND);
export const getBackendError = () => isLaravelReady() ? null : new Error('Laravel backend is not available.');
