import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useMemo } from 'react';
import ReactQuill from 'react-quill';

// নতুন ফ্ল্যাট ইনপুট টাইপ BlogFormInput ইম্পোর্ট করা হয়েছে
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '/src/services/blogService.js';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { useAuth } from '/src/contexts/AuthContext.js';
import { uploadToCloudinary } from '/src/lib/cloudinary.js';
import { saveMediaRecord } from '/src/services/mediaService.js';
import { Plus, Search, Edit3, Trash2, FileText, X, Check, Image as ImageIcon, Globe, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
export const BlogManagerPage = () => {
    const { language } = useLanguage();
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    // ডাইনামিক কভার ইমেজ আপলোড প্রগ্রেস স্টেট
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [imageProgress, setImageProgress] = useState(0);
    // ১. ডাইনামিক ফর্ম স্টেট (BlogFormInput টাইপ দ্বারা সম্পূর্ণ সুরক্ষিত)
    const initialFormState = {
        title: { en: '', bn: '' },
        slug: '',
        excerpt: { en: '', bn: '' },
        content: { en: '', bn: '' },
        coverImage: '',
        author: {
            name: currentUser?.displayName || 'Quanta Reach Admin',
            id: currentUser?.uid || 'admin',
            photo: currentUser?.photoURL || ''
        },
        category: 'Technology',
        tags: [],
        readingTime: { en: '5 min read', bn: '৫ মিনিট পাঠ' },
        isFeatured: false,
        relatedPostIds: [],
        seo: { title: '', description: '', keywords: [], ogImage: '' },
        status: 'Draft'
    };
    const [formData, setFormData] = useState(initialFormState);
    const [tagInput, setTagInput] = useState('');
    // ২. ডাটা ফেচিং
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await getBlogPosts({ status: 'All' });
            setPosts(data);
        }
        catch (error) {
            toast.error('Failed to load blog posts');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPosts();
    }, []);
    // ৩. ডিরেক্ট ইমেজ আপলোড লজিক (Cloudinary + Firestore Media Library Sync)
    const handleDirectImageUpload = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 15 * 1024 * 1024) {
                toast.error(language === 'en' ? 'Image must be less than 15MB.' : 'ইমেজ সাইজ ১৫ মেগাবাইটের কম হতে হবে।');
                return;
            }
            setIsUploadingImage(true);
            setImageProgress(0);
            const toastId = toast.loading(language === 'en' ? 'Uploading image from PC...' : 'কম্পিউটার থেকে ছবি আপলোড হচ্ছে...');
            try {
                const uploadResult = await uploadToCloudinary(file, (progress) => {
                    setImageProgress(progress);
                });
                setFormData(prev => ({ ...prev, coverImage: uploadResult.url }));
                toast.success(language === 'en' ? 'Cover image loaded!' : 'কভার ইমেজ আপলোড সফল হয়েছে!', { id: toastId });
                const mediaRecord = {
                    publicId: uploadResult.publicId || 'blog_upload',
                    url: uploadResult.url,
                    resourceType: 'image',
                    format: file.name.split('.').pop() || 'jpg',
                    size: file.size,
                    folder: 'blog',
                    title: file.name,
                    altText: formData.title.en || 'Blog Cover',
                    uploadedBy: currentUser?.displayName || 'Admin'
                };
                await saveMediaRecord(mediaRecord);
            }
            catch (error) {
                console.error(error);
                toast.error(language === 'en' ? 'Image upload failed' : 'ছবি আপলোড ব্যর্থ হয়েছে', { id: toastId });
            }
            finally {
                setIsUploadingImage(false);
                setImageProgress(0);
            }
        }
    };
    // ৪. Quill এডিটর কনফিগারেশন
    const quillModules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    }), []);
    // ৫. সাবমিট হ্যান্ডলার (রিয়েল-টাইমে কোনো টাইপ কাস্টিং ছাড়াই সচল)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.en || !formData.slug) {
            toast.error('English Title and Slug are required');
            return;
        }
        try {
            if (editMode && currentId) {
                await updateBlogPost(currentId, formData);
                toast.success('Blog post updated successfully');
            }
            else {
                await createBlogPost(formData);
                toast.success('New blog post created');
            }
            setIsModalOpen(false);
            fetchPosts();
        }
        catch (error) {
            console.error(error);
            toast.error('Submission failed. Check console for details.');
        }
    };
    const handleTagAdd = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
            }
            setTagInput('');
        }
    };
    const removeTag = (tag) => {
        setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this post permanently?'))
            return;
        try {
            await deleteBlogPost(id);
            toast.success('Post deleted');
            fetchPosts();
        }
        catch (error) {
            toast.error('Failed to delete');
        }
    };
    const filteredPosts = posts.filter(p => p.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.title.bn.includes(searchQuery));
    return (_jsxs("div", { className: "p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-white tracking-tight flex items-center gap-3", children: [_jsx(FileText, { className: "w-8 h-8 text-electric" }), language === 'en' ? 'Blog Insights' : 'ব্লগ ম্যানেজমেন্ট'] }), _jsx("p", { className: "text-soft-gray mt-1 text-sm", children: "Manage bilingual articles and industry trends." })] }), _jsxs("button", { onClick: () => { setEditMode(false); setFormData(initialFormState); setIsModalOpen(true); }, className: "flex items-center gap-2 px-6 py-3 bg-electric hover:bg-electric-bright text-navy font-bold rounded-xl transition-all shadow-[0_10px_20px_rgba(22,139,255,0.2)] active:scale-95", children: [_jsx(Plus, { className: "w-5 h-5" }), language === 'en' ? 'Write Article' : 'নতুন ব্লগ লিখুন'] })] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" }), _jsx("input", { type: "text", placeholder: "Search by title...", className: "w-full bg-navy-surface border border-borderColor rounded-2xl pl-12 pr-4 py-4 text-white focus:border-electric outline-none transition-all", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })] }), _jsx("div", { className: "glass-panel border-borderColor rounded-3xl overflow-hidden shadow-2xl", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { className: "bg-white/[0.03] border-b border-borderColor text-[10px] font-mono uppercase tracking-[0.2em] text-soft-gray", children: _jsxs("tr", { children: [_jsx("th", { className: "px-8 py-5", children: "Post Overview" }), _jsx("th", { className: "px-6 py-5", children: "Status" }), _jsx("th", { className: "px-6 py-5", children: "Category" }), _jsx("th", { className: "px-8 py-5 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-borderColor/50", children: loading ? ([...Array(3)].map((_, i) => _jsx("tr", { className: "animate-pulse", children: _jsx("td", { colSpan: 4, className: "px-8 py-10 bg-white/[0.01]" }) }, i))) : filteredPosts.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "px-8 py-20 text-center text-soft-gray", children: "No blog posts found." }) })) : (filteredPosts.map((post) => (_jsxs("tr", { className: "group hover:bg-white/[0.02] transition-colors", children: [_jsx("td", { className: "px-8 py-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-16 h-12 rounded-lg bg-navy border border-borderColor overflow-hidden relative", children: post.coverImage ? (_jsx("img", { src: post.coverImage, alt: "", className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center text-white/10", children: _jsx(ImageIcon, { className: "w-4 h-4" }) })) }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-white group-hover:text-electric transition-colors line-clamp-1", children: post.title.en }), _jsx("p", { className: "text-[11px] text-soft-gray mt-0.5 font-mono", children: post.slug })] })] }) }), _jsx("td", { className: "px-6 py-6", children: _jsx("span", { className: `px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${post.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-white/30 border-white/10'}`, children: post.status }) }), _jsx("td", { className: "px-6 py-6 text-xs text-soft-gray", children: post.category }), _jsx("td", { className: "px-8 py-6 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [_jsx("button", { onClick: () => {
                                                            setEditMode(true);
                                                            setCurrentId(post.id);
                                                            // ৬. ডিস্ট্রাকচার করে ডাটাবেসের জেনারেটেড ফিল্ডগুলো রিমুভ করা হচ্ছে যাতে টাইপ মিসম্যাচ না হয়
                                                            const { id, createdAt, updatedAt, publishedAt, ...rest } = post;
                                                            setFormData(rest);
                                                            setIsModalOpen(true);
                                                        }, className: "p-2.5 bg-white/5 hover:bg-electric text-white hover:text-navy rounded-xl transition-all", children: _jsx(Edit3, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(post.id), className: "p-2.5 bg-white/5 hover:bg-red-500 text-white rounded-xl transition-all", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, post.id)))) })] }) }) }), isModalOpen && (_jsxs("div", { className: "fixed inset-0 z-[4000] flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-navy/98 backdrop-blur-xl" }), _jsxs("div", { className: "relative w-full h-full lg:w-[95%] lg:h-[95vh] bg-navy-surface border border-borderColor lg:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-500", children: [_jsxs("div", { className: "p-6 lg:p-8 border-b border-borderColor flex justify-between items-center bg-white/[0.01]", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-electric/10 flex items-center justify-center text-electric", children: _jsx(FileText, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-white", children: editMode ? 'Edit Article' : 'Draft New Article' }), _jsx("p", { className: "text-[10px] text-soft-gray uppercase tracking-widest font-mono mt-0.5", children: "Global Editorial Panel" })] })] }), _jsx("button", { onClick: () => setIsModalOpen(false), className: "p-3 hover:bg-white/5 rounded-full text-soft-gray transition-all", children: _jsx(X, {}) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 space-y-16 pb-32", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-electric/30" }), " 01. Content Identity"] }), _jsx("input", { required: true, type: "text", placeholder: "Article Title (EN)", className: "w-full bg-navy border border-borderColor rounded-2xl px-6 py-4 text-lg font-bold text-white focus:border-electric outline-none", value: formData.title.en, onChange: (e) => {
                                                            const val = e.target.value;
                                                            setFormData({ ...formData, title: { ...formData.title, en: val }, slug: val.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') });
                                                        } }), _jsx("input", { type: "text", placeholder: "\u0986\u09B0\u09CD\u099F\u09BF\u0995\u09C7\u09B2 \u099F\u09BE\u0987\u099F\u09C7\u09B2 (\u09AC\u09BE\u0982\u09B2\u09BE)", className: "w-full bg-navy border border-borderColor rounded-2xl px-6 py-4 text-lg font-bold text-white focus:border-electric outline-none", value: formData.title.bn, onChange: (e) => setFormData({ ...formData, title: { ...formData.title, bn: e.target.value } }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xs font-black text-purple uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-purple/30" }), " 02. Taxonomy"] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase ml-1", children: "URL Slug" }), _jsxs("div", { className: "relative flex items-center", children: [_jsx(Globe, { className: "absolute left-4 w-4 h-4 text-soft-gray" }), _jsx("input", { required: true, type: "text", className: "w-full bg-navy border border-borderColor rounded-xl pl-12 pr-4 py-3 text-xs text-electric font-mono outline-none", value: formData.slug, onChange: (e) => setFormData({ ...formData, slug: e.target.value }) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase ml-1", children: "Category" }), _jsxs("select", { className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-xs text-white outline-none", value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), children: [_jsx("option", { value: "Technology", children: "Technology" }), _jsx("option", { value: "Business", children: "Business" }), _jsx("option", { value: "UI/UX Design", children: "UI/UX Design" }), _jsx("option", { value: "AI", children: "AI & Future" })] })] })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-electric/30" }), " 03. English Content"] }), _jsx("div", { className: "bg-navy border border-borderColor rounded-3xl overflow-hidden min-h-[400px]", children: _jsx(ReactQuill, { theme: "snow", value: formData.content.en, onChange: (val) => setFormData({ ...formData, content: { ...formData.content, en: val } }), modules: quillModules, className: "h-[350px] text-white" }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xs font-black text-purple uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-purple/30" }), " 04. \u09AC\u09BE\u0982\u09B2\u09BE \u0995\u09A8\u09CD\u099F\u09C7\u09A8\u09CD\u099F (BN)"] }), _jsx("div", { className: "bg-navy border border-borderColor rounded-3xl overflow-hidden min-h-[400px]", children: _jsx(ReactQuill, { theme: "snow", value: formData.content.bn, onChange: (val) => setFormData({ ...formData, content: { ...formData.content, bn: val } }), modules: quillModules, className: "h-[350px] text-white" }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xs font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-emerald-500/30" }), " 05. Direct Cover Image Upload (From PC)"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 bg-navy/20 border border-borderColor rounded-3xl p-8 items-center", children: [_jsxs("div", { className: "md:col-span-2 relative border-2 border-dashed border-borderColor hover:border-electric rounded-2xl p-6 transition-colors bg-navy text-center flex flex-col items-center justify-center min-h-[160px] overflow-hidden group", children: [_jsx("input", { type: "file", disabled: isUploadingImage, onChange: handleDirectImageUpload, className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed", accept: "image/*" }), formData.coverImage ? (_jsxs("div", { className: "w-full h-full flex flex-col items-center gap-2", children: [_jsx("img", { src: formData.coverImage, alt: "Cover Preview", className: "w-24 h-16 object-cover rounded-lg border border-borderColor" }), _jsx("span", { className: "text-xs text-[#168BFF] font-bold", children: "Change Image from PC" })] })) : (_jsxs("div", { className: "flex flex-col items-center", children: [_jsx(UploadCloud, { className: "w-10 h-10 text-white/20 mb-2 group-hover:text-electric transition-colors" }), _jsx("span", { className: "text-xs font-bold text-white", children: "Select Cover Image from Computer" }), _jsx("span", { className: "text-[10px] text-soft-gray mt-1", children: "Supports PNG, JPG, WebP (Max 15MB)" })] }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("span", { className: "text-xs font-mono text-soft-gray uppercase tracking-widest block", children: "Cloud Link Status" }), isUploadingImage ? (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-[10px] font-mono font-bold text-electric", children: [_jsx("span", { children: "Uploading..." }), _jsxs("span", { children: [Math.round(imageProgress), "%"] })] }), _jsx("div", { className: "w-full bg-navy border border-borderColor rounded-full h-1.5 overflow-hidden", children: _jsx("div", { className: "bg-electric h-full rounded-full transition-all duration-300", style: { width: `${imageProgress}%` } }) })] })) : formData.coverImage ? (_jsxs("div", { className: "flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold", children: [_jsx(Check, { className: "w-4 h-4" }), " Ready to Publish"] })) : (_jsx("div", { className: "text-xs text-soft-gray font-mono italic", children: "No file selected yet" })), _jsx("input", { type: "text", readOnly: true, placeholder: "Cloudinary URL", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-2.5 text-[10px] font-mono text-white/50 mt-2 select-all outline-none", value: formData.coverImage })] })] })] }), _jsxs("div", { className: "space-y-6 pb-20", children: [_jsxs("h3", { className: "text-xs font-black text-amber-500 uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-amber-500/30" }), " 06. Metadata & Status"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 bg-navy/30 border border-borderColor rounded-3xl p-8", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("input", { type: "text", placeholder: "Cover Image URL", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-xs text-white", value: formData.coverImage, onChange: (e) => setFormData({ ...formData, coverImage: e.target.value }) }), _jsx("textarea", { rows: 3, placeholder: "Excerpt (Short Summary)", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-xs text-white resize-none", value: formData.excerpt.en, onChange: (e) => setFormData({ ...formData, excerpt: { ...formData.excerpt, en: e.target.value } }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("input", { type: "text", placeholder: "Tags (Enter)", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-xs text-white", value: tagInput, onChange: (e) => setTagInput(e.target.value), onKeyDown: handleTagAdd }), _jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: formData.tags.map(tag => (_jsxs("span", { className: "flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 text-[10px] text-soft-gray rounded-md", children: [tag, " ", _jsx("button", { type: "button", onClick: () => removeTag(tag), children: _jsx(X, { className: "w-3 h-3 hover:text-white" }) })] }, tag))) })] }), _jsxs("select", { className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-xs text-white", value: formData.status, onChange: (e) => setFormData({ ...formData, status: e.target.value }), children: [_jsx("option", { value: "Draft", children: "Draft" }), _jsx("option", { value: "Published", children: "Live" })] })] })] })] }), _jsxs("div", { className: "fixed bottom-0 left-0 right-0 p-6 bg-navy-surface/80 backdrop-blur-xl border-t border-borderColor z-10 flex items-center justify-end gap-4", children: [_jsx("button", { type: "button", disabled: isUploadingImage, onClick: () => setIsModalOpen(false), className: "px-8 py-3 bg-white/5 text-white font-bold rounded-xl transition-all disabled:opacity-50", children: "Discard" }), _jsxs("button", { type: "submit", disabled: isUploadingImage, className: "px-12 py-3 bg-electric hover:bg-electric-bright text-navy font-black rounded-xl transition-all shadow-[0_10px_40px_rgba(22,139,255,0.3)] flex items-center gap-2 disabled:opacity-50", children: [_jsx(Check, { className: "w-5 h-5" }), editMode ? 'Update' : 'Publish'] })] })] })] })] }))] }));
};
