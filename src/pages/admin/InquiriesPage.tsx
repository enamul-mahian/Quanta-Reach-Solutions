import React, { useState, useEffect } from 'react';
import { 
  getAllInquiries, 
  updateInquiryStatus, 
  deleteInquiry, 
  ProjectInquiry, 
  InquiryStatus 
} from '@/services/inquiryService';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  ExternalLink, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Eye, 
  X,
  Download,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

export const InquiriesPage: React.FC = () => {
  const { language } = useLanguage();
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedInquiry, setSelectedInquiry] = useState<ProjectInquiry | null>(null);

  // ১. ডাটা লোড করা
  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const data = await getAllInquiries();
      setInquiries(data);
    } catch (error) {
      toast.error(language === 'en' ? 'Failed to fetch inquiries' : 'ইনকোয়ারি লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // ২. স্ট্যাটাস আপডেট হ্যান্ডলার
  const handleStatusUpdate = async (id: string, newStatus: InquiryStatus) => {
    try {
      await updateInquiryStatus(id, newStatus);
      setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      toast.success(language === 'en' ? `Status updated to ${newStatus}` : `স্ট্যাটাস ${newStatus} এ আপডেট হয়েছে`);
    } catch (error) {
      toast.error(language === 'en' ? 'Update failed' : 'আপডেট ব্যর্থ হয়েছে');
    }
  };

  // ৩. ডিলিট হ্যান্ডলার
  const handleDelete = async (id: string) => {
    if (!window.confirm(language === 'en' ? 'Are you sure you want to delete this inquiry?' : 'আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?')) return;
    try {
      await deleteInquiry(id);
      setInquiries(prev => prev.filter(item => item.id !== id));
      toast.success(language === 'en' ? 'Inquiry deleted' : 'ইনকোয়ারি মুছে ফেলা হয়েছে');
    } catch (error) {
      toast.error(language === 'en' ? 'Delete failed' : 'ডিলিট ব্যর্থ হয়েছে');
    }
  };

  // ৪. ফিল্টারিং লজিক
  const filteredInquiries = inquiries.filter(item => {
    const matchesSearch = item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.projectType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: InquiryStatus) => {
    switch (status) {
      case 'New': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Won': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Lost': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Negotiation': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {language === 'en' ? 'Project Inquiries' : 'প্রজেক্ট ইনকোয়ারি সমূহ'}
          </h1>
          <p className="text-soft-gray text-sm">
            {language === 'en' ? `Total ${filteredInquiries.length} leads found` : `মোট ${filteredInquiries.length}টি লিড পাওয়া গেছে`}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-gray" />
            <input 
              type="text" 
              placeholder={language === 'en' ? "Search leads..." : "লিড খুঁজুন..."}
              className="bg-navy border border-borderColor rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-electric outline-none transition-all w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="bg-navy border border-borderColor rounded-xl px-4 py-2 text-sm text-white focus:border-electric outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-panel border-borderColor rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/[0.02] border-b border-borderColor text-xs font-mono uppercase tracking-widest text-soft-gray">
            <tr>
              <th className="px-6 py-4">{language === 'en' ? 'Client' : 'ক্লায়েন্ট'}</th>
              <th className="px-6 py-4">{language === 'en' ? 'Project' : 'প্রজেক্ট'}</th>
              <th className="px-6 py-4">{language === 'en' ? 'Budget' : 'বাজেট'}</th>
              <th className="px-6 py-4">{language === 'en' ? 'Status' : 'স্ট্যাটাস'}</th>
              <th className="px-6 py-4">{language === 'en' ? 'Date' : 'তারিখ'}</th>
              <th className="px-6 py-4 text-right">{language === 'en' ? 'Actions' : 'অ্যাকশন'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderColor">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-6 bg-white/[0.01]" />
                </tr>
              ))
            ) : filteredInquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-soft-gray">
                  No inquiries matching your criteria.
                </td>
              </tr>
            ) : (
              filteredInquiries.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{item.fullName}</span>
                      <span className="text-xs text-soft-gray">{item.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-white/80">{item.projectType}</span>
                      <span className="text-[10px] text-electric uppercase font-bold">{item.clientType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-bold text-white">
                      {item.currency === 'USD' ? '$' : '৳'}{item.estimatedBudget}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-soft-gray">
                    {item.createdAt?.toDate().toLocaleDateString() || 'Just now'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedInquiry(item)}
                        className="p-2 hover:bg-electric/10 text-soft-gray hover:text-electric rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id!)}
                        className="p-2 hover:bg-red-500/10 text-soft-gray hover:text-red-400 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#071426]/90 backdrop-blur-sm" onClick={() => setSelectedInquiry(null)} />
          <div className="relative w-full max-w-2xl bg-navy-surface border border-borderColor rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-borderColor flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedInquiry.fullName}</h2>
                <p className="text-xs text-soft-gray uppercase tracking-widest">{selectedInquiry.companyName || 'No Company'}</p>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="p-2 hover:bg-white/5 rounded-full text-soft-gray transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-6 custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-soft-gray block mb-1">Contact Information</label>
                  <p className="text-sm text-white flex items-center gap-2 mb-1">
                    <Mail className="w-3.5 h-3.5 text-electric" /> {selectedInquiry.email}
                  </p>
                  <p className="text-sm text-white flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-electric" /> {selectedInquiry.phone}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-soft-gray block mb-1">Budget & Currency</label>
                  <p className="text-lg font-mono font-bold text-white">
                    {selectedInquiry.currency === 'USD' ? '$' : '৳'}{selectedInquiry.estimatedBudget}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-soft-gray block mb-2">Required Services</label>
                <div className="flex flex-wrap gap-2">
                  {selectedInquiry.requiredServices.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-electric/5 border border-electric/20 rounded-full text-[10px] font-medium text-electric">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-soft-gray block mb-2">Project Description</label>
                <div className="p-4 bg-navy rounded-xl border border-borderColor text-sm text-white/70 leading-relaxed italic">
                  "{selectedInquiry.projectDescription}"
                </div>
              </div>

              {selectedInquiry.fileUrl && (
                <a 
                  href={selectedInquiry.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 border border-borderColor rounded-xl text-sm font-bold text-white transition-all"
                >
                  <Download className="w-4 h-4 text-electric" /> View Attachment Brief
                </a>
              )}

              <div className="pt-4 border-t border-borderColor flex flex-wrap gap-3">
                <select 
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusUpdate(selectedInquiry.id!, e.target.value as InquiryStatus)}
                  className="flex-1 bg-navy border border-borderColor rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-electric"
                >
                  <option value="New">Status: New</option>
                  <option value="Contacted">Status: Contacted</option>
                  <option value="Qualified">Status: Qualified</option>
                  <option value="Proposal Sent">Status: Proposal Sent</option>
                  <option value="Negotiation">Status: Negotiation</option>
                  <option value="Won">Status: Won</option>
                  <option value="Lost">Status: Lost</option>
                </select>

                <a 
                  href={`mailto:${selectedInquiry.email}`}
                  className="p-3 bg-electric/20 text-electric rounded-xl hover:bg-electric hover:text-navy transition-all"
                  title="Send Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
                
                {selectedInquiry.whatsappNumber && (
                  <a 
                    href={`https://wa.me/${selectedInquiry.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500 hover:text-navy transition-all"
                    title="WhatsApp Chat"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};