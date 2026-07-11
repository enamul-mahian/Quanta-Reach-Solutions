// =========================================================================
// MetaFore Technologies - Environment Variable Validator & Safe Exporter
// =========================================================================

interface Env {
  firebaseApiKey: string;
  firebaseAuthDomain: string;
  firebaseProjectId: string;
  firebaseStorageBucket: string;
  firebaseMessagingSenderId: string;
  firebaseAppId: string;
  firebaseMeasurementId?: string;
  cloudinaryCloudName: string;
  cloudinaryUploadPreset: string;
  cloudinaryFolder: string;
}

/**
 * এনভায়রনমেন্ট ভেরিয়েবল নিরাপদে পড়ার জন্য এবং মিসিং থাকলে কনসোলে ওয়ার্নিং দেখানোর জন্য হেল্পার ফাংশন।
 * এটি অ্যাপ ক্র্যাশ হওয়া প্রতিরোধ করে ডেভেলপমেন্টকে সহজ করবে।
 */
const getEnvVar = (key: string, required = true): string => {
  const value = import.meta.env[key];
  if (!value && required) {
    console.warn(
      `[Environment Warning]: Missing required environment variable "${key}". Please check your .env file.`
    );
    return '';
  }
  return value || '';
};

export const env: Env = {
  firebaseApiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  firebaseAuthDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  firebaseProjectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  firebaseStorageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  firebaseMessagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  firebaseAppId: getEnvVar('VITE_FIREBASE_APP_ID'),
  firebaseMeasurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID', false),
  cloudinaryCloudName: getEnvVar('VITE_CLOUDINARY_CLOUD_NAME'),
  cloudinaryUploadPreset: getEnvVar('VITE_CLOUDINARY_UPLOAD_PRESET'),
  cloudinaryFolder: getEnvVar('VITE_CLOUDINARY_FOLDER') || 'metafore_agency',
};

/**
 * ফায়ারবেস সঠিকভাবে কনফিগার করা হয়েছে কি না তা চেক করার হেল্পার
 */
export const isFirebaseConfigured = (): boolean => {
  return !!(
    env.firebaseApiKey &&
    env.firebaseProjectId &&
    env.firebaseAuthDomain
  );
};

/**
 * ক্লাউডিনারি সঠিকভাবে কনফিগার করা হয়েছে কি না তা চেক করার হেল্পার
 */
export const isCloudinaryConfigured = (): boolean => {
  return !!(
    env.cloudinaryCloudName &&
    env.cloudinaryUploadPreset
  );
};