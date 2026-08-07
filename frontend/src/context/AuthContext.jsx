import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const DEFAULT_USERS = {
  reader: {
    id: 'reader-1',
    name: 'Ananya Sharma',
    email: 'ananya@bookverse.in',
    role: 'reader',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Avid collector of historical realism and modern Indian philosophy.'
  },
  author: {
    id: 'kalki-krishnamurthy',
    name: 'Kalki Krishnamurthy',
    email: 'kalki@bookverse.in',
    role: 'author',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Master storyteller of Tamil historical realism.'
  },
  publisher: {
    id: 'publisher-1',
    name: 'Editorial Control Desk',
    email: 'editor@bookverse.studio',
    role: 'publisher',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    bio: 'Chief Editor & Catalog Registrar'
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('bookverse_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    // Default to mock logged-in reader for immediate rich experience
    return DEFAULT_USERS.reader;
  });

  const login = (role = 'reader', customEmail, customName) => {
    const userProfile = {
      ...(DEFAULT_USERS[role] || DEFAULT_USERS.reader),
      email: customEmail || (DEFAULT_USERS[role] ? DEFAULT_USERS[role].email : 'user@bookverse.in'),
      name: customName || (DEFAULT_USERS[role] ? DEFAULT_USERS[role].name : 'BookVerse User'),
      role
    };

    setCurrentUser(userProfile);
    localStorage.setItem('bookverse_user', JSON.stringify(userProfile));
    return userProfile;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bookverse_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, DEFAULT_USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
