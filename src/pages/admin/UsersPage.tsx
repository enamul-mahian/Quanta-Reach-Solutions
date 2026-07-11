import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Shield, 
  Search, 
  User as UserIcon, 
  ShieldAlert, 
  Check, 
  Mail,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

// ইউজার ডাটা ইন্টারফেস
interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  createdAt?: any;
}

export const UsersPage: React.FC = () => {
  const { language } = useLanguage();
  const { currentUser, role: currentUserRole } = useAuth(); // কারেন্ট ইউজারের রোল চেক করার জন্য
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'All'>('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ১. ইউজার ডাটা ফেচিং
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const fetchedUsers = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as UserData[];
      
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ২. রোল আপডেট লজিক
  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    // সিকিউরিটি চেক: শুধুমাত্র সুপার-অ্যাডমিন রোল পরিবর্তন করতে পারবে
    if (currentUserRole !== 'super-admin') {
      toast.error(language === 'en' ? 'Only Super Admins can change roles.' : 'শুধুমাত্র সুপার-অ্যাডমিন রোল পরিবর্তন করতে পারবেন।');
      return;
    }

    // নিজে নিজের রোল পরিবর্তন করতে পারবে না (লক-আউট এড়ানোর জন্য)
    if (uid === currentUser?.uid) {
      toast.error('You cannot change your own role!');
      return;
    }

    setUpdatingId(uid);
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: serverTimestamp()
      });
      
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  // ৩. ফিল্টারিং
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.displayName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // UI Helpers
  const getRoleColor = (userRole: UserRole) => {
    switch (userRole) {
      case 'super-admin': return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'admin': return 'bg-electric/10 text-electric border-electric/30';
      case 'editor': return 'bg-purple/10 text-purple border-purple/30';
      case 'client': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default: return 'bg-white/5 text-soft-gray border-white/10';
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-electric" />
            {language === 'en' ? 'User Access & Roles' : 'ইউজার ও অ্যাক্সেস ম্যানেজমেন্ট'}
          </h1>
          <p className="text-soft-gray mt-1 text-sm">
            Control permissions, assign admin roles, and manage client portal access.
          </p>
        </div>
      </div>

      {/* Security Warning */}
      {currentUserRole !== 'super-admin' && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-500">Restricted Access</h4>
            <p className="text-xs text-amber-500/70 mt-1">You are viewing this page as an {currentUserRole}. Only Super Admins can modify user roles.</p>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" />
          <input 
            type="text"
            placeholder="Search by name or email..."
            className="w-full bg-navy-surface border border-borderColor rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-electric outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="bg-navy-surface border border-borderColor rounded-2xl px-6 py-3.5 text-white focus:border-electric outline-none appearance-none font-bold"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as any)}
        >
          <option value="All">All Roles</option>
          <option value="super-admin">Super Admins</option>
          <option value="admin">Admins</option>
          <option value="editor">Editors</option>
          <option value="client">Clients</option>
          <option value="user">General Users</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="glass-panel border-borderColor rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.03] border-b border-borderColor text-[10px] font-mono uppercase tracking-[0.2em] text-soft-gray">
              <tr>
                <th className="px-8 py-5">User Profile</th>
                <th className="px-6 py-5">System Role</th>
                <th className="px-6 py-5">Joined Date</th>
                <th className="px-8 py-5 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderColor/50">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse"><td colSpan={4} className="px-8 py-8 bg-white/[0.01]" /></tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center text-soft-gray">No users found.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.uid} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-navy border border-borderColor overflow-hidden flex items-center justify-center">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-5 h-5 text-white/20" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            {user.displayName || 'Unnamed User'}
                            {user.uid === currentUser?.uid && <span className="text-[9px] px-1.5 py-0.5 bg-electric/20 text-electric rounded-md uppercase">You</span>}
                          </h4>
                          <p className="text-[11px] text-soft-gray flex items-center gap-1.5 mt-1 font-mono">
                            <Mail className="w-3 h-3" /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-xs text-soft-gray flex items-center gap-1.5 font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {/* Role Assignment Dropdown - Only enabled for super-admin and not for themselves */}
                      <select 
                        disabled={currentUserRole !== 'super-admin' || user.uid === currentUser?.uid || updatingId === user.uid}
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.uid, e.target.value as UserRole)}
                        className="bg-navy border border-borderColor rounded-xl px-4 py-2.5 text-xs text-white focus:border-electric outline-none disabled:opacity-30 disabled:cursor-not-allowed appearance-none min-w-[140px] text-center cursor-pointer transition-all hover:bg-navy-surface"
                      >
                        <option value="super-admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="client">Client</option>
                        <option value="user">User</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};