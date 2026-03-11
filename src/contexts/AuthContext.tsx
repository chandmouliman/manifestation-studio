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

  const API_URL = 'http://localhost:5001';

  const syncWithBackend = async (firebaseUser: FirebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken();
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
        setToken(idToken);
        setUser(data.user);
        localStorage.setItem('auth_token', idToken);
      }
    } catch (error) {
      console.error("Failed to sync with backend:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await syncWithBackend(firebaseUser);
      } else {
        setToken(null);
        setUser(null);
        localStorage.removeItem('auth_token');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    auth.signOut();
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
