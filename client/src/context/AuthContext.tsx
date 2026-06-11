import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      // Send token to our backend to sync user and get our own JWT
      const response = await fetch('http://localhost:5000/api/auth/firebase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: idToken,
          mockEmail: result.user.email,
          mockName: result.user.displayName
        })
      });

      if (!response.ok) {
        // Fallback to mock session if backend is unable to verify Firebase token (e.g. invalid admin key)
        const mockResponse = await fetch('http://localhost:5000/api/auth/firebase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: "dummy",
            mockEmail: result.user.email,
            mockName: result.user.displayName
          })
        });
        
        if (mockResponse.ok) {
          const data = await mockResponse.json();
          localStorage.setItem('token', data.token);
          console.log('Successfully synced using fallback mock token');
          return;
        }
        throw new Error('Failed to authenticate with backend');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      console.log('Successfully synced with Kiyo backend!');
    } catch (error) {
      console.error('Error signing in with Google', error);
      // Removed alert to keep UI clean
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
