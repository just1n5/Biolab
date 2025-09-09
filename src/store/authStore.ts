import { create } from 'zustand';
import { User, UserRole } from '@/types';
import authService from '@/services/auth.service';
import { tokenManager } from '@/services/api';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    console.log('Attempting login with:', { email });
    
    try {
      const response = await authService.login({ email, password });
      
      console.log('Login response:', response);
      
      if (response.success && response.data) {
        // Guardar usuario en localStorage para persistencia
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        toast.success(`Bienvenido ${response.data.user.fullName}`);
      } else {
        throw new Error(response.message || 'Error al iniciar sesión');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error al iniciar sesión';
      
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
        user: null
      });
      
      toast.error(errorMessage);
      throw error;
    }
  },

  register: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);
      
      if (response.success && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        toast.success('Registro exitoso');
      } else {
        throw new Error(response.message || 'Error al registrar');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error al registrar';
      
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      tokenManager.clearTokens();
      localStorage.removeItem('user');
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
      toast.success('Sesión cerrada exitosamente');
    }
  },

  checkAuth: async () => {
    // Primero verificar si hay un token
    if (!authService.isAuthenticated()) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    // Intentar recuperar usuario del localStorage primero
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('user');
      }
    }

    // Luego verificar con el servidor
    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      localStorage.setItem('user', JSON.stringify(user));
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking auth:', error);
      tokenManager.clearTokens();
      localStorage.removeItem('user');
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  updateProfile: async (data: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await authService.updateProfile(data);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({
        user: updatedUser,
        isLoading: false,
      });
      toast.success('Perfil actualizado exitosamente');
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al actualizar perfil',
        isLoading: false,
      });
      toast.error('Error al actualizar perfil');
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  hasRole: (roles: UserRole[]) => {
    const { user } = get();
    if (!user) return false;
    return roles.includes(user.role);
  },

  hasPermission: (permission: string) => {
    const { user } = get();
    if (!user) return false;
    if (user.role === UserRole.ADMIN) return true;
    return user.permissions?.includes(permission) || false;
  },
}));

export default useAuthStore;