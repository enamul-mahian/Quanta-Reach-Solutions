import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// ইউজার রোল টাইপ নির্ধারণ
export type UserRole = 'super-admin' | 'admin' | 'editor' | 'client' | 'user';

// কন্টেইনার ডাটা ইন্টারফেস
interface AuthContextType {
  currentUser: User | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  hasRole: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ১. সাইন-ইন ফাংশন
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // ২. সাইন-আউট ফাংশن
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setRole(null);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // ৩. পাসওয়ার্ড রিকভারি ইমেইল সেন্ডার
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  // ৪. রোল ভেরিফিকেশন হেল্পার ফাংশন
  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!role) return false;
    return allowedRoles.includes(role);
  };

  // ৫. ফায়ারবেস অথেনটিকেশন ও ফায়ারস্টোর রোল ট্র্যাকিং স্টেট লিসেনার
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // ব্যবহারকারীর ইউআইডি দিয়ে Firestore-এর 'users' কালেকশন থেকে রোল রিট্রিভ করা হচ্ছে
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRole((userData.role as UserRole) || 'user');
          } else {
            // ডকুমেন্টে রোল ডিফাইন করা না থাকলে ডিফল্ট রোল 'user' অ্যাসাইন হবে
            setRole('user');
          }
        } catch (error) {
          console.warn("Firestore role retrieval failed. Falling back to default role: 'user'.", error);
          setRole('user');
        }
      } else {
        setRole(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    role,
    loading,
    login,
    logout,
    resetPassword,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        // ট্রানজিশন বা ইনিশিয়াল লোডিংয়ের সময় স্পিনার বা শাইন ওভারলে
        <div className="fixed inset-0 w-full h-full bg-[#071426] flex items-center justify-center">
          <div className="relative flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-[#168BFF]/20 border-t-[#168BFF] animate-spin" />
            <p className="text-xs font-mono text-white/40 tracking-widest uppercase">Securing Workspace...</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};