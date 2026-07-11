import React, { useState, useEffect } from 'react';
import { 
  getAllMeetings, 
  updateMeetingDetails, 
  deleteMeetingRequest, 
  MeetingRequest, 
  MeetingStatus 
} from '@/services/meetingService';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  CalendarDays, 
  Search, 
  Video, 
  MapPin, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Globe2, 
  Link as LinkIcon,
  MessageSquare,
  Edit3, 
  Trash2, 
  X, 
  Check, 
  Eye,
  CalendarCheck2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const MeetingRequestsPage: React.FC = () => {
  const { language } = useLanguage();
  const [meetings, setMeetings] = useState<MeetingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // মডালের জন্য এডিটেবল স্টেট
  const [modalStatus, setModalStatus] = useState<MeetingStatus>('Pending');
  const [modalLink, setModalLink] = useState('');
  const [modalInstructions, setModalInstructions] = useState('');
  const [modalNotes, setModalNotes] = useState('');

  // ১. ডাটা ফেচিং
  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const data = await getAllMeetings();
      setMeetings(data);
    } catch (error) {
      toast.error('Failed to load meeting requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  // ২. মডাল ওপেন হ্যান্ডলার
  const openModal = (meeting: MeetingRequest) => {
    setSelectedMeeting(meeting);
    setModalStatus(meeting.status);
    setModalLink(meeting.meetingLink || '');
    setModalInstructions(meeting.officeInstructions || '');
    setModalNotes(meeting.adminNotes || '');
    setIsModalOpen(true);
  };

  // ৩. আপডেট হ্যান্ডলার
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeeting?.id) return;

    setUpdateLoading(true);
    try {
      await updateMeetingDetails(selectedMeeting.id, {
        status: modalStatus,
        meetingLink: modalLink,
        officeInstructions: modalInstructions,
        adminNotes: modalNotes
      });
      toast.success('Meeting updated successfully');
      setIsModalOpen(false);
      fetchMeetings();
    } catch (error) {
      toast.error('Failed to update meeting');
    } finally {
      setUpdateLoading(false);
    }
  };

  // ৪. ডিলিট হ্যান্ডলার
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this meeting request?')) return;
    try {
      await deleteMeetingRequest(id);
      toast.success('Meeting request deleted');
      setMeetings(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      toast.error('Failed to delete request');
    }
  };

  // ফিল্টারিং
  const filteredMeetings = meetings.filter(m => {
    const matchesSearch = m.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.meetingTopic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: MeetingStatus) => {
    switch (status) {
      case 'Approved': return 'bg-electric/10 text-electric border-electric/20';
      case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Rescheduled': return 'bg-purple/10 text-purple border-purple/20';
      default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-electric" />
            {language === 'en' ? 'Meeting Requests' : 'মিটিং রিকোয়েস্ট সমূহ'}
          </h1>
          <p className="text-soft-gray mt-1 text-sm">
            Manage client consultations, schedule online calls, and setup office visits.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" />
          <input 
            type="text"
            placeholder="Search by client, company, or topic..."
            className="w-full bg-navy-surface border border-borderColor rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-electric outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="bg-navy-surface border border-borderColor rounded-2xl px-6 py-3.5 text-white focus:border-electric outline-none font-bold"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rescheduled">Rescheduled</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Meetings Table */}
      <div className="glass-panel border-borderColor rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.03] border-b border-borderColor text-[10px] font-mono uppercase tracking-[0.2em] text-soft-gray">
              <tr>
                <th className="px-8 py-5">Client Info</th>
                <th className="px-6 py-5">Topic & Type</th>
                <th className="px-6 py-5">Requested Schedule</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderColor/50">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse"><td colSpan={5} className="px-8 py-10 bg-white/[0.01]" /></tr>
                ))
              ) : filteredMeetings.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-soft-gray">No meeting requests found.</td></tr>
              ) : (
                filteredMeetings.map((meeting) => (
                  <tr key={meeting.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-electric transition-colors">{meeting.clientName}</span>
                        <span className="text-xs text-soft-gray flex items-center gap-1 mt-0.5">
                          {meeting.companyName || 'Individual Client'} 
                          <span className="w-1 h-1 rounded-full bg-white/20 mx-1"></span>
                          <span className={`uppercase tracking-wider ${meeting.clientType === 'Global' ? 'text-purple' : 'text-amber-500'}`}>{meeting.clientType}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-white/90 line-clamp-1">{meeting.meetingTopic}</span>
                        <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-soft-gray">
                          {meeting.meetingType === 'Online' ? <Video className="w-3.5 h-3.5 text-electric" /> : <MapPin className="w-3.5 h-3.5 text-amber-500" />}
                          {meeting.meetingType} Meeting
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="font-mono text-white flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5 text-soft-gray"/> {meeting.preferredDate}</span>
                        <span className="font-mono text-electric flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-soft-gray"/> {meeting.preferredTime} ({meeting.timeZone})</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(meeting.status)}`}>
                        {meeting.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(meeting)} className="p-2.5 bg-white/5 hover:bg-electric text-white hover:text-navy rounded-xl transition-all"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(meeting.id!)} className="p-2.5 bg-white/5 hover:bg-red-500 text-white rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Update Modal */}
      {isModalOpen && selectedMeeting && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 lg:p-8">
          <div className="absolute inset-0 bg-navy/95 backdrop-blur-md" onClick={() => !updateLoading && setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-5xl bg-navy-surface border border-borderColor rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-full animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-6 lg:p-8 border-b border-borderColor flex justify-between items-center bg-white/[0.01]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-electric/10 flex items-center justify-center text-electric">
                  <CalendarCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Review Meeting Request</h2>
                  <p className="text-[10px] text-soft-gray uppercase tracking-widest font-mono mt-1">Submitted: {selectedMeeting.createdAt?.toDate().toLocaleDateString()}</p>
                </div>
              </div>
              <button disabled={updateLoading} onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/5 rounded-full text-soft-gray transition-all disabled:opacity-50"><X /></button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 flex flex-col lg:flex-row gap-10">
              
              {/* Left Column: Client & Request Details */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="space-y-4 bg-navy border border-borderColor rounded-2xl p-6">
                  <h3 className="text-xs font-black text-electric uppercase tracking-widest border-b border-borderColor pb-3">Client Identity</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-white flex items-center gap-3"><User className="w-4 h-4 text-soft-gray"/> <strong>{selectedMeeting.clientName}</strong> ({selectedMeeting.companyName || 'Individual'})</p>
                    <p className="text-sm text-white flex items-center gap-3"><Mail className="w-4 h-4 text-soft-gray"/> <a href={`mailto:${selectedMeeting.email}`} className="hover:text-electric transition-colors">{selectedMeeting.email}</a></p>
                    <p className="text-sm text-white flex items-center gap-3"><Phone className="w-4 h-4 text-soft-gray"/> {selectedMeeting.phone}</p>
                    <p className="text-sm text-white flex items-center gap-3"><Globe2 className="w-4 h-4 text-soft-gray"/> Language: <span className="uppercase text-xs font-bold text-electric ml-1">{selectedMeeting.preferredLanguage}</span></p>
                  </div>
                </div>

                <div className="space-y-4 bg-navy border border-borderColor rounded-2xl p-6">
                  <h3 className="text-xs font-black text-purple uppercase tracking-widest border-b border-borderColor pb-3">Meeting Specs</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[10px] text-soft-gray uppercase mb-1">Requested Date</span>
                        <span className="text-sm font-bold text-white font-mono">{selectedMeeting.preferredDate}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-soft-gray uppercase mb-1">Requested Time</span>
                        <span className="text-sm font-bold text-electric font-mono">{selectedMeeting.preferredTime}</span>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[10px] text-soft-gray uppercase mb-1 mt-2">Client Timezone</span>
                      <span className="text-xs text-white/70">{selectedMeeting.timeZone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-navy border border-borderColor rounded-2xl p-6">
                  <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest border-b border-borderColor pb-3">Project Summary</h3>
                  <p className="text-sm font-bold text-white mb-2">{selectedMeeting.meetingTopic}</p>
                  <p className="text-xs text-soft-gray leading-relaxed p-3 bg-navy-surface rounded-xl border border-white/5 italic">
                    "{selectedMeeting.projectSummary}"
                  </p>
                </div>
              </div>

              {/* Right Column: Admin Action Form */}
              <form onSubmit={handleUpdate} className="w-full lg:w-1/2 space-y-8 flex flex-col h-full">
                <div className="space-y-6 flex-1">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Update Status</label>
                    <select 
                      className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3.5 text-white font-bold focus:border-electric outline-none appearance-none"
                      value={modalStatus} onChange={(e) => setModalStatus(e.target.value as MeetingStatus)}
                    >
                      <option value="Pending">🕒 Pending</option>
                      <option value="Approved">✅ Approved (Ready to Meet)</option>
                      <option value="Rescheduled">🔄 Needs Reschedule</option>
                      <option value="Completed">🏆 Completed</option>
                      <option value="Rejected">❌ Rejected / Cancelled</option>
                    </select>
                  </div>

                  {selectedMeeting.meetingType === 'Online' ? (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <label className="text-[10px] font-bold text-electric uppercase tracking-widest flex items-center gap-1.5"><LinkIcon className="w-3 h-3"/> Video Call Link</label>
                      <input 
                        type="url" 
                        placeholder="https://meet.google.com/..." 
                        className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-sm font-mono text-white focus:border-electric outline-none"
                        value={modalLink} onChange={(e) => setModalLink(e.target.value)}
                      />
                      <p className="text-[10px] text-soft-gray">Client will see this link in their dashboard if approved.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <label className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5"><MapPin className="w-3 h-3"/> Office Meeting Instructions</label>
                      <textarea 
                        rows={3}
                        placeholder="Full address, floor number, contact person..." 
                        className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-sm text-white focus:border-electric outline-none resize-none"
                        value={modalInstructions} onChange={(e) => setModalInstructions(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest flex items-center gap-1.5"><MessageSquare className="w-3 h-3"/> Internal Admin Notes</label>
                    <textarea 
                      rows={4}
                      placeholder="Add private notes (not visible to client)..." 
                      className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-sm text-white focus:border-electric outline-none resize-none"
                      value={modalNotes} onChange={(e) => setModalNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-borderColor flex items-center justify-end gap-4 mt-auto">
                  <button type="button" disabled={updateLoading} onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all disabled:opacity-50">Cancel</button>
                  <button type="submit" disabled={updateLoading} className="px-10 py-3 bg-electric hover:bg-bright-blue text-navy font-black rounded-xl transition-all shadow-[0_10px_30px_rgba(22,139,255,0.3)] flex items-center gap-2 disabled:opacity-50">
                    <Check className="w-5 h-5" />
                    {updateLoading ? 'Saving...' : 'Save Configuration'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};