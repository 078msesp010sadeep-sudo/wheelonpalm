import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile } from '../types';
import { 
  auth, 
  db, 
  googleProvider,
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signOut as fbSignOut, 
  sendEmailVerification as fbSendEmailVerification,
  sendPasswordResetEmail as fbSendPasswordReset,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isFirebaseActive: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (fullName: string, email: string, phone: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  requestProviderRole: (businessName: string, roleType: 'workshop' | 'roadside') => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_BOOTSTRAP_EMAIL = '078msesp010.sadeep@pcampus.edu.np';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync auth state listener with Firestore profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const path = `users/${fbUser.uid}`;
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userDocRef);

          const isBootstrappedAdmin = fbUser.email?.toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase();

          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            setUser({
              ...data,
              role: isBootstrappedAdmin ? 'admin' : data.role || 'customer',
              isEmailVerified: fbUser.emailVerified,
            });
          } else {
            // Create user profile in Firestore
            const newProf: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Vehicle Owner',
              phoneNumber: fbUser.phoneNumber || '+977 9800000000',
              role: isBootstrappedAdmin ? 'admin' : 'customer',
              isEmailVerified: fbUser.emailVerified,
              city: 'Kathmandu',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProf);
            setUser(newProf);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, path);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error('Login Error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (fullName: string, email: string, phone: string, password: string, _role: UserRole = 'customer') => {
    setIsLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCred.user;
      
      try {
        await fbSendEmailVerification(fbUser);
      } catch (e) {
        console.warn('Could not dispatch verification email:', e);
      }

      const isBootstrappedAdmin = email.toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase();
      const newProf: UserProfile = {
        uid: fbUser.uid,
        email,
        fullName,
        phoneNumber: phone,
        role: isBootstrappedAdmin ? 'admin' : 'customer',
        isEmailVerified: fbUser.emailVerified,
        city: 'Kathmandu',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const path = `users/${fbUser.uid}`;
      try {
        await setDoc(doc(db, 'users', fbUser.uid), newProf);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
      setUser(newProf);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await fbSignOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  const sendVerificationEmail = async () => {
    if (firebaseUser) {
      await fbSendEmailVerification(firebaseUser);
    }
  };

  const sendPasswordReset = async (email: string) => {
    await fbSendPasswordReset(auth, email);
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const path = `users/${user.uid}`;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      setUser((prev) => (prev ? { ...prev, ...data, updatedAt: new Date().toISOString() } : null));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const requestProviderRole = async (businessName: string, roleType: 'workshop' | 'roadside') => {
    if (!user) return;
    const path = `users/${user.uid}`;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        providerBusinessName: businessName,
        providerApplicationStatus: 'pending',
        targetProviderRole: roleType,
        updatedAt: new Date().toISOString(),
      });
      setUser((prev) =>
        prev
          ? {
              ...prev,
              providerBusinessName: businessName,
              providerApplicationStatus: 'pending',
              updatedAt: new Date().toISOString(),
            }
          : null
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const switchDemoRole = (newRole: UserRole) => {
    if (!user) return;
    setUser({ ...user, role: newRole });
  };

  const deleteAccount = async () => {
    if (firebaseUser) {
      await firebaseUser.delete();
    }
    setUser(null);
    setFirebaseUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        isFirebaseActive: true,
        login,
        loginWithGoogle,
        signup,
        logout,
        sendVerificationEmail,
        sendPasswordReset,
        updateProfileData,
        requestProviderRole,
        switchDemoRole,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
