import { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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
 * Utility helper for API requests with cookie support
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
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include' // Always include HTTP-Only cookies
  });

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
        // ignore
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Rehydrate current user profile from backend on app load via GET /auth/me
  useEffect(() => {
    async function rehydrateUser() {
      try {
        const res = await apiFetch('/auth/me');
        if (res.success && res.data?.user) {
          const user = res.data.user;
          const formattedUser = {
            id: user._id || user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            country: user.country || 'India',
            penName: user.penName || '',
            avatarUrl: user.avatarUrl || user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            bio: user.bio || '',
            handle: user.handle || ''
          };
          setCurrentUser(formattedUser);
          localStorage.setItem('bookverse_user', JSON.stringify(formattedUser));
        }
      } catch (err) {
        // Session expired or unauthenticated
      } finally {
        setLoading(false);
      }
    }

    rehydrateUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: String(email).trim(), password })
      });

      if (res.success && res.data) {
        const { token: jwtToken, user } = res.data;
        if (jwtToken) {
          localStorage.setItem('bookverse_token', jwtToken);
        }

        const userProfile = {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          country: user.country || 'India',
          penName: user.penName || '',
          avatarUrl: user.avatarUrl || user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          bio: user.bio || '',
          handle: user.handle || ''
        };

        setCurrentUser(userProfile);
        localStorage.setItem('bookverse_user', JSON.stringify(userProfile));
        setLoading(false);
        return userProfile;
      }
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const registerReader = async (readerData) => {
    setLoading(true);
    try {
      const res = await apiFetch('/auth/register/reader', {
        method: 'POST',
        body: JSON.stringify(readerData)
      });

      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const registerAuthor = async (authorData) => {
    setLoading(true);
    try {
      const res = await apiFetch('/auth/register/author', {
        method: 'POST',
        body: JSON.stringify(authorData)
      });

      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const updateCurrentUser = (updates) => {
    setCurrentUser((prev) => {
      const updated = { ...(prev || {}), ...updates };
      localStorage.setItem('bookverse_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('bookverse_token');
    localStorage.removeItem('bookverse_user');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        registerReader,
        registerAuthor,
        updateCurrentUser,
        logout,
        DEFAULT_USERS
      }}
    >
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
