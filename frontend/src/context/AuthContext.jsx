import { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

/**
 * Utility helper for authenticated API requests
 */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('bookverse_token');
  const headers = {
    ...options.headers
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `API request failed with status ${response.status}`);
  }

  return data;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('bookverse_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    return DEFAULT_USERS.reader;
  });

  const [token, setToken] = useState(() => localStorage.getItem('bookverse_token') || null);
  const [loading, setLoading] = useState(false);

  // Rehydrate current user profile from backend on app load if token exists
  useEffect(() => {
    async function rehydrateUser() {
      const storedToken = localStorage.getItem('bookverse_token');
      if (!storedToken) return;

      try {
        const res = await apiFetch('/auth/me');
        if (res.success && res.data?.user) {
          const user = res.data.user;
          const formattedUser = {
            id: user._id || user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            bio: user.bio || '',
            handle: user.handle || ''
          };
          setCurrentUser(formattedUser);
          localStorage.setItem('bookverse_user', JSON.stringify(formattedUser));
        }
      } catch (err) {
        console.warn('Backend user rehydration notice:', err.message);
      }
    }

    rehydrateUser();
  }, []);

  const login = async (emailOrRole = 'reader', password, customName) => {
    setLoading(true);
    try {
      let email = emailOrRole;
      let pass = password || 'password123';

      if (DEFAULT_USERS[emailOrRole]) {
        email = DEFAULT_USERS[emailOrRole].email;
      }

      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: pass })
      });

      if (res.success && res.data) {
        const { token: jwtToken, user } = res.data;
        const userProfile = {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          bio: user.bio || '',
          handle: user.handle || ''
        };

        setToken(jwtToken);
        setCurrentUser(userProfile);
        localStorage.setItem('bookverse_token', jwtToken);
        localStorage.setItem('bookverse_user', JSON.stringify(userProfile));
        setLoading(false);
        return userProfile;
      }
    } catch (err) {
      console.warn('[Auth API Fallback]:', err.message);
      // Fallback for mock role clicks if backend unavailable
      const roleKey = DEFAULT_USERS[emailOrRole] ? emailOrRole : 'reader';
      const userProfile = {
        ...(DEFAULT_USERS[roleKey] || DEFAULT_USERS.reader),
        email: typeof emailOrRole === 'string' && emailOrRole.includes('@') ? emailOrRole : DEFAULT_USERS[roleKey].email,
        name: customName || DEFAULT_USERS[roleKey].name,
        role: roleKey
      };
      setCurrentUser(userProfile);
      localStorage.setItem('bookverse_user', JSON.stringify(userProfile));
      setLoading(false);
      return userProfile;
    }
  };

  const register = async (name, email, password, role = 'reader') => {
    setLoading(true);
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });

    if (res.success && res.data) {
      const { token: jwtToken, user } = res.data;
      const userProfile = {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio: user.bio || '',
        handle: user.handle || ''
      };

      setToken(jwtToken);
      setCurrentUser(userProfile);
      localStorage.setItem('bookverse_token', jwtToken);
      localStorage.setItem('bookverse_user', JSON.stringify(userProfile));
      setLoading(false);
      return userProfile;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('bookverse_token');
    localStorage.removeItem('bookverse_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, loading, login, register, logout, DEFAULT_USERS }}>
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
