import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

const STORAGE_KEY = 'studentDesign_auth';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Simulate login functionality
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate network request
      setTimeout(() => {
        // In a real app, this would verify credentials with a backend
        // For demo purposes, we'll accept any email/password and create a mock user
        
        // Check if this user already exists in localStorage (for demo purposes)
        const storedUsers = JSON.parse(localStorage.getItem('studentDesign_users') || '[]');
        const existingUser = storedUsers.find(user => user.email === email);
        
        if (existingUser) {
          // Verify password (simple mock)
          if (existingUser.password !== password) {
            return reject(new Error('Invalid email or password'));
          }
          
          // Remove password before storing in context
          const { password: _, ...userWithoutPassword } = existingUser;
          setCurrentUser(userWithoutPassword);
          
          // Store in localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
          resolve(userWithoutPassword);
        } else {
          reject(new Error('User not found'));
        }
      }, 1000);
    });
  };

  // Simulate registration functionality
  const register = (name, email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate network request
      setTimeout(() => {
        // Get existing users or initialize empty array
        const storedUsers = JSON.parse(localStorage.getItem('studentDesign_users') || '[]');
        
        // Check if user already exists
        if (storedUsers.some(user => user.email === email)) {
          return reject(new Error('Email already in use'));
        }
        
        // Create new user with generated ID
        const newUser = {
          id: `user_${Date.now()}`,
          name,
          email,
          password, // In a real app, this would be encrypted
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
          bio: '',
          createdAt: new Date().toISOString(),
        };
        
        // Save to "database" (localStorage)
        localStorage.setItem('studentDesign_users', JSON.stringify([...storedUsers, newUser]));
        
        // Remove password before storing in context
        const { password: _, ...userWithoutPassword } = newUser;
        setCurrentUser(userWithoutPassword);
        
        // Store in auth context
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
        
        resolve(userWithoutPassword);
      }, 1000);
    });
  };

  // Logout functionality
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Update user profile
  const updateProfile = (updates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!currentUser) return;
        
        // Get all users
        const storedUsers = JSON.parse(localStorage.getItem('studentDesign_users') || '[]');
        
        // Find and update the current user
        const updatedUsers = storedUsers.map(user => {
          if (user.id === currentUser.id) {
            return { ...user, ...updates };
          }
          return user;
        });
        
        // Save back to localStorage
        localStorage.setItem('studentDesign_users', JSON.stringify(updatedUsers));
        
        // Update current user
        const updatedUser = { ...currentUser, ...updates };
        setCurrentUser(updatedUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
        
        resolve(updatedUser);
      }, 500);
    });
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 