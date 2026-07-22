import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { getAllMedia, saveMediaRecord, deleteMediaRecord } from '/src/services/mediaService.js';
import { uploadMedia } from '/src/lib/mediaUpload.js';
import { useAuth } from '/src/contexts/AuthContext.js';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { UploadCloud, Search, Trash2, Copy, Film, FileText, X, Check, Folder, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
export const MediaLibraryPage = () => {
    const { language } = useLanguage();
    const { currentUser } = useAuth();
    const [mediaFiles, setMediaFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [resourceFilter, setResourceFilter] = useState('All');
    // Upload Modal States
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [fileDetails, setFileDetails] = useState({ title: '', altText: '', folder: 'general' });
    // ডাটা লোড করা
    const fetchMedia = async () => {
        setLoading(true);
        try {
            const data = await getAllMedia({ resourceType: resourceFilter });
            setMediaFiles(data);
        }
        catch (error) {
            toast.error('Failed to load media library');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchMedia();
    }, [resourceFilter]);
    // ফাইল সাইজ কনভার্টার (Bytes to KB/MB)
    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes)
            return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };
    // ক্লিপবোর্ডে URL কপি করা
    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
        toast.success('URL copied to clipboard!', { icon: '📋' });
    };
    // ডিলিট হ্যান্ডলার (Protection সহ)
    const handleDelete = async (id, url) => {
        if (!window.confirm('Delete this file permanently?'))
            return;
        const toastId = toast.loading('Checking usage and deleting...');
        try {
            await deleteMediaRecord(id, url);
            toast.success('File deleted successfully', { id: toastId });
            setMediaFiles(prev => prev.filter(m => m.id !== id));
        }
        catch (error) {
            if (error.message.includes('USAGE_WARNING')) {
                toast.error('Cannot delete: File is currently in use (Blog/Portfolio/Service).', { id: toastId, duration: 6000 });
            }
            else {
                toast.error('Failed to delete file', { id: toastId });
            }
        }
    };
    // আপলোড হ্যান্ডলার
    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            toast.error('Please select a file first');
            return;
        }
        setIsUploading(true);
        setUploadProgress(0);
        try {
            // ১. Cloudinary-তে আপলোড
            const uploadResult = await uploadMedia(selectedFile, (progress) => {
                setUploadProgress(progress);
            });
            // ২. Firestore-এ রেকর্ড সেভ
            const newRecord = {
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
        }
        catch (error) {
            console.error(error);
            toast.error('Upload failed. Please check network or file type.');
        }
        finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };
    // ফিল্টারিং
    const filteredMedia = mediaFiles.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.folder.toLowerCase().includes(searchQuery.toLowerCase()));
    return (_jsxs("div", { className: "p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-white tracking-tight flex items-center gap-3", children: [_jsx(Folder, { className: "w-8 h-8 text-electric" }), language === 'en' ? 'Media Library' : 'মিডিয়া লাইব্রেরি'] }), _jsx("p", { className: "text-soft-gray mt-1 text-sm", children: "Centralized Cloudinary storage for images, videos, and documents." })] }), _jsxs("button", { onClick: () => setIsUploadModalOpen(true), className: "flex items-center gap-2 px-6 py-3 bg-electric hover:bg-electric-bright text-navy font-bold rounded-xl transition-all shadow-[0_10px_20px_rgba(22,139,255,0.2)] active:scale-95", children: [_jsx(UploadCloud, { className: "w-5 h-5" }), language === 'en' ? 'Upload File' : 'ফাইল আপলোড করুন'] })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" }), _jsx("input", { type: "text", placeholder: "Search by filename or folder...", className: "w-full bg-navy-surface border border-borderColor rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-electric outline-none transition-all", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })] }), _jsxs("select", { className: "bg-navy-surface border border-borderColor rounded-2xl px-6 py-3.5 text-white focus:border-electric outline-none appearance-none font-bold", value: resourceFilter, onChange: (e) => setResourceFilter(e.target.value), children: [_jsx("option", { value: "All", children: "All Media Types" }), _jsx("option", { value: "image", children: "Images Only" }), _jsx("option", { value: "video", children: "Videos Only" }), _jsx("option", { value: "raw", children: "Documents (PDF, etc.)" })] })] }), loading ? (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6", children: [...Array(12)].map((_, i) => (_jsx("div", { className: "aspect-square bg-white/[0.02] rounded-2xl animate-pulse border border-borderColor" }, i))) })) : filteredMedia.length === 0 ? (_jsxs("div", { className: "glass-panel border-borderColor rounded-3xl p-20 flex flex-col items-center justify-center text-center", children: [_jsx(UploadCloud, { className: "w-16 h-16 text-white/10 mb-4" }), _jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Library is Empty" }), _jsx("p", { className: "text-soft-gray text-sm", children: "No media files found matching your criteria." })] })) : (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6", children: filteredMedia.map((media) => (_jsxs("div", { className: "group relative bg-navy-surface border border-borderColor rounded-2xl overflow-hidden hover:border-electric transition-colors shadow-lg flex flex-col", children: [_jsxs("div", { className: "relative aspect-square bg-navy flex items-center justify-center overflow-hidden", children: [media.resourceType === 'image' ? (_jsx("img", { src: media.url, alt: media.altText, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500", loading: "lazy" })) : media.resourceType === 'video' ? (_jsx(Film, { className: "w-12 h-12 text-white/20" })) : (_jsx(FileText, { className: "w-12 h-12 text-white/20" })), _jsxs("div", { className: "absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm", children: [_jsx("button", { onClick: () => copyToClipboard(media.url), className: "p-2.5 bg-electric text-navy hover:bg-electric-bright rounded-xl transition-all", title: "Copy URL", children: _jsx(Copy, { className: "w-4 h-4" }) }), _jsx("a", { href: media.url, target: "_blank", rel: "noopener noreferrer", className: "p-2.5 bg-white/10 text-white hover:bg-white/20 rounded-xl transition-all", title: "Open File", children: _jsx(ExternalLink, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(media.id, media.url), className: "p-2.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all", title: "Delete", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { className: "p-3 border-t border-borderColor", children: [_jsx("p", { className: "text-xs font-bold text-white truncate", title: media.title, children: media.title }), _jsxs("div", { className: "flex items-center justify-between mt-1", children: [_jsx("span", { className: "text-[10px] text-soft-gray uppercase", children: media.format }), _jsx("span", { className: "text-[10px] font-mono text-soft-gray", children: formatBytes(media.size) })] })] })] }, media.id))) })), isUploadModalOpen && (_jsxs("div", { className: "fixed inset-0 z-[4000] flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-navy/95 backdrop-blur-md", onClick: () => !isUploading && setIsUploadModalOpen(false) }), _jsxs("div", { className: "relative w-full max-w-2xl bg-navy-surface border border-borderColor rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300", children: [_jsxs("div", { className: "p-6 border-b border-borderColor flex justify-between items-center bg-white/[0.01]", children: [_jsxs("h2", { className: "text-xl font-bold text-white flex items-center gap-3", children: [_jsx(UploadCloud, { className: "text-electric" }), " Secure Cloud Upload"] }), _jsx("button", { disabled: isUploading, onClick: () => setIsUploadModalOpen(false), className: "p-2 hover:bg-white/5 rounded-full text-soft-gray transition-all disabled:opacity-50", children: _jsx(X, {}) })] }), _jsxs("form", { onSubmit: handleUploadSubmit, className: "p-8 space-y-8", children: [_jsxs("div", { className: "relative border-2 border-dashed border-borderColor hover:border-electric rounded-2xl p-10 transition-colors bg-navy text-center group overflow-hidden", children: [_jsx("input", { type: "file", disabled: isUploading, onChange: (e) => e.target.files && setSelectedFile(e.target.files[0]), className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" }), _jsxs("div", { className: "flex flex-col items-center pointer-events-none", children: [_jsx(UploadCloud, { className: `w-12 h-12 mb-4 transition-colors ${selectedFile ? 'text-electric' : 'text-white/20 group-hover:text-electric/50'}` }), _jsx("span", { className: "text-white font-bold text-lg mb-1", children: selectedFile ? selectedFile.name : 'Click or drag file here' }), _jsx("span", { className: "text-xs text-soft-gray", children: selectedFile ? formatBytes(selectedFile.size) : 'Supports Images, Videos & PDFs via Cloudinary' })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase", children: "File Title" }), _jsx("input", { type: "text", disabled: isUploading, className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none text-sm disabled:opacity-50", value: fileDetails.title, onChange: (e) => setFileDetails({ ...fileDetails, title: e.target.value }), placeholder: "Leave blank to use filename" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase", children: "Cloudinary Folder" }), _jsxs("select", { disabled: isUploading, className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none text-sm appearance-none disabled:opacity-50", value: fileDetails.folder, onChange: (e) => setFileDetails({ ...fileDetails, folder: e.target.value }), children: [_jsx("option", { value: "general", children: "General Uploads" }), _jsx("option", { value: "portfolio", children: "Portfolio Assets" }), _jsx("option", { value: "services", children: "Service Icons & Covers" }), _jsx("option", { value: "blog", children: "Blog Images" }), _jsx("option", { value: "team", children: "Team Photos" })] })] })] }), isUploading && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-xs font-mono font-bold text-electric", children: [_jsx("span", { children: "Uploading to Cloud..." }), _jsxs("span", { children: [Math.round(uploadProgress), "%"] })] }), _jsx("div", { className: "w-full bg-navy border border-borderColor rounded-full h-2 overflow-hidden", children: _jsx("div", { className: "bg-electric h-full rounded-full transition-all duration-300", style: { width: `${uploadProgress}%` } }) })] })), _jsxs("div", { className: "pt-4 border-t border-borderColor flex justify-end gap-4", children: [_jsx("button", { type: "button", disabled: isUploading, onClick: () => setIsUploadModalOpen(false), className: "px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all disabled:opacity-50", children: "Cancel" }), _jsxs("button", { type: "submit", disabled: isUploading || !selectedFile, className: "px-8 py-3 bg-electric hover:bg-electric-bright text-navy font-black rounded-xl transition-all shadow-[0_10px_30px_rgba(22,139,255,0.3)] disabled:opacity-50 flex items-center gap-2", children: [isUploading ? _jsx(UploadCloud, { className: "w-4 h-4 animate-bounce" }) : _jsx(Check, { className: "w-4 h-4" }), isUploading ? 'Uploading...' : 'Save to Library'] })] })] })] })] }))] }));
};
