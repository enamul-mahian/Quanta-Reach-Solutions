import React, { useState, useEffect, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
// নতুন ফ্ল্যাট ইনপুট টাইপ BlogFormInput ইম্পোর্ট করা হয়েছে
import { 
  getBlogPosts, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost, 
  BlogPost,
  BlogFormInput
} from '../../services/blogService'; 
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../contexts/AuthContext';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { saveMediaRecord } from '../../services/mediaService';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  FileText, 
  X, 
  Check, 
  Image as ImageIcon, 
  Tag, 
  Globe, 
  Clock, 
  ChevronRight,
  UploadCloud
} from 'lucide-react';
import toast from 'react-hot-toast';

export const BlogManagerPage: React.FC = () => {
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // ডাইনামিক কভার ইমেজ আপলোড প্রগ্রেস স্টেট
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);

  // ১. ডাইনামিক ফর্ম স্টেট (BlogFormInput টাইপ দ্বারা সম্পূর্ণ সুরক্ষিত)
  const initialFormState: BlogFormInput = {
    title: { en: '', bn: '' },
    slug: '',
    excerpt: { en: '', bn: '' },
    content: { en: '', bn: '' },
    coverImage: '',
    author: {
      name: currentUser?.displayName || 'MetaFore Admin',
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

  const [formData, setFormData] = useState<BlogFormInput>(initialFormState);
  const [tagInput, setTagInput] = useState('');

  // ২. ডাটা ফেচিং
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getBlogPosts({ status: 'All' });
      setPosts(data);
    } catch (error) {
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ৩. ডিরেক্ট ইমেজ আপলোড লজিক (Cloudinary + Firestore Media Library Sync)
  const handleDirectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          resourceType: 'image' as const,
          format: file.name.split('.').pop() || 'jpg',
          size: file.size,
          folder: 'blog',
          title: file.name,
          altText: formData.title.en || 'Blog Cover',
          uploadedBy: currentUser?.displayName || 'Admin'
        };
        await saveMediaRecord(mediaRecord);

      } catch (error) {
        console.error(error);
        toast.error(language === 'en' ? 'Image upload failed' : 'ছবি আপলোড ব্যর্থ হয়েছে', { id: toastId });
      } finally {
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
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'clean']
    ],
  }), []);

  // ৫. সাবমিট হ্যান্ডলার (রিয়েল-টাইমে কোনো টাইপ কাস্টিং ছাড়াই সচল)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.en || !formData.slug) {
      toast.error('English Title and Slug are required');
      return;
    }

    try {
      if (editMode && currentId) {
        await updateBlogPost(currentId, formData);
        toast.success('Blog post updated successfully');
      } else {
        await createBlogPost(formData);
        toast.success('New blog post created');
      }
      setIsModalOpen(false);
      fetchPosts();
    } catch (error) {
      console.error(error);
      toast.error('Submission failed. Check console for details.');
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this post permanently?')) return;
    try {
      await deleteBlogPost(id);
      toast.success('Post deleted');
      fetchPosts();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.title.bn.includes(searchQuery)
  );

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-electric" />
            {language === 'en' ? 'Blog Insights' : 'ব্লগ ম্যানেজমেন্ট'}
          </h1>
          <p className="text-soft-gray mt-1 text-sm">Manage bilingual articles and industry trends.</p>
        </div>
        
        <button 
          onClick={() => { setEditMode(false); setFormData(initialFormState); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-electric hover:bg-bright-blue text-navy font-bold rounded-xl transition-all shadow-[0_10px_20px_rgba(22,139,255,0.2)] active:scale-95"
        >
          <Plus className="w-5 h-5" />
          {language === 'en' ? 'Write Article' : 'নতুন ব্লগ লিখুন'}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" />
        <input 
          type="text"
          placeholder="Search by title..."
          className="w-full bg-navy-surface border border-borderColor rounded-2xl pl-12 pr-4 py-4 text-white focus:border-electric outline-none transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="glass-panel border-borderColor rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.03] border-b border-borderColor text-[10px] font-mono uppercase tracking-[0.2em] text-soft-gray">
              <tr>
                <th className="px-8 py-5">Post Overview</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderColor/50">
              {loading ? (
                [...Array(3)].map((_, i) => <tr key={i} className="animate-pulse"><td colSpan={4} className="px-8 py-10 bg-white/[0.01]" /></tr>)
              ) : filteredPosts.length === 0 ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center text-soft-gray">No blog posts found.</td></tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg bg-navy border border-borderColor overflow-hidden relative">
                          {post.coverImage ? (
                            <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/10"><ImageIcon className="w-4 h-4" /></div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-electric transition-colors line-clamp-1">{post.title.en}</h4>
                          <p className="text-[11px] text-soft-gray mt-0.5 font-mono">{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        post.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-white/30 border-white/10'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-xs text-soft-gray">
                      {post.category}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { 
                          setEditMode(true); 
                          setCurrentId(post.id!); 
                          // ৬. ডিস্ট্রাকচার করে ডাটাবেসের জেনারেটেড ফিল্ডগুলো রিমুভ করা হচ্ছে যাতে টাইপ মিসম্যাচ না হয়
                          const { id, createdAt, updatedAt, publishedAt, ...rest } = post;
                          setFormData(rest); 
                          setIsModalOpen(true); 
                        }} className="p-2.5 bg-white/5 hover:bg-electric text-white hover:text-navy rounded-xl transition-all"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(post.id!)} className="p-2.5 bg-white/5 hover:bg-red-500 text-white rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center">
          <div className="absolute inset-0 bg-navy/98 backdrop-blur-xl" />
          <div className="relative w-full h-full lg:w-[95%] lg:h-[95vh] bg-navy-surface border border-borderColor lg:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-500">
            {/* Modal Header */}
            <div className="p-6 lg:p-8 border-b border-borderColor flex justify-between items-center bg-white/[0.01]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-electric/10 flex items-center justify-center text-electric"><FileText className="w-6 h-6" /></div>
                <div>
                  <h2 className="text-xl font-bold text-white">{editMode ? 'Edit Article' : 'Draft New Article'}</h2>
                  <p className="text-[10px] text-soft-gray uppercase tracking-widest font-mono mt-0.5">Global Editorial Panel</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/5 rounded-full text-soft-gray transition-all"><X /></button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 space-y-16 pb-32">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4">
                    <span className="w-10 h-[1px] bg-electric/30"></span> 01. Content Identity
                  </h3>
                  <input required type="text" placeholder="Article Title (EN)" className="w-full bg-navy border border-borderColor rounded-2xl px-6 py-4 text-lg font-bold text-white focus:border-electric outline-none" 
                    value={formData.title.en} onChange={(e) => {
                      const val = e.target.value;
                      setFormData({...formData, title: {...formData.title, en: val}, slug: val.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')});
                    }}
                  />
                  <input type="text" placeholder="আর্টিকেল টাইটেল (বাংলা)" className="w-full bg-navy border border-borderColor rounded-2xl px-6 py-4 text-lg font-bold text-white focus:border-electric outline-none" 
                    value={formData.title.bn} onChange={(e) => setFormData({...formData, title: {...formData.title, bn: e.target.value}})}
                  />
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-black text-purple uppercase tracking-[0.3em] flex items-center gap-4">
                    <span className="w-10 h-[1px] bg-purple/30"></span> 02. Taxonomy
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-soft-gray uppercase ml-1">URL Slug</label>
                       <div className="relative flex items-center">
                          <Globe className="absolute left-4 w-4 h-4 text-soft-gray" />
                          <input required type="text" className="w-full bg-navy border border-borderColor rounded-xl pl-12 pr-4 py-3 text-xs text-electric font-mono outline-none" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-soft-gray uppercase ml-1">Category</label>
                       <select className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-xs text-white outline-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                          <option value="Technology">Technology</option>
                          <option value="Business">Business</option>
                          <option value="UI/UX Design">UI/UX Design</option>
                          <option value="AI">AI & Future</option>
                       </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rich Text Editor - English */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4">
                  <span className="w-10 h-[1px] bg-electric/30"></span> 03. English Content
                </h3>
                <div className="bg-navy border border-borderColor rounded-3xl overflow-hidden min-h-[400px]">
                   <ReactQuill theme="snow" value={formData.content.en} onChange={(val) => setFormData({...formData, content: {...formData.content, en: val}})} modules={quillModules} className="h-[350px] text-white" />
                </div>
              </div>

              {/* Rich Text Editor - Bangla */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-purple uppercase tracking-[0.3em] flex items-center gap-4">
                  <span className="w-10 h-[1px] bg-purple/30"></span> 04. বাংলা কন্টেন্ট (BN)
                </h3>
                <div className="bg-navy border border-borderColor rounded-3xl overflow-hidden min-h-[400px]">
                   <ReactQuill theme="snow" value={formData.content.bn} onChange={(val) => setFormData({...formData, content: {...formData.content, bn: val}})} modules={quillModules} className="h-[350px] text-white" />
                </div>
              </div>

              {/* Cover Image Direct Upload Field */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-4">
                  <span className="w-10 h-[1px] bg-emerald-500/30"></span> 05. Direct Cover Image Upload (From PC)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-navy/20 border border-borderColor rounded-3xl p-8 items-center">
                  <div className="md:col-span-2 relative border-2 border-dashed border-borderColor hover:border-electric rounded-2xl p-6 transition-colors bg-navy text-center flex flex-col items-center justify-center min-h-[160px] overflow-hidden group">
                    <input 
                      type="file" 
                      disabled={isUploadingImage}
                      onChange={handleDirectImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed" 
                      accept="image/*"
                    />
                    
                    {formData.coverImage ? (
                      <div className="w-full h-full flex flex-col items-center gap-2">
                        <img src={formData.coverImage} alt="Cover Preview" className="w-24 h-16 object-cover rounded-lg border border-borderColor" />
                        <span className="text-xs text-[#168BFF] font-bold">Change Image from PC</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <UploadCloud className="w-10 h-10 text-white/20 mb-2 group-hover:text-electric transition-colors" />
                        <span className="text-xs font-bold text-white">Select Cover Image from Computer</span>
                        <span className="text-[10px] text-soft-gray mt-1">Supports PNG, JPG, WebP (Max 15MB)</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                     <span className="text-xs font-mono text-soft-gray uppercase tracking-widest block">Cloud Link Status</span>
                     {isUploadingImage ? (
                       <div className="space-y-2">
                         <div className="flex justify-between text-[10px] font-mono font-bold text-electric">
                           <span>Uploading...</span>
                           <span>{Math.round(imageProgress)}%</span>
                         </div>
                         <div className="w-full bg-navy border border-borderColor rounded-full h-1.5 overflow-hidden">
                           <div className="bg-electric h-full rounded-full transition-all duration-300" style={{ width: `${imageProgress}%` }} />
                         </div>
                       </div>
                     ) : formData.coverImage ? (
                       <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                         <Check className="w-4 h-4" /> Ready to Publish
                       </div>
                     ) : (
                       <div className="text-xs text-soft-gray font-mono italic">No file selected yet</div>
                     )}
                     <input 
                       type="text" 
                       readOnly
                       placeholder="Cloudinary URL" 
                       className="w-full bg-navy border border-borderColor rounded-xl px-4 py-2.5 text-[10px] font-mono text-white/50 mt-2 select-all outline-none"
                       value={formData.coverImage}
                     />
                  </div>
                </div>
              </div>

              {/* SEO and Status */}
              <div className="space-y-6 pb-20">
                <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] flex items-center gap-4">
                  <span className="w-10 h-[1px] bg-amber-500/30"></span> 06. Metadata & Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-navy/30 border border-borderColor rounded-3xl p-8">
                   <div className="space-y-4">
                      <input type="text" placeholder="Cover Image URL" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-xs text-white" 
                        value={formData.coverImage} onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                      />
                      <textarea rows={3} placeholder="Excerpt (Short Summary)" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-xs text-white resize-none" 
                        value={formData.excerpt.en} onChange={(e) => setFormData({...formData, excerpt: {...formData.excerpt, en: e.target.value}})}
                      />
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-2">
                         <input type="text" placeholder="Tags (Enter)" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-xs text-white" 
                           value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagAdd}
                         />
                         <div className="flex flex-wrap gap-2 mt-2">
                            {formData.tags.map(tag => (
                              <span key={tag} className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 text-[10px] text-soft-gray rounded-md">
                                {tag} <button type="button" onClick={() => removeTag(tag)}><X className="w-3 h-3 hover:text-white" /></button>
                              </span>
                            ))}
                         </div>
                      </div>
                      <select className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-xs text-white" 
                        value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      >
                         <option value="Draft">Draft</option>
                         <option value="Published">Live</option>
                      </select>
                   </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="fixed bottom-0 left-0 right-0 p-6 bg-navy-surface/80 backdrop-blur-xl border-t border-borderColor z-10 flex items-center justify-end gap-4">
                  <button type="button" disabled={isUploadingImage} onClick={() => setIsModalOpen(false)} className="px-8 py-3 bg-white/5 text-white font-bold rounded-xl transition-all disabled:opacity-50">Discard</button>
                  <button type="submit" disabled={isUploadingImage} className="px-12 py-3 bg-electric hover:bg-bright-blue text-navy font-black rounded-xl transition-all shadow-[0_10px_40px_rgba(22,139,255,0.3)] flex items-center gap-2 disabled:opacity-50">
                    <Check className="w-5 h-5" />
                    {editMode ? 'Update' : 'Publish'}
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};