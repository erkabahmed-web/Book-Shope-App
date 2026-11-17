import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'little-bookshop-demo-user';

function readUser() {
  const savedUser = window.localStorage.getItem(STORAGE_KEY);
  return savedUser ? JSON.parse(savedUser) : null;
}

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(readUser);

  function signIn({ email, role }) {
    if (!['customer', 'admin'].includes(role)) {
      throw new Error('Choose a demo account type to continue.');
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = {
      id: normalizedEmail,
      email: normalizedEmail,
      display_name: role === 'admin' ? 'Shopkeeper' : normalizedEmail.split('@')[0],
      role,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setProfile(user);
    return user;
  }

  function createDemoAccount({ email, displayName, role }) {
    if (!['customer', 'admin'].includes(role)) {
      throw new Error('Choose a demo account type to continue.');
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = {
      id: normalizedEmail,
      email: normalizedEmail,
      display_name: displayName,
      role,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setProfile(user);
    return user;
  }

  function signOut() {
    window.localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  }

  function updateProfile(displayName) {
    if (!profile) throw new Error('Sign in before updating your profile.');
    const updatedProfile = { ...profile, display_name: displayName };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
  }

  const session = useMemo(
    () => (profile ? { user: { id: profile.id, email: profile.email } } : null),
    [profile],
  );

  return (
    <AuthContext.Provider value={{
      session,
      profile,
      loading: false,
      error: '',
      signIn,
      createDemoAccount,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
