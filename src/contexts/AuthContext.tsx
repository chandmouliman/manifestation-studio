import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface User {
  id: string; // Changed to string for Firebase UID
  uid?: string; // Support both id and uid
  email: string | null;
  name: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  phone_number?: string | null;
  plan?: string | null;
  subscription_until?: string | null;
  trialDaysUsed?: number;
  isTrialExpired?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  logout: () => void;
  isLoading: boolean;
  syncWithBackend: (firebaseUser: FirebaseUser) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const syncWithBackend = async (firebaseUser: FirebaseUser) => {
    // Create a fallback user object from Firebase in case backend sync fails
    const fallbackUser: User = {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      plan: 'free' // Default to free plan if backend is unreachable
    };

    try {
      const idToken = await firebaseUser.getIdToken();
      setToken(idToken);
      localStorage.setItem('auth_token', idToken);
      
      // Attempt to sync with backend
      const response = await fetch(`${API_URL}/api/auth/firebase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          phone: firebaseUser.phoneNumber,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      } else {
        console.warn("Backend sync failed with status:", response.status, "using fallback.");
        setUser(fallbackUser);
        localStorage.setItem('auth_user', JSON.stringify(fallbackUser));
      }
    } catch (error) {
      console.error("Failed to sync with backend, using fallback:", error);
      setUser(fallbackUser);
      localStorage.setItem('auth_user', JSON.stringify(fallbackUser));
    }
  };

  useEffect(() => {
    // Try to load user from localStorage immediately to prevent flicker/logout on refresh
    const savedUser = localStorage.getItem('auth_user');
    const savedToken = localStorage.getItem('auth_token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        console.error("Failed to parse saved user:", e);
      }
    }
    let unsubscribe = () => {};
    
    try {
      if (auth && typeof auth.onAuthStateChanged === 'function') {
        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            await syncWithBackend(firebaseUser);
          } else {
            setToken(null);
            setUser(null);
            localStorage.removeItem('auth_token');
          }
          setIsLoading(false);
        });
      } else {
        console.error("Auth instance is not properly initialized.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error setting up auth state listener:", error);
      setIsLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const logout = () => {
    auth.signOut();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  return (
    <AuthContext.Provider value={{ user, token, logout, isLoading, syncWithBackend, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
