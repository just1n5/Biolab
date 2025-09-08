import { create } from 'zustand';
import { User, UserRole } from '@/types';
import authService from '@/services/auth.service';
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
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.data) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        toast.success('Inicio de sesión exitoso');
      } else {
        throw new Error(response.message || 'Error al iniciar sesión');
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Error al iniciar sesión',
        isLoading: false,
      });
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
      throw error;
    }
  },

  register: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);
      
      if (response.success && response.data) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        toast.success('Registro exitoso');
      } else {
        throw new Error(response.message || 'Error al registrar');
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Error al registrar',
        isLoading: false,
      });
      toast.error(error.response?.data?.message || 'Error al registrar');
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      toast.success('Sesión cerrada exitosamente');
    } catch (error) {
      set({ isLoading: false });
      toast.error('Error al cerrar sesión');
    }
  },

  checkAuth: async () => {
    if (!authService.isAuthenticated()) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
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