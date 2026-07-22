const runtime = globalThis.__QRS_ENV__ || {};

export const getEnvVar = (key, fallback = '') => {
    const aliases = {
        VITE_SITE_URL: 'SITE_URL',
        VITE_API_BASE: 'API_BASE',
    };

    const runtimeKey = aliases[key] || key;
    const value = runtime[runtimeKey] ?? runtime[key];

    if (value === undefined || value === null || value === '') {
        return fallback;
    }

    return String(value);
};

const defaultSiteUrl =
    typeof window !== 'undefined' ? window.location.origin : '';

export const env = {
    siteUrl: getEnvVar('VITE_SITE_URL', defaultSiteUrl),
    apiBase: getEnvVar('VITE_API_BASE', '/api'),
};

export const isFirebaseConfigured = () => false;