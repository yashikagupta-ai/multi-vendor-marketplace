import { create } from 'zustand';

export const useAuth = create((set) => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
  } catch (e) {
    console.error('Failed to parse user from local storage');
  }

  return {
    user,
    token,
    isAuthenticated: !!token,
    login: (userData, authToken) => {
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData, token: authToken, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false });
    }
  };
});
