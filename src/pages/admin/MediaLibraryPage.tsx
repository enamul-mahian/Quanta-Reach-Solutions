import React, { useState, useEffect } from 'react';
import { 
  getAllMedia, 
  saveMediaRecord, 
  deleteMediaRecord, 
  MediaFile 
} from '@/services/mediaService';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  UploadCloud, 
  Search, 
  Trash2, 
  Copy, 
  Image as ImageIcon, 
  Film, 
  FileText, 
  X, 
  Check, 
  Folder,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

export const MediaLibraryPage: React.FC = () => {
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [resourceFilter, setResourceFilter] = useState<'All' | 'image' | 'video' | 'raw'>('All');
  
  // Upload Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileDetails, setFileDetails] = useState({ title: '', altText: '', folder: 'general' });

  // ডাটা লোড করা
  const fetchMedia = async () => {
    setLoading(true);
    try {
      const data = await getAllMedia({ resourceType: resourceFilter });
      setMediaFiles(data);
    } catch (error) {
      toast.error('Failed to load media library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [resourceFilter]);

  // ফাইল সাইজ কনভার্টার (Bytes to KB/MB)
  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  // ক্লিপবোর্ডে URL কপি করা
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!', { icon: '📋' });
  };

  // ডিলিট হ্যান্ডলার (Protection সহ)
  const handleDelete = async (id: string, url: string) => {
    if (!window.confirm('Delete this file permanently?')) return;
    
    const toastId = toast.loading('Checking usage and deleting...');
    try {
      await deleteMediaRecord(id, url);
      toast.success('File deleted successfully', { id: toastId });
      setMediaFiles(prev => prev.filter(m => m.id !== id));
    } catch (error: any) {
      if (error.message.includes('USAGE_WARNING')) {
        toast.error('Cannot delete: File is currently in use (Blog/Portfolio/Service).', { id: toastId, duration: 6000 });
      } else {
        toast.error('Failed to delete file', { id: toastId });
      }
    }
  };

  // আপলোড হ্যান্ডলার
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // ১. Cloudinary-তে আপলোড
      const uploadResult = await uploadToCloudinary(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      // ২. Firestore-এ রেকর্ড সেভ
      const newRecord: Omit<MediaFile, 'id' | 'createdAt'> = {
        publicId: uploadResult.publicId || 'unknown_id',
        url: uploadResult.url,
        resourceType: selectedFile.type.startsWith('image/') ? 'image' 
                    : selectedFile.type.startsWith('video/') ? 'video' : 'raw',
        format: selectedFile.name.split('.').pop() || 'unknown',
        size: selectedFile.size,
        folder: fileDetails.folder,
        title: fileDetails.title || selectedFile.name,
        altText: fileDetails.altText || '',
        uploadedBy: currentUser?.displayName || 'Admin'
      };

      await saveMediaRecord(newRecord);
      toast.success('File uploaded and saved to library!');
      
      // ৩. রিসেট
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setFileDetails({ title: '', altText: '', folder: 'general' });
      fetchMedia();

    } catch (error) {
      console.error(error);
      toast.error('Upload failed. Please check network or file type.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // ফিল্টারিং
  const filteredMedia = mediaFiles.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.folder.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Folder className="w-8 h-8 text-electric" />
            {language === 'en' ? 'Media Library' : 'মিডিয়া লাইব্রেরি'}
          </h1>
          <p className="text-soft-gray mt-1 text-sm">
            Centralized Cloudinary storage for images, videos, and documents.
          </p>
        </div>
        
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-electric hover:bg-bright-blue text-navy font-bold rounded-xl transition-all shadow-[0_10px_20px_rgba(22,139,255,0.2)] active:scale-95"
        >
          <UploadCloud className="w-5 h-5" />
          {language === 'en' ? 'Upload File' : 'ফাইল আপলোড করুন'}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" />
          <input 
            type="text"
            placeholder="Search by filename or folder..."
            className="w-full bg-navy-surface border border-borderColor rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-electric outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="bg-navy-surface border border-borderColor rounded-2xl px-6 py-3.5 text-white focus:border-electric outline-none appearance-none font-bold"
          value={resourceFilter}
          onChange={(e) => setResourceFilter(e.target.value as any)}
        >
          <option value="All">All Media Types</option>
          <option value="image">Images Only</option>
          <option value="video">Videos Only</option>
          <option value="raw">Documents (PDF, etc.)</option>
        </select>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-square bg-white/[0.02] rounded-2xl animate-pulse border border-borderColor" />
          ))}
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="glass-panel border-borderColor rounded-3xl p-20 flex flex-col items-center justify-center text-center">
          <UploadCloud className="w-16 h-16 text-white/10 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Library is Empty</h3>
          <p className="text-soft-gray text-sm">No media files found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredMedia.map((media) => (
            <div key={media.id} className="group relative bg-navy-surface border border-borderColor rounded-2xl overflow-hidden hover:border-electric transition-colors shadow-lg flex flex-col">
              
              {/* Media Preview Thumbnail */}
              <div className="relative aspect-square bg-navy flex items-center justify-center overflow-hidden">
                {media.resourceType === 'image' ? (
                  <img src={media.url} alt={media.altText} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                ) : media.resourceType === 'video' ? (
                  <Film className="w-12 h-12 text-white/20" />
                ) : (
                  <FileText className="w-12 h-12 text-white/20" />
                )}

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                  <button onClick={() => copyToClipboard(media.url)} className="p-2.5 bg-electric text-navy hover:bg-bright-blue rounded-xl transition-all" title="Copy URL">
                    <Copy className="w-4 h-4" />
                  </button>
                  <a href={media.url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 text-white hover:bg-white/20 rounded-xl transition-all" title="Open File">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button onClick={() => handleDelete(media.id!, media.url)} className="p-2.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Media Info Footer */}
              <div className="p-3 border-t border-borderColor">
                <p className="text-xs font-bold text-white truncate" title={media.title}>{media.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-soft-gray uppercase">{media.format}</span>
                  <span className="text-[10px] font-mono text-soft-gray">{formatBytes(media.size)}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/95 backdrop-blur-md" onClick={() => !isUploading && setIsUploadModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-navy-surface border border-borderColor rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            
            <div className="p-6 border-b border-borderColor flex justify-between items-center bg-white/[0.01]">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <UploadCloud className="text-electric" /> Secure Cloud Upload
              </h2>
              <button disabled={isUploading} onClick={() => setIsUploadModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-soft-gray transition-all disabled:opacity-50"><X /></button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-8 space-y-8">
              
              {/* File Selector Zone */}
              <div className="relative border-2 border-dashed border-borderColor hover:border-electric rounded-2xl p-10 transition-colors bg-navy text-center group overflow-hidden">
                <input 
                  type="file" 
                  disabled={isUploading}
                  onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" 
                />
                <div className="flex flex-col items-center pointer-events-none">
                  <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${selectedFile ? 'text-electric' : 'text-white/20 group-hover:text-electric/50'}`} />
                  <span className="text-white font-bold text-lg mb-1">
                    {selectedFile ? selectedFile.name : 'Click or drag file here'}
                  </span>
                  <span className="text-xs text-soft-gray">
                    {selectedFile ? formatBytes(selectedFile.size) : 'Supports Images, Videos & PDFs via Cloudinary'}
                  </span>
                </div>
              </div>

              {/* Metadata Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-soft-gray uppercase">File Title</label>
                  <input type="text" disabled={isUploading} className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none text-sm disabled:opacity-50" 
                    value={fileDetails.title} onChange={(e) => setFileDetails({...fileDetails, title: e.target.value})} placeholder="Leave blank to use filename"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-soft-gray uppercase">Cloudinary Folder</label>
                  <select disabled={isUploading} className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none text-sm appearance-none disabled:opacity-50"
                    value={fileDetails.folder} onChange={(e) => setFileDetails({...fileDetails, folder: e.target.value})}
                  >
                    <option value="general">General Uploads</option>
                    <option value="portfolio">Portfolio Assets</option>
                    <option value="services">Service Icons & Covers</option>
                    <option value="blog">Blog Images</option>
                    <option value="team">Team Photos</option>
                  </select>
                </div>
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono font-bold text-electric">
                    <span>Uploading to Cloud...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-navy border border-borderColor rounded-full h-2 overflow-hidden">
                    <div className="bg-electric h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-borderColor flex justify-end gap-4">
                <button type="button" disabled={isUploading} onClick={() => setIsUploadModalOpen(false)} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isUploading || !selectedFile} className="px-8 py-3 bg-electric hover:bg-bright-blue text-navy font-black rounded-xl transition-all shadow-[0_10px_30px_rgba(22,139,255,0.3)] disabled:opacity-50 flex items-center gap-2">
                  {isUploading ? <UploadCloud className="w-4 h-4 animate-bounce" /> : <Check className="w-4 h-4" />}
                  {isUploading ? 'Uploading...' : 'Save to Library'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};