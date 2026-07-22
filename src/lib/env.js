export const getEnvVar = (key) => {
    const viteEnv = import.meta.env;
    const browserEnv = globalThis.__QRS_ENV__;
    const runtimeValue = browserEnv?.[key];
    const value = typeof runtimeValue === 'string' && runtimeValue.trim()
        ? runtimeValue
        : viteEnv?.[key];
    return typeof value === 'string' ? value.trim() : '';
};
export const env = {
    firebaseApiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
    firebaseAuthDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
    firebaseProjectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
    firebaseStorageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
    firebaseMessagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    firebaseAppId: getEnvVar('VITE_FIREBASE_APP_ID'),
    firebaseMeasurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID') || undefined,
    cloudinaryCloudName: getEnvVar('VITE_CLOUDINARY_CLOUD_NAME'),
    cloudinaryUploadPreset: getEnvVar('VITE_CLOUDINARY_UPLOAD_PRESET'),
    cloudinaryFolder: getEnvVar('VITE_CLOUDINARY_FOLDER') || 'quanta_reach_solutions',
};
export const isFirebaseConfigured = () => Boolean(env.firebaseApiKey &&
    env.firebaseProjectId &&
    env.firebaseAuthDomain &&
    env.firebaseAppId);
export const isCloudinaryConfigured = () => Boolean(env.cloudinaryCloudName && env.cloudinaryUploadPreset);
