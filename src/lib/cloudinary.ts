// =========================================================================
// MetaFore Technologies - Secure Cloudinary Client-Side Media Uploader
// =========================================================================

import { env, isCloudinaryConfigured } from './env';

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  resourceType: string;
  bytes: number;
  format: string;
}

// মিডিয়া টাইপ ও ফাইলের সাইজ লিমিটেশন (মেটাফোর এজেন্সির রুলস অনুযায়ী)
const FILE_LIMITS = {
  image: {
    maxSize: 10 * 1024 * 1024, // ১০ মেগাবাইট (10MB)
    types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
    label: '10MB (JPEG, PNG, WEBP, GIF, SVG)',
  },
  video: {
    maxSize: 50 * 1024 * 1024, // ৫০ মেগাবাইট (50MB)
    types: ['video/mp4', 'video/webm', 'video/quicktime', 'video/mpeg'],
    label: '50MB (MP4, WEBM, MOV, MPEG)',
  },
  raw: {
    maxSize: 15 * 1024 * 1024, // ১৫ মেগাবাইট (15MB)
    types: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ],
    label: '15MB (PDF, DOC, DOCX, XLS, XLSX, TXT)',
  },
};

/**
 * আপলোডের আগে ফাইলের সাইজ এবং ফরম্যাট ভ্যালিডেশনের ফাংশন
 */
export const validateFile = (file: File): { isValid: boolean; error?: string; resourceType: 'image' | 'video' | 'raw' } => {
  let resourceType: 'image' | 'video' | 'raw' = 'raw';

  // ফাইল ফরম্যাট ম্যাচ করা
  if (FILE_LIMITS.image.types.includes(file.type)) {
    resourceType = 'image';
  } else if (FILE_LIMITS.video.types.includes(file.type)) {
    resourceType = 'video';
  } else if (FILE_LIMITS.raw.types.includes(file.type)) {
    resourceType = 'raw';
  } else {
    return {
      isValid: false,
      error: 'Unsupported file format. Please upload standard images, videos, or documents.',
      resourceType,
    };
  }

  // ফাইলের সাইজ লিমিট চেক করা
  const limit = FILE_LIMITS[resourceType];
  if (file.size > limit.maxSize) {
    return {
      isValid: false,
      error: `File size exceeds the limit. Maximum allowed size for ${resourceType} is ${limit.label}.`,
      resourceType,
    };
  }

  return { isValid: true, resourceType };
};

/**
 * ক্লাউডিনারিতে ফাইল আপলোড করার মূল ফাংশন (Unsigned Preset সহ)
 * এটি ব্রাউজার থেকে সরাসরি আপলোড করে এবং কোনো API Secret কি এক্সপোজ করে না।
 */
export const uploadToCloudinary = async (
  file: File,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> => {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary setup is incomplete. Please define Cloudinary variables in your .env file.'
    );
  }

  const validation = validateFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // ক্লাউডিনারি রিমোট আপলোড URL (রিসোর্স টাইপ যেমন: image, video, বা raw অনুযায়ী পরিবর্তনশীল)
  const uploadUrl = `https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/${validation.resourceType}/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', env.cloudinaryUploadPreset);
    formData.append('folder', env.cloudinaryFolder);

    xhr.open('POST', uploadUrl, true);

    // আপলোড প্রোগ্রেস ট্র্যাকিং লজিক (রিয়েল-টাইম পার্সেন্টেজ রিডিং)
    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    // আপলোড শেষ হওয়ার ইভেন্ট
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            url: response.secure_url,
            publicId: response.public_id,
            resourceType: response.resource_type,
            bytes: response.bytes,
            format: response.format || file.name.split('.').pop() || '',
          });
        } catch {
          reject(new Error('Failed to parse Cloudinary response.'));
        }
      } else {
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          reject(new Error(errorResponse.error?.message || 'Failed to upload file to Cloudinary.'));
        } catch {
          reject(new Error(`Upload failed with status code ${xhr.status}`));
        }
      }
    };

    // নেটওয়ার্ক ট্রাবলশুটিং ইভেন্ট
    xhr.onerror = () => {
      reject(new Error('A network error occurred during file upload. Please check your connection.'));
    };

    xhr.send(formData);
  });
};