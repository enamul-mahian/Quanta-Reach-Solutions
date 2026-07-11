import React, { useState, useEffect } from 'react';
import { 
  getBusinessTargets, 
  createBusinessTarget, 
  updateBusinessTarget, 
  deleteBusinessTarget, 
  calculateTargetProgress,
  BusinessTarget,
  TargetCategory,
  TargetPeriod,
  TargetStatus
} from '@/services/targetService';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Target, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  TrendingUp, 
  AlertCircle, 
  Calendar, 
  Users, 
  Briefcase,
  BarChart,
  ListTodo
} from 'lucide-react';
import toast from 'react-hot-toast';

export const TargetsPage: React.FC = () => {
  const { language } = useLanguage();
  const [targets, setTargets] = useState<BusinessTarget[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState<TargetPeriod | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<TargetStatus | 'All'>('All');
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form State
  const initialFormState: Omit<BusinessTarget, 'id' | 'createdAt' | 'updatedAt'> = {
    title: '',
    category: 'Revenue',
    period: 'Monthly',
    targetAmount: 0,
    achievedAmount: 0,
    deadline: new Date().toISOString().split('T')[0],
    responsibleTeam: '',
    status: 'On Track',
    notes: '',
    actionItems: []
  };

  const [formData, setFormData] = useState(initialFormState);
  const [actionInput, setActionInput] = useState('');

  // Data Fetching
  const fetchTargets = async () => {
    setLoading(true);
    try {
      const data = await getBusinessTargets({ period: periodFilter !== 'All' ? periodFilter : undefined, status: statusFilter !== 'All' ? statusFilter : undefined });
      setTargets(data);
    } catch (error) {
      toast.error('Failed to load business targets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTargets();
  }, [periodFilter, statusFilter]);

  // Actions Handling
  const addActionItem = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && actionInput.trim()) {
      e.preventDefault();
      if (!formData.actionItems.includes(actionInput.trim())) {
        setFormData({ ...formData, actionItems: [...formData.actionItems, actionInput.trim()] });
      }
      setActionInput('');
    }
  };

  const removeActionItem = (item: string) => {
    setFormData({ ...formData, actionItems: formData.actionItems.filter(i => i !== item) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || formData.targetAmount <= 0) {
      toast.error('Title and a valid Target Amount are required');
      return;
    }

    try {
      if (editMode && currentId) {
        await updateBusinessTarget(currentId, formData);
        toast.success('Target progress updated');
      } else {
        await createBusinessTarget(formData);
        toast.success('New business target created');
      }
      setIsModalOpen(false);
      fetchTargets();
    } catch (error) {
      toast.error('Failed to save target');
    }
  };

  const openEditModal = (target: BusinessTarget) => {
    setEditMode(true);
    setCurrentId(target.id!);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, ...rest } = target;
    setFormData(rest);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('WARNING: Are you sure you want to delete this business target record?')) return;
    try {
      await deleteBusinessTarget(id);
      toast.success('Target record deleted');
      fetchTargets();
    } catch (error) {
      toast.error('Failed to delete target');
    }
  };

  // Filter local state
  const filteredTargets = targets.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.responsibleTeam.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // UI Helpers
  const getStatusColor = (status: TargetStatus) => {
    switch (status) {
      case 'Achieved': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'On Track': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'At Risk': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Missed': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-soft-gray bg-white/5 border-white/10';
    }
  };

  const getCategoryIcon = (category: TargetCategory) => {
    switch (category) {
      case 'Revenue': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'Lead Generation': return <Users className="w-5 h-5 text-electric" />;
      case 'Project Completion': return <Briefcase className="w-5 h-5 text-purple" />;
      default: return <BarChart className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Target className="w-8 h-8 text-electric" />
            {language === 'en' ? 'Internal Business Targets' : 'বিজনেস টার্গেট ও লক্ষ্যমাত্রা'}
          </h1>
          <p className="text-soft-gray mt-1 text-sm">
            Confidential area: Track revenue, leads, and operational goals.
          </p>
        </div>
        
        <button 
          onClick={() => { setEditMode(false); setFormData(initialFormState); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-electric hover:bg-bright-blue text-navy font-bold rounded-xl transition-all shadow-[0_10px_20px_rgba(22,139,255,0.2)] active:scale-95"
        >
          <Plus className="w-5 h-5" />
          {language === 'en' ? 'Set New Target' : 'নতুন টার্গেট নির্ধারণ করুন'}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" />
          <input 
            type="text"
            placeholder="Search by objective or team..."
            className="w-full bg-navy-surface border border-borderColor rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-electric outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="bg-navy-surface border border-borderColor rounded-2xl px-6 py-3.5 text-white focus:border-electric outline-none appearance-none font-bold"
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value as any)}
        >
          <option value="All">All Periods</option>
          <option value="Monthly">Monthly Goals</option>
          <option value="Quarterly">Quarterly Goals</option>
          <option value="Yearly">Yearly Goals</option>
        </select>
        <select 
          className="bg-navy-surface border border-borderColor rounded-2xl px-6 py-3.5 text-white focus:border-electric outline-none appearance-none font-bold"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="All">All Statuses</option>
          <option value="On Track">On Track</option>
          <option value="At Risk">At Risk</option>
          <option value="Achieved">Achieved</option>
          <option value="Missed">Missed</option>
        </select>
      </div>

      {/* Targets Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-white/[0.02] border border-borderColor rounded-3xl animate-pulse" />)}
        </div>
      ) : filteredTargets.length === 0 ? (
        <div className="glass-panel border-borderColor rounded-3xl p-20 flex flex-col items-center justify-center text-center">
          <Target className="w-16 h-16 text-white/10 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Targets Found</h3>
          <p className="text-soft-gray text-sm">Create a new objective to start tracking progress.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTargets.map((target) => {
            const progress = calculateTargetProgress(target.achievedAmount, target.targetAmount);
            return (
              <div key={target.id} className="bg-navy-surface border border-borderColor rounded-3xl p-6 flex flex-col justify-between hover:border-electric transition-colors group relative overflow-hidden shadow-xl">
                
                {/* Background Glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-[40px] pointer-events-none" />

                <div>
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-navy border border-borderColor rounded-xl">
                        {getCategoryIcon(target.category)}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-soft-gray">{target.period}</span>
                        <h3 className="font-bold text-white leading-tight">{target.title}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="my-6">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-soft-gray">Progress</span>
                      <span className="font-bold text-white">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-navy border border-borderColor rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          progress >= 100 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 
                          progress > 50 ? 'bg-electric' : 'bg-amber-500'
                        }`} 
                        style={{ width: `${progress}%` }} 
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-2 font-mono">
                      <span className="text-white/60">
                        {target.category === 'Revenue' ? '$' : ''}{target.achievedAmount.toLocaleString()}
                      </span>
                      <span className="text-soft-gray">
                        Goal: {target.category === 'Revenue' ? '$' : ''}{target.targetAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-borderColor flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(target.status)}`}>
                    {target.status}
                  </span>
                  
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(target)} className="p-2 bg-white/5 hover:bg-electric text-white hover:text-navy rounded-lg transition-all"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(target.id!)} className="p-2 bg-white/5 hover:bg-red-500 text-white rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                {/* Deadlines & Teams */}
                <div className="mt-4 flex gap-4 text-[10px] text-soft-gray uppercase font-bold">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {target.deadline}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {target.responsibleTeam}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Target Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/98 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-4xl bg-navy-surface border border-borderColor rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="p-6 lg:p-8 border-b border-borderColor flex justify-between items-center bg-white/[0.01]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-electric/10 flex items-center justify-center text-electric"><Target className="w-6 h-6" /></div>
                <div>
                  <h2 className="text-xl font-bold text-white">{editMode ? 'Update Progress' : 'Set New Target'}</h2>
                  <p className="text-[10px] text-soft-gray uppercase tracking-widest font-mono mt-0.5">Performance Management</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/5 rounded-full text-soft-gray transition-all"><X /></button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 space-y-12 pb-32">
              
              {/* Objective Definition */}
              <div className="space-y-6">
                 <h3 className="text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4">
                    <span className="w-10 h-[1px] bg-electric/30"></span> 01. Objective Definition
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] font-bold text-soft-gray uppercase">Target Title</label>
                       <input required type="text" placeholder="e.g. Q3 North America Revenue" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-soft-gray uppercase">Category</label>
                       <select className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none appearance-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as any})}>
                          <option value="Revenue">Revenue ($)</option>
                          <option value="Lead Generation">Lead Generation</option>
                          <option value="Project Completion">Project Completion</option>
                          <option value="Client Retention">Client Retention</option>
                          <option value="Team Growth">Team Growth</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-soft-gray uppercase">Evaluation Period</label>
                       <select className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none appearance-none" value={formData.period} onChange={(e) => setFormData({...formData, period: e.target.value as any})}>
                          <option value="Monthly">Monthly</option>
                          <option value="Quarterly">Quarterly</option>
                          <option value="Yearly">Yearly</option>
                       </select>
                    </div>
                 </div>
              </div>

              {/* Metrics & Logistics */}
              <div className="space-y-6">
                 <h3 className="text-xs font-black text-purple uppercase tracking-[0.3em] flex items-center gap-4">
                    <span className="w-10 h-[1px] bg-purple/30"></span> 02. Metrics & Logistics
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-soft-gray uppercase">Target Amount (Goal)</label>
                       <input required type="number" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white font-mono focus:border-electric outline-none" value={formData.targetAmount} onChange={(e) => setFormData({...formData, targetAmount: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-soft-gray uppercase">Achieved Amount (Current)</label>
                       <input required type="number" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white font-mono focus:border-electric outline-none" value={formData.achievedAmount} onChange={(e) => setFormData({...formData, achievedAmount: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-soft-gray uppercase">Deadline</label>
                       <input required type="date" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white font-mono focus:border-electric outline-none" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-soft-gray uppercase">Responsible Team / Person</label>
                       <input required type="text" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none" value={formData.responsibleTeam} onChange={(e) => setFormData({...formData, responsibleTeam: e.target.value})} />
                    </div>
                 </div>
              </div>

              {/* Status & Actions */}
              <div className="space-y-6">
                 <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] flex items-center gap-4">
                    <span className="w-10 h-[1px] bg-amber-500/30"></span> 03. Evaluation & Plan
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-soft-gray uppercase">Current Status</label>
                          <select className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none appearance-none" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})}>
                             <option value="On Track">On Track</option>
                             <option value="At Risk">At Risk</option>
                             <option value="Achieved">Achieved</option>
                             <option value="Missed">Missed</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-soft-gray uppercase">Internal Notes</label>
                          <textarea rows={3} className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none resize-none" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Why is this on track or at risk?" />
                       </div>
                    </div>
                    
                    <div className="space-y-2 bg-navy border border-borderColor rounded-2xl p-6">
                       <label className="text-[10px] font-bold text-electric uppercase flex items-center gap-1.5 mb-2"><ListTodo className="w-3.5 h-3.5" /> Action Items</label>
                       <input 
                         type="text" placeholder="Type step & press Enter..." 
                         className="w-full bg-navy-surface border border-borderColor rounded-xl px-4 py-2.5 text-xs text-white focus:border-electric outline-none mb-3" 
                         value={actionInput} onChange={(e) => setActionInput(e.target.value)} onKeyDown={addActionItem}
                       />
                       <ul className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                         {formData.actionItems.map((item, idx) => (
                           <li key={idx} className="flex justify-between items-start gap-2 text-xs text-soft-gray bg-white/[0.02] p-2 rounded-lg">
                             <span className="leading-tight"><span className="text-electric mr-1">•</span>{item}</span>
                             <button type="button" onClick={() => removeActionItem(item)} className="text-red-400 hover:text-red-300"><X className="w-3 h-3" /></button>
                           </li>
                         ))}
                         {formData.actionItems.length === 0 && <p className="text-xs text-white/20 italic text-center py-4">No action items defined.</p>}
                       </ul>
                    </div>
                 </div>
              </div>

              {/* Sticky Footer */}
              <div className="fixed bottom-0 left-0 right-0 p-6 bg-navy-surface/80 backdrop-blur-xl border-t border-borderColor z-10 flex items-center justify-end gap-4 shadow-[0_-10px_40px_rgba(7,20,38,0.5)]">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 bg-white/5 text-white font-bold rounded-xl transition-all">Discard</button>
                  <button type="submit" className="px-12 py-3 bg-electric hover:bg-bright-blue text-navy font-black rounded-xl transition-all shadow-[0_10px_40px_rgba(22,139,255,0.3)] flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    {editMode ? 'Update Progress' : 'Set Objective'}
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};